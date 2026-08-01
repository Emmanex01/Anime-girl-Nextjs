import { NextResponse } from "next/server";
import { getCollections } from "@/lib/shopify";

export async function GET() {

    try {
        const collections = await getCollections();

        return NextResponse.json(collections);
    } catch (error) {
        console.error(error);

        return NextResponse.json([], {
            status: 500,
        });
    }
}