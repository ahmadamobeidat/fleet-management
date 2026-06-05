"use client";

import { useMemo } from "react";
import { useFleetStore } from "@/store/fleetStore";
import { Vehicle } from "@/types/vehicle";
import StatsPanel from "@/components/dashboard/StatsPanel";

// بطاقة مركبة واحدة
function VehicleCard({
    vehicle, isSelected, currentIndex, onClick,
}: {
    vehicle: Vehicle; isSelected: boolean; currentIndex: number; onClick: () => void;
}) {
    const progress = Math.round((currentIndex / (vehicle.route.length - 1)) * 100);
    const pos = vehicle.route[currentIndex];

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3 rounded-xl border transition-all ${isSelected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300"
                }`}
        >
            {/* الاسم والحالة */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${vehicle.status === "Moving" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{vehicle.name}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vehicle.status === "Moving"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                    {vehicle.status.toUpperCase()}
                </span>
            </div>

            {/* ID والسرعة */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{vehicle.id}</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{vehicle.speed} km/h</span>
            </div>

            {/* الإحداثيات */}
            <div className="mt-1 text-[10px] text-gray-400 font-mono">
                {pos.lat.toFixed(4)}°N, {pos.lng.toFixed(4)}°E
            </div>

            {/* شريط التقدم */}
            <div className="mt-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>Route</span><span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                    <div
                        className={`h-1 rounded-full transition-all ${isSelected ? "bg-blue-500" : "bg-green-500"}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </button>
    );
}

// القائمة الكاملة مع الفلترة
export default function VehicleList() {
    const { vehicles, selectedVehicle, selectVehicle, searchQuery, statusFilter, currentPositionIndex } = useFleetStore();

    // تطبيق فلتر البحث والحالة
    const filtered = useMemo(() => {
        return vehicles.filter((v: Vehicle) => {
            if (statusFilter !== "All" && v.status !== statusFilter) return false;
            if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
    }, [vehicles, statusFilter, searchQuery]);

    // إحصائيات
    const moving = vehicles.filter((v) => v.status === "Moving").length;
    const stopped = vehicles.filter((v) => v.status === "Stopped").length;

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-3 gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{vehicles.length}</div>
                    <div className="text-[10px] text-gray-500">Total</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{moving}</div>
                    <div className="text-[10px] text-gray-500">Moving</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-500">{stopped}</div>
                    <div className="text-[10px] text-gray-500">Stopped</div>
                </div>
            </div>

            {/* القائمة قابلة للتمرير */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filtered.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 mt-8">No vehicles found</div>
                ) : (
                    filtered.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            isSelected={selectedVehicle?.id === vehicle.id}
                            currentIndex={currentPositionIndex[vehicle.id] ?? 0}
                            onClick={() => selectVehicle(selectedVehicle?.id === vehicle.id ? null : vehicle)}
                        />
                    ))
                )}
            </div>

            {/* لوحة الإحصائيات الحية في أسفل الشريط الجانبي */}
            <StatsPanel />

        </div>
    );
}