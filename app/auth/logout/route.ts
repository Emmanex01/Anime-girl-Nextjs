import { NextResponse } from "next/server";
import {
  destroyCustomerSession,
  getSessionId,
} from "@/lib/auth/session";
import {
  getOpenIdConfiguration,
} from "@/lib/auth/oauth";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/auth/crypto";

export async function GET(
  request: Request,
) {
  const url = new URL(request.url);
   const sessionId = await getSessionId();

   if (!sessionId) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  const session =
    await prisma.customerSession.findUnique({
      where: {
        id : sessionId,
      },
    });

  const config =
    await getOpenIdConfiguration();

  await destroyCustomerSession();

  if (!session?.id) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  if (!session?.idToken) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  const idToken = decrypt(session.idToken);

  const logoutUrl = new URL(
    config.end_session_endpoint,
  );

  logoutUrl.searchParams.set(
    "id_token_hint",
    idToken,
  );

  logoutUrl.searchParams.set(
    "post_logout_redirect_uri",
    process.env.NEXT_PUBLIC_APP_URL!,
  );

  return NextResponse.redirect(
    logoutUrl,
  );
}