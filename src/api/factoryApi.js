/**
 * @file factoryApi.js
 * @description API functions for fetching factory inventory data.
 * Falls back to mock data from constants if the API is unavailable.
 */

import { initFactories } from "../utils/constants";

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
    const selectedDcs = payload["DC"] || payload.receivingPlant || [];
    let factories = [...initFactories];

    if (selectedPlants.length > 0) {
      factories = factories.filter(f =>
        selectedPlants.some(sp =>
          (f.name && f.name.toLowerCase().includes(sp.toLowerCase())) ||
          (sp && sp.toLowerCase().includes(f.name.toLowerCase())) ||
          (f.code && f.code.toLowerCase().includes(sp.toLowerCase())) ||
          (sp && sp.toLowerCase().includes(f.code.toLowerCase()))
        )
      );
    }
    if (selectedDcs.length > 0) {
      factories = factories.filter(f =>
        (f.children || []).some(c =>
          selectedDcs.some(sdc =>
            (c.dc && c.dc.toLowerCase().includes(sdc.toLowerCase())) ||
            (c.code && c.code.toLowerCase().includes(sdc.toLowerCase()))
          )
        )
      );
    }
    return factories;
  }
};
