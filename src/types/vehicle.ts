export interface GpsCoordinate {
    lat: number
    lng: number
    timestamp: string
}

export interface Vehicle {
    id: string
    name: string
    speed: number
    status: "Moving" | "Stopped"
    lastUpdate: string
    route: GpsCoordinate[]
}

export type PlaybackState = "playing" | "paused" | "stopped"
export type StatusFilter = "All" | "Moving" | "Stopped"
