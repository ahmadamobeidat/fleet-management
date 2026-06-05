import { NextResponse } from "next/server";
import vehiclesData from "@/data/vehicles.json";

export async function GET() {
    try {
        return NextResponse.json(vehiclesData, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch vehicles" },
            { status: 500 }
        );
    }
}