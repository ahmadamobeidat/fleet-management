"use client";

import { useFleetStore } from "@/store/fleetStore";

export default function PlaybackControls() {
    const { playbackState, play, pause, reset, vehicles, currentPositionIndex } = useFleetStore();

    // حساب نسبة التقدم الكلية
    const progress = (() => {
        if (vehicles.length === 0) return 0;
        const total = vehicles.reduce((sum, v) => sum + v.route.length - 1, 0);
        const done = vehicles.reduce((sum, v) => sum + (currentPositionIndex[v.id] ?? 0), 0);
        return total > 0 ? Math.round((done / total) * 100) : 0;
    })();

    const allFinished = vehicles.every(
        (v) => (currentPositionIndex[v.id] ?? 0) >= v.route.length - 1
    );

    return (
        <div className="flex flex-col gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* شريط التقدم */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-24">Route Progress</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3B82F6, #10B981)" }}
                    />
                </div>
                <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-300 w-8">{progress}%</span>
            </div>

            {/* الأزرار */}
            <div className="flex items-center gap-2">
                <button
                    onClick={play}
                    disabled={playbackState === "playing" || allFinished}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    ▶ Play
                </button>

                <button
                    onClick={pause}
                    disabled={playbackState !== "playing"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    ⏸ Pause
                </button>

                <button
                    onClick={reset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                    ↺ Reset
                </button>

                {/* مؤشر الحالة */}
                <div className="ml-auto flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${playbackState === "playing" ? "bg-green-500 animate-pulse" : playbackState === "paused" ? "bg-yellow-500" : "bg-gray-400"}`} />
                    <span className="text-xs text-gray-500 capitalize">{playbackState}</span>
                </div>
            </div>
        </div>
    );
}