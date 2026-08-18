import { NextRequest, NextResponse } from "next/server";
import {
  getCollectionProducts,
} from "@/lib/shopify";
import { Product } from "@/app/types";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const collection = searchParams.get("collection") ?? "";
    const sortKey = searchParams.get("sortKey") ?? undefined;

    const reverse =
      searchParams.get("reverse") === "true";

    const products: Product[] = await getCollectionProducts({
        collection,
        sortKey,
        reverse,
      });

    return NextResponse.json(products);
    } catch (error) {
    console.error("Products API Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}
