import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/shopify";

export async function GET(req: NextRequest) {
    const query =  "";

    try {
        const products = await getProducts({
            query,
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);

        return NextResponse.json([], {
            status: 500,
        });
    }
}