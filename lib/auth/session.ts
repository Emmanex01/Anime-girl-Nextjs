"use server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  decrypt,
  encrypt,
} from "./crypto";
import {
  refreshAccessToken,
} from "./oauth";

const COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME ??
  "shopify_customer_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function createCustomerSession(params: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  idToken: string;
}) {
  const session = await prisma.customerSession.create({
    data: {
      accessToken: encrypt(params.accessToken),
      refreshToken: encrypt(params.refreshToken),
      expiresAt: new Date(
        Date.now() + params.expiresIn * 1000,
      ),
      idToken: encrypt(params.idToken),
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return session;
}

export async function getSessionId() {
  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function destroyCustomerSession() {
  const sessionId = await getSessionId();

  if (sessionId) {
    await prisma.customerSession.deleteMany({
      where: {
        id: sessionId,
      },
    });
  }

  // Safely delete cookies only if we are in a Route Handler or Server Action
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch {
    // In Server Components (read-only render), deleting cookies is forbidden.
    // We safely catch and ignore it so Next.js does not crash.
  }
}

export async function getCustomerSession() {
  const sessionId = await getSessionId();

  if (!sessionId) {
    return null;
  }

  const session = await prisma.customerSession.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    return null;
  }

  // Refresh if token expires within the next 5 MINUTES (not 5 hours)
  const refreshThresholdInSeconds = 5 * 60;

  const expiresSoon =
    session.expiresAt.getTime() <
    Date.now() + refreshThresholdInSeconds * 1000;

  if (!expiresSoon) {
    return {
      id: session.id,
      accessToken: decrypt(session.accessToken),
      refreshToken: decrypt(session.refreshToken),
      expiresAt: session.expiresAt,
    };
  }

  try {
    const refreshed = await refreshAccessToken(
      decrypt(session.refreshToken),
    );

    const nextRefreshToken =
      refreshed.refresh_token ??
      decrypt(session.refreshToken);

    const updated = await prisma.customerSession.update({
      where: {
        id: session.id,
      },
      data: {
        accessToken: encrypt(refreshed.access_token),
        refreshToken: encrypt(nextRefreshToken),
        expiresAt: new Date(
          Date.now() + refreshed.expires_in * 1000,
        ),
      },
    });

    return {
      id: updated.id,
      accessToken: decrypt(updated.accessToken),
      refreshToken: decrypt(updated.refreshToken),
      expiresAt: updated.expiresAt,
    };
  } catch (err) {
    console.error("Token refresh failed:", err);
    await destroyCustomerSession();
    return null;
  }
}