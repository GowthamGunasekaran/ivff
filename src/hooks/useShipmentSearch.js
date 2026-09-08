/**
 * @file useShipmentSearch.js
 * @description Custom hook to manage shipment search state, debouncing,
 * remote search querying, and automated accordion hierarchy expansion.
 */

import { useState, useEffect, useCallback } from "react";
import { searchShipmentsApi } from "../api/shipmentApi";
import { computeSearchExpandState } from "../utils/appContextHelpers";
import { MATERIAL_CODE_DESC_MAP } from "../utils/constants";

export function useShipmentSearch({ plantsData, dcShipmentsCache, filters, setOpenPlants, setOpenDcs, setOpenInds }) {
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResultsData, setSearchResultsData] = useState(null);

  const triggerCbuSearch = useCallback(cbuCode => {
    const term = (cbuCode || "").trim();
    setShipmentSearch(term);
    setDebouncedSearchTerm(term);
  }, []);

  // Debounce search input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(shipmentSearch);
    }, 250);
    return () => clearTimeout(handler);
  }, [shipmentSearch]);

  // Execute remote search API when query is >= 2 characters,
  // EXCEPT when selecting/filtering by a material in UI (pure client-side filtering per user requirement)
  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.trim().length < 2) {
      return undefined;
    }

    const trimmed = debouncedSearchTerm.trim();
    const isMaterialSearch =
      trimmed.includes(" / ") ||
      Boolean(MATERIAL_CODE_DESC_MAP[trimmed.toUpperCase()]);

    if (isMaterialSearch) {
      setIsSearchLoading(false);
      setSearchResultsData(null);
      return undefined;
    }

    let isMounted = true;
    const performSearch = async () => {
      setIsSearchLoading(true);
      try {
        const results = await searchShipmentsApi(debouncedSearchTerm, {
          sendingPlant: filters?.["Source Plan"] || [],
          receivingPlant: filters?.["DC"] || [],
          CBU: filters?.["CBU"] || [],
        });
        if (isMounted) setSearchResultsData(results);
      } catch (err) {
        console.error("Search API failed, will fallback to local traversal:", err);
        if (isMounted) setSearchResultsData(null);
      } finally {
        if (isMounted) setIsSearchLoading(false);
      }
    };

    performSearch();
    return () => { isMounted = false; };
  }, [debouncedSearchTerm, filters]);

  // Automatically expand matching plants, DCs, and shipments
  useEffect(() => {
    if (!debouncedSearchTerm || plantsData.length === 0) return;
    const { newPlants, newDcs, newInds } = computeSearchExpandState(plantsData, dcShipmentsCache, debouncedSearchTerm);
    setOpenPlants(p => ({ ...p, ...newPlants }));
    setOpenDcs(p => ({ ...p, ...newDcs }));
    setOpenInds(p => ({ ...p, ...newInds }));
  }, [debouncedSearchTerm, plantsData, dcShipmentsCache, setOpenPlants, setOpenDcs, setOpenInds]);

  const hasValidQuery = Boolean(debouncedSearchTerm && debouncedSearchTerm.trim().length >= 2);

  return {
    shipmentSearch,
    setShipmentSearch,
    debouncedSearchTerm,
    isSearchLoading: hasValidQuery ? isSearchLoading : false,
    searchResultsData: hasValidQuery ? searchResultsData : null,
    triggerCbuSearch,
  };
}
