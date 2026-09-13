import { NextResponse } from "next/server";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateNonce,
  generateState,
  getCallbackUrl,
  getOpenIdConfiguration,
  hashState,
} from "@/lib/auth/oauth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const returnTo = url.searchParams.get(
    "returnTo",
  );

  const safeReturnTo =
    returnTo?.startsWith("/") &&
    !returnTo.startsWith("//")
      ? returnTo
      : "/account";

  const state = generateState();
  const nonce = generateNonce();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge =
    generateCodeChallenge(codeVerifier);

  await prisma.oAuthState.create({
    data: {
      stateHash: hashState(state),
      codeVerifier,
      nonce,
      returnTo: safeReturnTo,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000,
      ),
    },
  });

  const config =
    await getOpenIdConfiguration();

  const authorizationUrl = new URL(
    config.authorization_endpoint,
  );

  authorizationUrl.searchParams.set(
  "scope",
  "openid email customer-account-api:full",
);


  authorizationUrl.searchParams.set(
    "client_id",
    process.env.SHOPIFY_CLIENT_ID!,
  );

  authorizationUrl.searchParams.set(
    "response_type",
    "code",
  );

  authorizationUrl.searchParams.set(
    "redirect_uri",
    getCallbackUrl(),
  );

  authorizationUrl.searchParams.set(
    "state",
    state,
  );

  authorizationUrl.searchParams.set(
    "nonce",
    nonce,
  );

  authorizationUrl.searchParams.set(
    "code_challenge",
    codeChallenge,
  );

  authorizationUrl.searchParams.set(
    "code_challenge_method",
    "S256",
  );

  return NextResponse.redirect(
    authorizationUrl,
  );
}