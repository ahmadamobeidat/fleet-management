import { NextResponse } from "next/server"
import vehiclesData from "@/data/vehicles.json"
import { snapRouteToRoads } from "@/utils/snapToRoads"

export async function GET() {
    try {
        const vehicles = await Promise.all(
            vehiclesData.map(async (vehicle) => ({
                ...vehicle,
                route: await snapRouteToRoads(vehicle.route),
            }))
        )
        return NextResponse.json(vehicles, { status: 200 })
    } catch {
        return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
    }
}
