"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useVehicles } from "@/hooks/useVehicles"
import { useFleetStore } from "@/store/fleetStore"
import VehicleList from "@/components/dashboard/VehicleList"
import PlaybackControls from "@/components/controls/PlaybackControls"

const FleetMap = dynamic(() => import("@/components/map/FleetMap"), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading map...</p>
            </div>
        </div>
    ),
})

const queryClient = new QueryClient()

function Dashboard() {
    const { data: vehicles, isLoading, isError } = useVehicles()
    const { setVehicles, isDarkMode, toggleDarkMode } = useFleetStore()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (vehicles) setVehicles(vehicles)
    }, [vehicles, setVehicles])

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [isDarkMode])

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 md:flex-row">

            {/* mobile header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 md:hidden shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">🚛</span>
                    </div>
                    <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">Fleet Tracker</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleDarkMode}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-lg"
                    >
                        {sidebarOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* mobile drawer */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-[9999] top-[53px]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-xl">
                        {isError && (
                            <div className="m-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs text-red-600">⚠ Failed to load vehicles</p>
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex items-center gap-2 p-3 text-xs text-gray-500">
                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                Loading vehicles...
                            </div>
                        )}
                        <div className="p-3 space-y-2 border-b border-gray-200 dark:border-gray-700">
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                onChange={(e) => useFleetStore.getState().setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-1.5">
                                {(["All", "Moving", "Stopped"] as const).map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => useFleetStore.getState().setStatusFilter(f)}
                                        className="flex-1 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <VehicleList />
                    </div>
                </div>
            )}

            {/* desktop sidebar */}
            <aside className="hidden md:flex md:w-72 flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shrink-0 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">🚛</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">Fleet Tracker</h1>
                            <p className="text-[10px] text-gray-400">Live Vehicle Monitoring</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {isDarkMode ? "☀️" : "🌙"}
                    </button>
                </div>

                {isError && (
                    <div className="m-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600">⚠ Failed to load vehicles</p>
                    </div>
                )}
                {isLoading && (
                    <div className="flex items-center gap-2 p-3 text-xs text-gray-500">
                        <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Loading vehicles...
                    </div>
                )}

                <div className="p-3 space-y-2 border-b border-gray-200 dark:border-gray-700">
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        onChange={(e) => useFleetStore.getState().setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-1.5">
                        {(["All", "Moving", "Stopped"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => useFleetStore.getState().setStatusFilter(f)}
                                className="flex-1 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <VehicleList />
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <PlaybackControls />
                <div className="flex-1 relative">
                    <FleetMap key="fleet-map" />
                </div>
            </main>
        </div>
    )
}

export default function Page() {
    return (
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>
    )
}
