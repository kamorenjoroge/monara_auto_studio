import { carsStore } from "@/lib/adminStore";
import { useLocalStore } from "./useLocalStore";

// The cars version of useLocalStore, with friendly names.
export function useAdminCars() {
  const { items, loading, add, update, remove, reset } = useLocalStore(carsStore);

  return {
    cars: items,
    loading,
    addCar: add,
    updateCar: update,
    deleteCar: remove,
    resetCars: reset,
  };
}