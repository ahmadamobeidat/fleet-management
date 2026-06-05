export interface LatLng {
    lat: number
    lng: number
    timestamp: string
}

export async function snapRouteToRoads(points: LatLng[]): Promise<LatLng[]> {
    try {
        const coords = points.map((p) => `${p.lng},${p.lat}`).join(";")
        const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`

        const res = await fetch(url)
        const data = await res.json()

        if (data.code !== "Ok" || !data.routes?.[0]) {
            return points
        }

        const routeCoords = data.routes[0].geometry.coordinates
        const startTime = new Date(points[0].timestamp).getTime()
        const endTime = new Date(points[points.length - 1].timestamp).getTime()
        const step = (endTime - startTime) / (routeCoords.length - 1)

        return routeCoords.map((coord: [number, number], i: number) => ({
            lng: coord[0],
            lat: coord[1],
            timestamp: new Date(startTime + step * i).toISOString(),
        }))
    } catch (err) {
        console.warn("OSRM failed:", err)
        return points
    }
}
