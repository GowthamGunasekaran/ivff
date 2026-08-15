import { initShipments } from "../utils/constants";

export const fetchShipments = async (payload = {}) => {
  try {
    const response = await fetch("/api/v1/shipments", {
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
    console.warn('Error fetching shipments data, falling back to mock data:', error);
    return initShipments;
  }
};
