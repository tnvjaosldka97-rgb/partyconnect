import { useState, useMemo } from "react";
import { Party, FilterOptions } from "@/types/party";

const defaultFilters: FilterOptions = {
  searchQuery: "",
  city: "all",
  priceRange: [0, 1000000], // 모든 가격대를 포함하는 큰 범위
  dateRange: "all",
  themes: [],
  ageRange: [18, 50],
  sortBy: "none", // 기본값: 정렬 없음 (원본 순서)
};

export function usePartyFilter(parties: Party[]) {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const filteredParties = useMemo(() => {
    let result = [...parties];

    // 검색어 필터
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (party) =>
          party.title.toLowerCase().includes(query) ||
          party.location.toLowerCase().includes(query) ||
          party.city.toLowerCase().includes(query) ||
          party.theme.toLowerCase().includes(query) ||
          party.type.toLowerCase().includes(query) ||
          party.hostName.toLowerCase().includes(query)
      );
    }

    // 도시 필터
    if (filters.city !== "all") {
      result = result.filter((party) => party.city === filters.city);
    }

    // 가격 필터
    result = result.filter(
      (party) =>
        party.price >= filters.priceRange[0] &&
        party.price <= filters.priceRange[1]
    );

    // 테마 필터
    if (filters.themes.length > 0) {
      result = result.filter((party) =>
        filters.themes.includes(party.theme)
      );
    }

    // 날짜 필터
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    const tomorrowTimestamp = todayTimestamp + 86400000;
    const weekendStart = new Date(today);
    weekendStart.setDate(today.getDate() + ((6 - today.getDay()) % 7));
    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 1);
    weekendEnd.setHours(23, 59, 59, 999);

    if (filters.dateRange === "today") {
      result = result.filter(
        (party) =>
          party.dateTimestamp >= todayTimestamp &&
          party.dateTimestamp < tomorrowTimestamp
      );
    } else if (filters.dateRange === "tomorrow") {
      result = result.filter(
        (party) =>
          party.dateTimestamp >= tomorrowTimestamp &&
          party.dateTimestamp < tomorrowTimestamp + 86400000
      );
    } else if (filters.dateRange === "weekend") {
      result = result.filter(
        (party) =>
          party.dateTimestamp >= weekendStart.getTime() &&
          party.dateTimestamp <= weekendEnd.getTime()
      );
    } else if (filters.dateRange === "week") {
      result = result.filter(
        (party) =>
          party.dateTimestamp >= todayTimestamp &&
          party.dateTimestamp < todayTimestamp + 7 * 86400000
      );
    }

    // 정렬
    switch (filters.sortBy) {
      case "none":
        // 정렬 없음: 원본 순서 유지
        break;
      case "date":
        result.sort((a, b) => a.dateTimestamp - b.dateTimestamp);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.attendees - a.attendees);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [parties, filters]);

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    filters,
    filteredParties,
    updateFilter,
    resetFilters,
    totalResults: filteredParties.length,
  };
}

