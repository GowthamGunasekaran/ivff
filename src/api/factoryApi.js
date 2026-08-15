import { initFactories, initFactoryDetails } from "../utils/constants";

export const fetchFactoryInventory = async (payload = {}) => {
  try {
    const response = await fetch("/api/v1/factories", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Error fetching factory inventory data, falling back to mock data:', error);
    return { initFactories, initFactoryDetails };
  }
};
