import { create } from "zustand";
import { Vehicle, PlaybackState, StatusFilter } from "@/types/vehicle";

interface FleetStore {
    vehicles: Vehicle[];
    originalVehicles: Vehicle[]; // ← نسخة أصلية من البيانات
    selectedVehicle: Vehicle | null;
    playbackState: PlaybackState;
    currentPositionIndex: Record<string, number>;
    searchQuery: string;
    statusFilter: StatusFilter;
    isDarkMode: boolean;

    setVehicles: (vehicles: Vehicle[]) => void;
    selectVehicle: (vehicle: Vehicle | null) => void;
    play: () => void;
    pause: () => void;
    reset: () => void;
    tickPosition: (vehicleId: string) => void;
    setSearchQuery: (query: string) => void;
    setStatusFilter: (filter: StatusFilter) => void;
    toggleDarkMode: () => void;
}

export const useFleetStore = create<FleetStore>((set) => ({
    vehicles: [],
    originalVehicles: [], // ← القيمة الابتدائية
    selectedVehicle: null,
    playbackState: "stopped",
    currentPositionIndex: {},
    searchQuery: "",
    statusFilter: "All",
    isDarkMode: false,

    // نحفظ نسخة أصلية من البيانات عند أول جلب
    setVehicles: (vehicles) => set({
        vehicles,
        originalVehicles: JSON.parse(JSON.stringify(vehicles)), // deep copy
    }),

    selectVehicle: (selectedVehicle) => set({ selectedVehicle }),

    play: () => set({ playbackState: "playing" }),

    pause: () => set({ playbackState: "paused" }),

    // عند Reset نرجع للبيانات الأصلية
    reset: () =>
        set((state) => ({
            playbackState: "stopped",
            currentPositionIndex: {},
            // نرجع الـ status الأصلي لكل مركبة
            vehicles: state.vehicles.map((v) => {
                const original = state.originalVehicles.find((o) => o.id === v.id);
                return original ? { ...v, status: original.status } : v;
            }),
        })),

    tickPosition: (vehicleId) =>
        set((state) => {
            const current = state.currentPositionIndex[vehicleId] ?? 0;
            const vehicle = state.vehicles.find((v) => v.id === vehicleId);
            if (!vehicle) return state;
            const next = Math.min(current + 1, vehicle.route.length - 1);
            const isFinished = next >= vehicle.route.length - 1;

            // حساب السرعة من المسافة بين النقطة الحالية والتالية
            const currentPoint = vehicle.route[current];
            const nextPoint = vehicle.route[next];

            // حساب المسافة بالكيلومتر (Haversine formula)
            const R = 6371;
            const dLat = ((nextPoint.lat - currentPoint.lat) * Math.PI) / 180;
            const dLng = ((nextPoint.lng - currentPoint.lng) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos((currentPoint.lat * Math.PI) / 180) *
                Math.cos((nextPoint.lat * Math.PI) / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            // السرعة = المسافة / الوقت (ثانية واحدة = 1/3600 ساعة)
            const calculatedSpeed = isFinished ? 0 : Math.round(distance * 3600);

            const updatedVehicles = state.vehicles.map((v) =>
                v.id === vehicleId
                    ? {
                        ...v,
                        status: isFinished ? "Stopped" as const : "Moving" as const,
                        speed: calculatedSpeed,
                        lastUpdate: new Date().toISOString(),
                    }
                    : v
            );

            return {
                currentPositionIndex: {
                    ...state.currentPositionIndex,
                    [vehicleId]: next,
                },
                vehicles: updatedVehicles,
            };
        }),

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));