"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useVehicles } from "@/hooks/useVehicles";
import { useFleetStore } from "@/store/fleetStore";
import VehicleList from "@/components/dashboard/VehicleList";
import PlaybackControls from "@/components/controls/PlaybackControls";

// تحميل الخريطة بدون SSR لأن Leaflet يحتاج window
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
});

const queryClient = new QueryClient();

function Dashboard() {
  const { data: vehicles, isLoading, isError } = useVehicles();
  const { setVehicles, isDarkMode, toggleDarkMode } = useFleetStore();

  // بعد جلب البيانات، أدخلها في Zustand
  useEffect(() => {
    if (vehicles) setVehicles(vehicles);
  }, [vehicles, setVehicles]);

  // تطبيق dark mode على الـ html
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      {/* الشريط الجانبي */}
      <aside className="w-72 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shrink-0 overflow-hidden">

        {/* رأس الشريط */}
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

          {/* زر Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* خطأ */}
        {isError && (
          <div className="m-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">⚠ Failed to load vehicles</p>
          </div>
        )}

        {/* تحميل */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs text-gray-500">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Loading vehicles...
          </div>
        )}

        {/* Search + Filter */}
        <div className="p-3 space-y-2 border-b border-gray-200 dark:border-gray-700">
          {/* البحث */}
          <input
            type="text"
            placeholder="Search vehicles..."
            onChange={(e) => useFleetStore.getState().setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* فلتر الحالة */}
          <div className="flex gap-1.5">
            {(["All", "Moving", "Stopped"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => useFleetStore.getState().setStatusFilter(filter)}
                className="flex-1 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <VehicleList />
      </aside>

      {/* منطقة الخريطة */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <PlaybackControls />
        <div className="flex-1 relative">
          <FleetMap />
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}