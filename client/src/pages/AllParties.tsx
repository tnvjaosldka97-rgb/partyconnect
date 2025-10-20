import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartyCard from "@/components/PartyCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { mockParties } from "@/data/mockParties";
import { usePartyFilter } from "@/hooks/usePartyFilter";

export default function AllParties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  
  const { filters, filteredParties, updateFilter, totalResults } =
    usePartyFilter(mockParties);

  // 외부에서 전달된 검색어와 도시 필터 적용
  if (filters.searchQuery !== searchQuery) {
    updateFilter("searchQuery", searchQuery);
  }
  if (filters.city !== selectedCity) {
    updateFilter("city", selectedCity);
  }

  const quickFilters = [
    { label: "Tonight", value: "today", type: "dateRange" as const },
    { label: "This Weekend", value: "weekend", type: "dateRange" as const },
    { label: "$40 or less", value: [0, 30000] as [number, number], type: "priceRange" as const },
    { label: "Popular", value: "popular" as const, type: "sortBy" as const },
    { label: "Top Rated", value: "rating" as const, type: "sortBy" as const },
  ];

  const handleQuickFilter = (
    type: keyof typeof filters,
    value: any
  ) => {
    // 현재 필터가 활성화되어 있으면 해제, 아니면 활성화
    const currentValue = filters[type];
    if (JSON.stringify(currentValue) === JSON.stringify(value)) {
      // 필터 해제: 기본값으로 되돌리기
      if (type === "dateRange") {
        updateFilter(type, "all" as any);
      } else if (type === "priceRange") {
        updateFilter(type, [0, 1000000]); // All 가격대를 포함하는 큰 범위로 설정
      } else if (type === "sortBy") {
        updateFilter(type, "none");
      }
    } else {
      // 필터 활성화
      updateFilter(type, value);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
      />
      
      <main className="py-20">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold animate-fadeIn">
              All <span className="gradient-text">파티</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {totalResults > 0
                ? `${totalResults}parties found`
                : "Join special parties prepared by verified hosts"}
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {quickFilters.map((filter) => {
              const isActive =
                filter.type === "dateRange"
                  ? filters.dateRange === filter.value
                  : filter.type === "sortBy"
                  ? filters.sortBy === filter.value
                  : filter.type === "priceRange"
                  ? filters.priceRange[1] === (filter.value as [number, number])[1]
                  : false;

              return (
                <Button
                  key={filter.label}
                  variant="outline"
                  onClick={() => handleQuickFilter(filter.type, filter.value)}
                  className={`glass border-white/20 hover:border-primary/50 hover:bg-primary/10 rounded-full px-6 transition-all ${
                    isActive ? "border-primary/50 bg-primary/10 text-primary" : ""
                  }`}
                >
                  {filter.label}
                </Button>
              );
            })}
            <Button
              variant="outline"
              className="glass border-primary/30 hover:border-primary/50 hover:bg-primary/10 rounded-full px-6 text-primary"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCity !== "all" || filters.dateRange !== "all") && (
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">Active Filters:</span>
              {searchQuery && (
                <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30">
                  Search: "{searchQuery}"
                </div>
              )}
              {selectedCity !== "all" && (
                <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30">
                  City: {selectedCity}
                </div>
              )}
              {filters.dateRange !== "all" && (
                <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30">
                  날짜: {quickFilters.find((f) => f.value === filters.dateRange)?.label}
                </div>
              )}
            </div>
          )}

          {/* Party Grid */}
          {filteredParties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredParties.map((party, index) => (
                <div
                  key={party.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <PartyCard {...party} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-strong flex items-center justify-center">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">No Results Found</h3>
              <p className="text-muted-foreground mb-6">
                Try different keywords or filters
              </p>
              <Button
                onClick={() => {
                  updateFilter("searchQuery", "");
                  updateFilter("city", "all");
                  updateFilter("dateRange", "all");
                }}
                className="gradient-button rounded-xl px-6"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

