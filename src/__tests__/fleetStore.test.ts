import { useFleetStore } from "@/store/fleetStore"
import { Vehicle } from "@/types/vehicle"

const mockVehicle: Vehicle = {
    id: "V001",
    name: "AHMAD",
    speed: 72,
    status: "Moving",
    lastUpdate: "2024-06-04T10:45:00Z",
    route: [
        { lat: 31.9454, lng: 35.9284, timestamp: "2024-06-04T10:00:00Z" },
        { lat: 31.9470, lng: 35.9300, timestamp: "2024-06-04T10:05:00Z" },
        { lat: 31.9490, lng: 35.9325, timestamp: "2024-06-04T10:10:00Z" },
    ],
}

beforeEach(() => {
    useFleetStore.setState({
        vehicles: [],
        selectedVehicle: null,
        playbackState: "stopped",
        currentPositionIndex: {},
        searchQuery: "",
        statusFilter: "All",
        isDarkMode: false,
    })
})

describe("fleetStore", () => {
    test("setVehicles stores vehicles correctly", () => {
        useFleetStore.getState().setVehicles([mockVehicle])
        expect(useFleetStore.getState().vehicles).toHaveLength(1)
        expect(useFleetStore.getState().vehicles[0].name).toBe("AHMAD")
    })

    test("selectVehicle sets selected vehicle", () => {
        useFleetStore.getState().selectVehicle(mockVehicle)
        expect(useFleetStore.getState().selectedVehicle?.id).toBe("V001")
    })

    test("selectVehicle can deselect by passing null", () => {
        useFleetStore.getState().selectVehicle(mockVehicle)
        useFleetStore.getState().selectVehicle(null)
        expect(useFleetStore.getState().selectedVehicle).toBeNull()
    })

    test("play sets playbackState to playing", () => {
        useFleetStore.getState().play()
        expect(useFleetStore.getState().playbackState).toBe("playing")
    })

    test("pause sets playbackState to paused", () => {
        useFleetStore.getState().play()
        useFleetStore.getState().pause()
        expect(useFleetStore.getState().playbackState).toBe("paused")
    })

    test("reset sets playbackState to stopped and clears positions", () => {
        useFleetStore.getState().setVehicles([mockVehicle])
        useFleetStore.getState().play()
        useFleetStore.getState().tickPosition("V001")
        useFleetStore.getState().reset()
        expect(useFleetStore.getState().playbackState).toBe("stopped")
        expect(useFleetStore.getState().currentPositionIndex).toEqual({})
    })

    test("tickPosition advances vehicle position by 1", () => {
        useFleetStore.getState().setVehicles([mockVehicle])
        useFleetStore.getState().tickPosition("V001")
        expect(useFleetStore.getState().currentPositionIndex["V001"]).toBe(1)
    })

    test("tickPosition does not exceed last route point", () => {
        useFleetStore.getState().setVehicles([mockVehicle])
        useFleetStore.getState().tickPosition("V001")
        useFleetStore.getState().tickPosition("V001")
        useFleetStore.getState().tickPosition("V001")
        useFleetStore.getState().tickPosition("V001")
        expect(useFleetStore.getState().currentPositionIndex["V001"]).toBe(2)
    })

    test("setSearchQuery updates search query", () => {
        useFleetStore.getState().setSearchQuery("AHMAD")
        expect(useFleetStore.getState().searchQuery).toBe("AHMAD")
    })

    test("setStatusFilter updates status filter", () => {
        useFleetStore.getState().setStatusFilter("Moving")
        expect(useFleetStore.getState().statusFilter).toBe("Moving")
    })

    test("toggleDarkMode switches dark mode", () => {
        expect(useFleetStore.getState().isDarkMode).toBe(false)
        useFleetStore.getState().toggleDarkMode()
        expect(useFleetStore.getState().isDarkMode).toBe(true)
        useFleetStore.getState().toggleDarkMode()
        expect(useFleetStore.getState().isDarkMode).toBe(false)
    })
})
