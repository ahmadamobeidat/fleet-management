import { useFleetStore } from "@/store/fleetStore";
import { Vehicle } from "@/types/vehicle";

// بيانات مركبة وهمية للاختبار
const mockVehicle: Vehicle = {
  id: "V001",
  name: "Truck Alpha",
  speed: 72,
  status: "Moving",
  lastUpdate: "2024-06-04T10:45:00Z",
  route: [
    { lat: 31.9454, lng: 35.9284, timestamp: "2024-06-04T10:00:00Z" },
    { lat: 31.9470, lng: 35.9300, timestamp: "2024-06-04T10:05:00Z" },
    { lat: 31.9490, lng: 35.9325, timestamp: "2024-06-04T10:10:00Z" },
  ],
};

// إعادة تعيين الـ store قبل كل اختبار
beforeEach(() => {
  useFleetStore.setState({
    vehicles: [],
    selectedVehicle: null,
    playbackState: "stopped",
    currentPositionIndex: {},
    searchQuery: "",
    statusFilter: "All",
    isDarkMode: false,
  });
});

describe("fleetStore", () => {

  // اختبار تعيين المركبات
  test("setVehicles stores vehicles correctly", () => {
    useFleetStore.getState().setVehicles([mockVehicle]);
    expect(useFleetStore.getState().vehicles).toHaveLength(1);
    expect(useFleetStore.getState().vehicles[0].name).toBe("Truck Alpha");
  });

  // اختبار اختيار مركبة
  test("selectVehicle sets selected vehicle", () => {
    useFleetStore.getState().selectVehicle(mockVehicle);
    expect(useFleetStore.getState().selectedVehicle?.id).toBe("V001");
  });

  // اختبار إلغاء اختيار مركبة
  test("selectVehicle can deselect by passing null", () => {
    useFleetStore.getState().selectVehicle(mockVehicle);
    useFleetStore.getState().selectVehicle(null);
    expect(useFleetStore.getState().selectedVehicle).toBeNull();
  });

  // اختبار التشغيل
  test("play sets playbackState to playing", () => {
    useFleetStore.getState().play();
    expect(useFleetStore.getState().playbackState).toBe("playing");
  });

  // اختبار الإيقاف المؤقت
  test("pause sets playbackState to paused", () => {
    useFleetStore.getState().play();
    useFleetStore.getState().pause();
    expect(useFleetStore.getState().playbackState).toBe("paused");
  });

  // اختبار إعادة التعيين
  test("reset sets playbackState to stopped and clears positions", () => {
    useFleetStore.getState().setVehicles([mockVehicle]);
    useFleetStore.getState().play();
    useFleetStore.getState().tickPosition("V001");
    useFleetStore.getState().reset();
    expect(useFleetStore.getState().playbackState).toBe("stopped");
    expect(useFleetStore.getState().currentPositionIndex).toEqual({});
  });

  // اختبار تقديم موقع المركبة
  test("tickPosition advances vehicle position by 1", () => {
    useFleetStore.getState().setVehicles([mockVehicle]);
    useFleetStore.getState().tickPosition("V001");
    expect(useFleetStore.getState().currentPositionIndex["V001"]).toBe(1);
  });

  // اختبار عدم تجاوز آخر نقطة
  test("tickPosition does not exceed last route point", () => {
    useFleetStore.getState().setVehicles([mockVehicle]);
    // تقديم أكثر من عدد النقاط
    useFleetStore.getState().tickPosition("V001");
    useFleetStore.getState().tickPosition("V001");
    useFleetStore.getState().tickPosition("V001");
    useFleetStore.getState().tickPosition("V001");
    // يجب أن يتوقف عند آخر نقطة (index 2)
    expect(useFleetStore.getState().currentPositionIndex["V001"]).toBe(2);
  });

  // اختبار البحث
  test("setSearchQuery updates search query", () => {
    useFleetStore.getState().setSearchQuery("Truck");
    expect(useFleetStore.getState().searchQuery).toBe("Truck");
  });

  // اختبار فلتر الحالة
  test("setStatusFilter updates status filter", () => {
    useFleetStore.getState().setStatusFilter("Moving");
    expect(useFleetStore.getState().statusFilter).toBe("Moving");
  });

  // اختبار Dark Mode
  test("toggleDarkMode switches dark mode", () => {
    expect(useFleetStore.getState().isDarkMode).toBe(false);
    useFleetStore.getState().toggleDarkMode();
    expect(useFleetStore.getState().isDarkMode).toBe(true);
    useFleetStore.getState().toggleDarkMode();
    expect(useFleetStore.getState().isDarkMode).toBe(false);
  });

});