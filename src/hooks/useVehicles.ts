import { useQuery } from "@tanstack/react-query"
import { Vehicle } from "@/types/vehicle"

export function useVehicles() {
    return useQuery<Vehicle[]>({
        queryKey: ["vehicles"],
        queryFn: async () => {
            const res = await fetch("/api/vehicles")
            if (!res.ok) throw new Error("Failed to fetch vehicles")
            return res.json()
        },
        retry: 1,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    })
}
