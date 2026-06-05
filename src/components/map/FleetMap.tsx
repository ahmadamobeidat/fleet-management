"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useFleetStore } from "@/store/fleetStore";
import { Vehicle } from "@/types/vehicle";
import VehicleMarker from "@/components/vehicle/VehicleMarker";

// ---- مكون مساعد: يضبط الخريطة على مسار المركبة المختارة ----
function MapFitter({ selectedVehicle }: { selectedVehicle: Vehicle | null }) {
    const map = useMap();
    useEffect(() => {
        if (!selectedVehicle) return;
        const bounds = selectedVehicle.route.map((p) => [p.lat, p.lng] as [number, number]);
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [selectedVehicle, map]);
    return null;
}

export default function FleetMap() {
    const {
        vehicles,
        selectedVehicle,
        selectVehicle,
        playbackState,
        currentPositionIndex,
        tickPosition,
        isDarkMode,
    } = useFleetStore();

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ---- محرك التشغيل: كل ثانية قدّم جميع المركبات خطوة ----
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (playbackState !== "playing") return;

        intervalRef.current = setInterval(() => {
            vehicles.forEach((vehicle) => {
                const idx = currentPositionIndex[vehicle.id] ?? 0;
                if (idx < vehicle.route.length - 1) {
                    tickPosition(vehicle.id);
                }
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [playbackState, vehicles, currentPositionIndex, tickPosition]);

    const lightTile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const darkTile = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

    return (
        <MapContainer
            center={[31.9454, 35.9284]} // عمّان، الأردن
            zoom={13}
            style={{ width: "100%", height: "100%" }}
        >
            <TileLayer url={isDarkMode ? darkTile : lightTile} />
            <MapFitter selectedVehicle={selectedVehicle} />

            {vehicles.map((vehicle) => {
                const idx = currentPositionIndex[vehicle.id] ?? 0;
                const position = vehicle.route[idx];
                const isSelected = selectedVehicle?.id === vehicle.id;

                // خط المسار الكامل
                const fullRoute = vehicle.route.map((p) => [p.lat, p.lng] as [number, number]);
                // الجزء المقطوع
                const traveled = fullRoute.slice(0, idx + 1);

                return (
                    <div key={vehicle.id}>
                        {/* خط المسار الكامل شفاف */}
                        <Polyline
                            positions={fullRoute}
                            pathOptions={{ color: isSelected ? "#3B82F6" : "#9CA3AF", weight: 2, opacity: 0.3, dashArray: "6 4" }}
                        />
                        {/* الجزء المقطوع واضح */}
                        {traveled.length > 1 && (
                            <Polyline
                                positions={traveled}
                                pathOptions={{ color: isSelected ? "#3B82F6" : "#10B981", weight: 3, opacity: 0.8 }}
                            />
                        )}
                        {/* ماركر المركبة */}
                        <VehicleMarker
                            vehicle={vehicle}
                            position={position}
                            isSelected={isSelected}
                            onClick={() => selectVehicle(isSelected ? null : vehicle)}
                        />
                    </div>
                );
            })}
        </MapContainer>
    );
}