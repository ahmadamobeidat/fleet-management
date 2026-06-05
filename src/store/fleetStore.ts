import { create } from "zustand"
import { Vehicle, PlaybackState, StatusFilter } from "@/types/vehicle"

interface FleetStore {
    vehicles: Vehicle[]
    originalVehicles: Vehicle[]
    selectedVehicle: Vehicle | null
    playbackState: PlaybackState
    currentPositionIndex: Record<string, number>
    searchQuery: string
    statusFilter: StatusFilter
    isDarkMode: boolean

    setVehicles: (vehicles: Vehicle[]) => void
    selectVehicle: (vehicle: Vehicle | null) => void
    play: () => void
    pause: () => void
    reset: () => void
    tickPosition: (vehicleId: string) => void
    setSearchQuery: (query: string) => void
    setStatusFilter: (filter: StatusFilter) => void
    toggleDarkMode: () => void
}

export const useFleetStore = create<FleetStore>((set) => ({
    vehicles: [],
    originalVehicles: [],
    selectedVehicle: null,
    playbackState: "stopped",
    currentPositionIndex: {},
    searchQuery: "",
    statusFilter: "All",
    isDarkMode: false,

    setVehicles: (vehicles) => set({
        originalVehicles: JSON.parse(JSON.stringify(vehicles)),
        vehicles: vehicles.map((v) => ({
            ...v,
            status: "Stopped" as const,
            speed: 0,
        })),
    }),

    selectVehicle: (selectedVehicle) => set({ selectedVehicle }),

    play: () => set({ playbackState: "playing" }),

    pause: () =>
        set((state) => ({
            playbackState: "paused",
            vehicles: state.vehicles.map((v) => ({ ...v, speed: 0 })),
        })),

    reset: () =>
        set((state) => ({
            playbackState: "stopped",
            currentPositionIndex: {},
            vehicles: state.vehicles.map((v) => {
                const original = state.originalVehicles.find((o) => o.id === v.id)
                return original ? { ...v, status: "Stopped" as const, speed: 0 } : v
            }),
        })),

    tickPosition: (vehicleId) =>
        set((state) => {
            const current = state.currentPositionIndex[vehicleId] ?? 0
            const vehicle = state.vehicles.find((v) => v.id === vehicleId)
            if (!vehicle) return state

            const next = Math.min(current + 1, vehicle.route.length - 1)
            const isFinished = next >= vehicle.route.length - 1

            const p1 = vehicle.route[current]
            const p2 = vehicle.route[next]

            // calculate distance using haversine
            const R = 6371
            const dLat = ((p2.lat - p1.lat) * Math.PI) / 180
            const dLng = ((p2.lng - p1.lng) * Math.PI) / 180
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos((p1.lat * Math.PI) / 180) *
                Math.cos((p2.lat * Math.PI) / 180) *
                Math.sin(dLng / 2) ** 2
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            const speed = isFinished ? 0 : Math.round(distance * 3600)

            const updatedVehicles = state.vehicles.map((v) =>
                v.id === vehicleId
                    ? {
                        ...v,
                        status: isFinished ? "Stopped" as const : "Moving" as const,
                        speed,
                        lastUpdate: new Date().toISOString(),
                    }
                    : v
            )

            return {
                currentPositionIndex: { ...state.currentPositionIndex, [vehicleId]: next },
                vehicles: updatedVehicles,
            }
        }),

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}))
