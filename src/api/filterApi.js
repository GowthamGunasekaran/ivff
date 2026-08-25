import { filterDefs, initFilters, minDate, maxDate, currentStartDate, currentEndDate } from "../utils/constants";

export const fetchFilters = async (payload = {}) => {
  try {
    const response = await fetch("/api/v1/filters", {
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
    console.warn('Error fetching filter data, falling back to mock data:', error);
    return { filterDefs, initFilters, minDate, maxDate, currentStartDate, currentEndDate };
  }
};
