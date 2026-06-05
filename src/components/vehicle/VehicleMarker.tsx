"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { Vehicle, GpsCoordinate } from "@/types/vehicle";

interface Props {
    vehicle: Vehicle;
    position: GpsCoordinate;
    isSelected: boolean;
    onClick: () => void;
}

const VEHICLE_COLORS: Record<string, string> = {
    V001: "#EF4444",
    V002: "#10B981",
    V003: "#F59E0B",
    V004: "#8B5CF6",
    V005: "#3B82F6",
    V006: "#EC4899",
};

function createIcon(status: Vehicle["status"], isSelected: boolean, vehicleId: string) {
    const baseColor = VEHICLE_COLORS[vehicleId] || "#6B7280";
    const color = isSelected ? "#1D4ED8" : baseColor;
    const size = isSelected ? 44 : 38;

    const carSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  `;

    return L.divIcon({
        className: "",
        html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        ${status === "Moving" ? `
          <div style="
            position:absolute;
            width:${size + 14}px;height:${size + 14}px;
            border-radius:50%;
            background:${color}44;
            animation:pulse 2s infinite;
          "></div>
        ` : ""}
        <div style="
          width:${size}px;height:${size}px;
          border-radius:50%;
          background:${color};
          border:${isSelected ? "4px solid #1D4ED8" : status === "Stopped" ? "3px dashed white" : "3px solid white"};
          box-shadow:0 4px 12px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
          position:relative;z-index:1;
        ">
          ${carSvg}
        </div>
        <div style="
          position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);
          width:0;height:0;
          border-left:7px solid transparent;border-right:7px solid transparent;
          border-top:10px solid ${color};z-index:1;
        "></div>
      </div>
    `,
        iconSize: [size + 14, size + 24],
        iconAnchor: [(size + 14) / 2, size + 24],
        popupAnchor: [0, -(size + 24)],
    });
}

export default function VehicleMarker({ vehicle, position, isSelected, onClick }: Props) {
    const markerRef = useRef<L.Marker | null>(null);

    // تحديث الأيقونة يدوياً بدون إعادة إنشاء الماركر
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setIcon(createIcon(vehicle.status, isSelected, vehicle.id));
        }
    }, [vehicle.status, vehicle.id, isSelected]);

    // تحديث الموقع يدوياً بدون إعادة إنشاء الماركر
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setLatLng([position.lat, position.lng]);
        }
    }, [position.lat, position.lng]);

    return (
        <Marker
            ref={markerRef}
            position={[position.lat, position.lng]}
            icon={createIcon(vehicle.status, isSelected, vehicle.id)}
            eventHandlers={{ click: onClick }}
        >
            <Popup minWidth={200}>
                <div style={{ fontFamily: "system-ui", padding: "4px" }}>
                    <div style={{
                        borderBottom: "1px solid #e5e7eb",
                        marginBottom: "8px",
                        paddingBottom: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <div style={{
                            width: "12px", height: "12px", borderRadius: "50%",
                            background: VEHICLE_COLORS[vehicle.id] || "#6B7280",
                            border: "2px solid white",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                        }} />
                        <strong style={{ fontSize: "14px" }}>{vehicle.name}</strong>
                    </div>
                    <table style={{ fontSize: "13px", width: "100%" }}>
                        <tbody>
                            <tr>
                                <td style={{ color: "#6B7280", paddingRight: "10px", paddingBottom: "4px" }}>ID</td>
                                <td><strong>{vehicle.id}</strong></td>
                            </tr>
                            <tr>
                                <td style={{ color: "#6B7280", paddingRight: "10px", paddingBottom: "4px" }}>Speed</td>
                                <td><strong>{vehicle.speed} km/h</strong></td>
                            </tr>
                            <tr>
                                <td style={{ color: "#6B7280", paddingRight: "10px", paddingBottom: "4px" }}>Status</td>
                                <td>
                                    <span style={{
                                        padding: "2px 8px", borderRadius: "9999px",
                                        fontSize: "11px", fontWeight: 700,
                                        background: vehicle.status === "Moving" ? "#D1FAE5" : "#F3F4F6",
                                        color: vehicle.status === "Moving" ? "#065F46" : "#374151",
                                    }}>
                                        {vehicle.status}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ color: "#6B7280", paddingRight: "10px" }}>Updated</td>
                                <td><strong>{new Date(vehicle.lastUpdate).toLocaleString()}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Popup>
        </Marker>
    );
}