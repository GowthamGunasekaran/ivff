import { initFactories, initFactoryDetails } from "../utils/constants";

export const fetchFactoryInventory = async (payload = {}) => {
  try {
    const response = await fetch("/api/v1/factories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.warn("Error fetching factory inventory data, falling back to mock data:", error);
    const selectedPlants = payload["Source Plan"] || payload.sendingPlant || [];
    let factories = [...initFactories];

    if (selectedPlants.length > 0) {
      factories = factories.filter((f) =>
        selectedPlants.some((sp) => f.name.toLowerCase().includes(sp.toLowerCase()) || sp.toLowerCase().includes(f.name.toLowerCase()))
      );
    }
    console.log(factories)
    return factories;
  }
};
