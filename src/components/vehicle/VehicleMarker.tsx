"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Vehicle, GpsCoordinate } from "@/types/vehicle";

interface Props {
    vehicle: Vehicle;
    position: GpsCoordinate;
    isSelected: boolean;
    onClick: () => void;
}

function createIcon(status: Vehicle["status"], isSelected: boolean) {
    const color = isSelected ? "#3B82F6" : status === "Moving" ? "#10B981" : "#6B7280";
    const size = isSelected ? 20 : 16;

    return L.divIcon({
        className: "",
        html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        ${status === "Moving" ? `
          <div style="position:absolute;width:${size + 12}px;height:${size + 12}px;
            border-radius:50%;background:${color}33;animation:pulse 2s infinite;"></div>
        ` : ""}
        <div style="width:${size}px;height:${size}px;border-radius:50%;
          background:${color};border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);position:relative;z-index:1;"></div>
      </div>
    `,
        iconSize: [size + 12, size + 12],
        iconAnchor: [(size + 12) / 2, (size + 12) / 2],
        popupAnchor: [0, -(size / 2) - 6],
    });
}

export default function VehicleMarker({ vehicle, position, isSelected, onClick }: Props) {
    return (
        <Marker
            position={[position.lat, position.lng]}
            icon={createIcon(vehicle.status, isSelected)}
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
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: vehicle.status === "Moving" ? "#10B981" : "#6B7280"
                        }} />
                        <strong>{vehicle.name}</strong>
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
                                        padding: "2px 8px",
                                        borderRadius: "9999px",
                                        fontSize: "11px",
                                        fontWeight: 700,
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