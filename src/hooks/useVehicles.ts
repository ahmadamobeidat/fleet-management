// React Query hook لجلب بيانات المركبات
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/types/vehicle";

export function useVehicles() {
    return useQuery<Vehicle[]>({
        queryKey: ["vehicles"], // مفتاح التخزين المؤقت

        queryFn: async () => {
            const response = await fetch("/api/vehicles");
            if (!response.ok) {
                throw new Error("Failed to fetch vehicles");
            }
            return response.json();
        },

        retry: 1,
        refetchInterval: 30000,    // تحديث كل 30 ثانية
        refetchOnWindowFocus: false,
    });
}