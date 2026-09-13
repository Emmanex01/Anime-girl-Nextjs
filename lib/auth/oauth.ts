import crypto from "node:crypto";

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID!;

const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET!;

const APP_URL = "localhost:3000";

export function getCallbackUrl(): string {
  return `https://bunt-rundown-zealous.ngrok-free.dev/auth/callback`;
}

export async function getOpenIdConfiguration() {
  const response = await fetch(
    `https://${SHOP_DOMAIN}/.well-known/openid-configuration`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to discover Shopify authentication configuration: ${response.status}`,
    );
  }

  return response.json() as Promise<{
    authorization_endpoint: string;
    token_endpoint: string;
    end_session_endpoint: string;
    issuer: string;
    jwks_uri: string;
  }>;
}

export async function getCustomerApiConfiguration() {
  const response = await fetch(
    `https://${SHOP_DOMAIN}/.well-known/customer-account-api`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to discover Customer Account API: ${response.status}`,
    );
  }

  return response.json() as Promise<{
    graphql_api: string;
    mcp_api?: string;
  }>;
}

function base64Url(buffer: Buffer): string {
  return buffer.toString("base64url");
}

export function generateState(): string {
  return base64Url(crypto.randomBytes(32));
}

export function generateNonce(): string {
  return base64Url(crypto.randomBytes(32));
}

export function generateCodeVerifier(): string {
  return base64Url(crypto.randomBytes(32));
}

export function generateCodeChallenge(
  verifier: string,
): string {
  return base64Url(
    crypto
      .createHash("sha256")
      .update(verifier)
      .digest(),
  );
}

export function hashState(state: string): string {
  return crypto
    .createHash("sha256")
    .update(state)
    .digest("hex");
}

export function getBasicAuthHeader(): string {
  const credentials = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`,
  ).toString("base64");

  return `Basic ${credentials}`;
}

export async function exchangeAuthorizationCode(
  code: string,
  codeVerifier: string,
) {
  const config = await getOpenIdConfiguration();

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    redirect_uri: getCallbackUrl(),
    code,
    code_verifier: codeVerifier,
  });

  const response = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
      Authorization: getBasicAuthHeader(),
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Shopify token exchange failed: ${response.status} ${text}`,
    );
  }

  return response.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    id_token: string;
  }>;
}

export async function refreshAccessToken(
  refreshToken: string,
) {
  const config = await getOpenIdConfiguration();

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(config.token_endpoint, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
      Authorization: getBasicAuthHeader(),
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Shopify token refresh failed: ${response.status} ${text}`,
    );
  }

  return response.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  }>;
}