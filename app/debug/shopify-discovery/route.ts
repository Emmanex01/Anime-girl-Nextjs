import { NextResponse } from "next/server";

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;

  const response = await fetch(
    `https://${domain}/.well-known/openid-configuration`,
    {
      cache: "no-store",
    },
  );

  const text = await response.text();

  return new NextResponse(text, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}