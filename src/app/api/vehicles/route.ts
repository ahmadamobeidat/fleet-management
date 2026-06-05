import { NextResponse } from "next/server";
import vehiclesData from "@/data/vehicles.json";
import { snapRouteToRoads } from "@/utils/snapToRoads";

export async function GET() {
    try {
        // معالجة كل مركبة وتحويل مسارها لطرق حقيقية
        const vehiclesWithRoads = await Promise.all(
            vehiclesData.map(async (vehicle) => {
                const snappedRoute = await snapRouteToRoads(vehicle.route);
                return {
                    ...vehicle,
                    route: snappedRoute,
                };
            })
        );

        return NextResponse.json(vehiclesWithRoads, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch vehicles" },
            { status: 500 }
        );
    }
}