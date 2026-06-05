// Zustand store - إدارة حالة التطبيق بالكامل
import { create } from "zustand";
import { Vehicle, PlaybackState, StatusFilter } from "@/types/vehicle";

interface FleetStore {
    // البيانات
    vehicles: Vehicle[];
    selectedVehicle: Vehicle | null;

    // حالة التشغيل
    playbackState: PlaybackState;
    currentPositionIndex: Record<string, number>; // { "V001": 3, "V002": 5 }

    // الفلاتر
    searchQuery: string;
    statusFilter: StatusFilter;
    isDarkMode: boolean;

    // Actions
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
    // القيم الابتدائية
    vehicles: [],
    selectedVehicle: null,
    playbackState: "stopped",
    currentPositionIndex: {},
    searchQuery: "",
    statusFilter: "All",
    isDarkMode: false,

    // حفظ المركبات في الـ store بعد جلبها من API
    setVehicles: (vehicles) => set({ vehicles }),

    // اختيار مركبة لعرض تفاصيلها
    selectVehicle: (selectedVehicle) => set({ selectedVehicle }),

    // بدء التشغيل
    play: () => set({ playbackState: "playing" }),

    // إيقاف مؤقت
    pause: () => set({ playbackState: "paused" }),

    // إعادة للبداية - نمسح كل مؤشرات المواقع
    reset: () => set({ playbackState: "stopped", currentPositionIndex: {} }),

    // تقديم مركبة واحدة خطوة للأمام
    tickPosition: (vehicleId) =>
        set((state) => {
            const current = state.currentPositionIndex[vehicleId] ?? 0;
            const vehicle = state.vehicles.find((v) => v.id === vehicleId);
            if (!vehicle) return state;
            const next = Math.min(current + 1, vehicle.route.length - 1);
            return {
                currentPositionIndex: {
                    ...state.currentPositionIndex,
                    [vehicleId]: next,
                },
            };
        }),

    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setStatusFilter: (statusFilter) => set({ statusFilter }),
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));