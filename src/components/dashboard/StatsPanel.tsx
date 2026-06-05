"use client"

import { useMemo } from "react"
import { useFleetStore } from "@/store/fleetStore"

export default function StatsPanel() {
    const { vehicles, currentPositionIndex } = useFleetStore()

    const stats = useMemo(() => {
        const total = vehicles.length
        const moving = vehicles.filter((v) => v.status === "Moving").length
        const stopped = vehicles.filter((v) => v.status === "Stopped").length

        const movingVehicles = vehicles.filter((v) => v.status === "Moving")
        const avgSpeed =
            movingVehicles.length > 0
                ? Math.round(movingVehicles.reduce((sum, v) => sum + v.speed, 0) / movingVehicles.length)
                : 0

        const fastest = vehicles.reduce((max, v) => (v.speed > max.speed ? v : max), vehicles[0])

        const totalPoints = vehicles.reduce((sum, v) => sum + v.route.length, 0)
        const completedPoints = vehicles.reduce((sum, v) => sum + (currentPositionIndex[v.id] ?? 0), 0)
        const overallProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0

        return { total, moving, stopped, avgSpeed, fastest, overallProgress }
    }, [vehicles, currentPositionIndex])

    if (vehicles.length === 0) return null

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Live Statistics
            </p>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Total Vehicles</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.moving}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Moving</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-bold text-gray-500 dark:text-gray-400">{stats.stopped}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Stopped</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.avgSpeed}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Avg Speed (km/h)</div>
                </div>
            </div>

            {stats.fastest && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">Fastest Vehicle</div>
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">{stats.fastest.name}</div>
                    </div>
                    <div className="text-sm font-bold text-orange-500">{stats.fastest.speed} km/h</div>
                </div>
            )}

            <div className="mt-2">
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                    <span>Overall Progress</span>
                    <span>{stats.overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${stats.overallProgress}%`, background: "linear-gradient(90deg, #3B82F6, #10B981)" }}
                    />
                </div>
            </div>
        </div>
    )
}
