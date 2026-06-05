// دالة تأخذ نقطتين وترجع المسار الحقيقي على الشوارع
export interface LatLng {
    lat: number;
    lng: number;
    timestamp: string;
}

export async function snapRouteToRoads(points: LatLng[]): Promise<LatLng[]> {
    try {
        // تحويل النقاط لصيغة OSRM: lng,lat;lng,lat
        const coordinates = points
            .map((p) => `${p.lng},${p.lat}`)
            .join(";");

        // استدعاء OSRM API المجاني
        const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== "Ok" || !data.routes?.[0]) {
            console.warn("OSRM failed, using original points");
            return points;
        }

        // استخراج نقاط المسار من الاستجابة
        const routeCoords = data.routes[0].geometry.coordinates;

        // تحويل النقاط لصيغة GpsCoordinate مع توزيع الوقت
        const startTime = new Date(points[0].timestamp).getTime();
        const endTime = new Date(points[points.length - 1].timestamp).getTime();
        const timeStep = (endTime - startTime) / (routeCoords.length - 1);

        return routeCoords.map((coord: [number, number], index: number) => ({
            lng: coord[0],
            lat: coord[1],
            timestamp: new Date(startTime + timeStep * index).toISOString(),
        }));
    } catch (error) {
        console.warn("OSRM error, using original points:", error);
        return points; // ارجع للنقاط الأصلية إذا فشل
    }
}