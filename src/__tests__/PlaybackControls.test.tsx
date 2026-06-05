import { render, screen, fireEvent } from "@testing-library/react";
import PlaybackControls from "@/components/controls/PlaybackControls";
import { useFleetStore } from "@/store/fleetStore";
import { Vehicle } from "@/types/vehicle";

const mockVehicle: Vehicle = {
    id: "V001",
    name: "Truck Alpha",
    speed: 72,
    status: "Moving",
    lastUpdate: "2024-06-04T10:45:00Z",
    route: [
        { lat: 31.9454, lng: 35.9284, timestamp: "2024-06-04T10:00:00Z" },
        { lat: 31.9470, lng: 35.9300, timestamp: "2024-06-04T10:05:00Z" },
    ],
};

beforeEach(() => {
    useFleetStore.setState({
        vehicles: [mockVehicle],
        playbackState: "stopped",
        currentPositionIndex: {},
    });
});

describe("PlaybackControls", () => {

    test("renders Play, Pause and Reset buttons", () => {
        render(<PlaybackControls />);
        expect(screen.getByText(/play/i)).toBeInTheDocument();
        expect(screen.getByText(/pause/i)).toBeInTheDocument();
        expect(screen.getByText(/reset/i)).toBeInTheDocument();
    });

    test("Play button is enabled when stopped", () => {
        render(<PlaybackControls />);
        const playBtn = screen.getByText(/play/i);
        expect(playBtn).not.toBeDisabled();
    });

    test("Pause button is disabled when stopped", () => {
        render(<PlaybackControls />);
        const pauseBtn = screen.getByText(/pause/i);
        expect(pauseBtn).toBeDisabled();
    });

    test("clicking Play changes state to playing", () => {
        render(<PlaybackControls />);
        fireEvent.click(screen.getByText(/play/i));
        expect(useFleetStore.getState().playbackState).toBe("playing");
    });

    test("clicking Pause changes state to paused", () => {
        useFleetStore.setState({ playbackState: "playing" });
        render(<PlaybackControls />);
        fireEvent.click(screen.getByText(/pause/i));
        expect(useFleetStore.getState().playbackState).toBe("paused");
    });

    test("clicking Reset clears position index", () => {
        useFleetStore.setState({
            playbackState: "playing",
            currentPositionIndex: { V001: 1 },
        });
        render(<PlaybackControls />);
        fireEvent.click(screen.getByText(/reset/i));
        expect(useFleetStore.getState().currentPositionIndex).toEqual({});
        expect(useFleetStore.getState().playbackState).toBe("stopped");
    });

    test("shows progress percentage", () => {
        render(<PlaybackControls />);
        expect(screen.getByText("0%")).toBeInTheDocument();
    });

});