import { NextResponse } from "next/server";
import {
  exchangeAuthorizationCode,
  hashState,
} from "@/lib/auth/oauth";
import { prisma } from "@/lib/prisma";
import {
  createCustomerSession,
  getCustomerSession,
} from "@/lib/auth/session";
import { updateCartBuyerIdentity } from "@/lib/shopify";
import { cookies } from "next/headers";

function getBaseUrl(request: Request) {
  // If you define an APP_URL in your .env (e.g. your ngrok domain), use it
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "localhost:3000";

  // If running on localhost, use http:// unless forwarded otherwise
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const proto = request.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host}`;
  }
  

  const proto = request.headers.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseUrl = getBaseUrl(request);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  console.log("OAuth callback received with parameters:", {
    code,
    state,
    error,
  });

  console.log("OAuth base URL:", baseUrl);
  console.log("Request URL:", request.url);
  console.log(
    "Forwarded host:",
    request.headers.get("x-forwarded-host"),
  );
  console.log(
    "Forwarded proto:",
    request.headers.get("x-forwarded-proto"),
  );

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, baseUrl),
    );
  }

  if (!code || !state) {
    throw new Error("Missing code or state parameter");
  }

  const oauthState = await prisma.oAuthState.findUnique({
    where: {
      stateHash: hashState(state),
    },
  });

  // app/auth/callback/route.ts

// Check if user is already logged in from the first callback execution
  const existingSession = await getCustomerSession(); // your session helper
  if (existingSession) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  if (!oauthState || oauthState.expiresAt.getTime() < Date.now()) {
    console.warn("OAuth state missing or expired; redirecting to login");
    return NextResponse.redirect(new URL('/auth/login?error=invalid_state', request.url));
  }

  // if (oauthState.expiresAt.getTime() < Date.now()) {
  //   await prisma.oAuthState.delete({
  //     where: { id: oauthState.id },
  //   });
  //   return new NextResponse("OAuth state expired", { status: 400 });
  // }

  await prisma.oAuthState.delete({
    where: { id: oauthState.id },
  });

  try {
    const tokens = await exchangeAuthorizationCode(
      code,
      oauthState.codeVerifier,
    );

    console.log("Tokens received from Shopify:", tokens);

    await createCustomerSession({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      idToken: tokens.id_token,
    });

    // Associate existing cart with authenticated customer
    const cartId = (await cookies()).get("cartId")?.value;
    if (cartId) {
      try {
        await updateCartBuyerIdentity(cartId, tokens.access_token);
        console.log("Cart buyer identity updated successfully");
      } catch (cartError) {
        // Log the error but don't break the login flow
        console.error(
          "Failed to update cart buyer identity:",
          cartError
        );
      }
    }

    // Make sure returnTo is treated as a relative path
    const destinationPath = oauthState.returnTo?.startsWith("/")
      ? oauthState.returnTo
      : "/account";

    return NextResponse.redirect(new URL(destinationPath, baseUrl));
  } catch (error) {
    console.error("Customer authentication failed", error);

    return NextResponse.redirect(
      new URL("/login?error=authentication_failed", baseUrl),
    );
  }
}