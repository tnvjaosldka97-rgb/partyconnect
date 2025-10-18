import PartyCard from "./PartyCard";
import { Button } from "./ui/button";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { FilterOptions } from "@/types/party";
import { mockParties } from "@/data/mockParties";
import { usePartyFilter } from "@/hooks/usePartyFilter";

interface FeaturedPartiesProps {
  searchQuery?: string;
  selectedCity?: string;
}

export default function FeaturedParties({
  searchQuery = "",
  selectedCity = "all",
}: FeaturedPartiesProps) {
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
    { label: "오늘 밤", value: "today", type: "dateRange" as const },
    { label: "이번 주말", value: "weekend", type: "dateRange" as const },
    { label: "₩30,000 이하", value: [0, 30000] as [number, number], type: "priceRange" as const },
    { label: "인기순", value: "popular" as const, type: "sortBy" as const },
    { label: "평점순", value: "rating" as const, type: "sortBy" as const },
  ];

  const handleQuickFilter = (
    type: keyof FilterOptions,
    value: FilterOptions[keyof FilterOptions]
  ) => {
    updateFilter(type, value);
  };

  return (
    <section className="py-20 relative">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="animate-fadeIn">
            당신을 위한 <span className="gradient-text">추천 파티</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {totalResults > 0
              ? `${totalResults}개의 파티를 찾았습니다`
              : "검증된 호스트가 준비한 특별한 파티에 참여하세요"}
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
            고급 필터
          </Button>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCity !== "all" || filters.dateRange !== "all") && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">활성 필터:</span>
            {searchQuery && (
              <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30">
                검색: "{searchQuery}"
              </div>
            )}
            {selectedCity !== "all" && (
              <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30">
                도시: {selectedCity}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredParties.slice(0, 6).map((party, index) => (
                <div
                  key={party.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PartyCard {...party} />
                </div>
              ))}
            </div>

            {/* See All Button */}
            {filteredParties.length > 6 && (
              <div className="text-center">
                <Link href="/all-parties">
                  <Button
                    size="lg"
                    variant="outline"
                    className="glass border-primary/30 hover:border-primary/50 hover:bg-primary/10 rounded-2xl px-8 h-12 group"
                  >
                    모든 파티 보기 ({filteredParties.length})
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-strong flex items-center justify-center">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">검색 결과가 없습니다</h3>
            <p className="text-muted-foreground mb-6">
              다른 검색어나 필터를 시도해보세요
            </p>
            <Button
              onClick={() => {
                updateFilter("searchQuery", "");
                updateFilter("city", "all");
                updateFilter("dateRange", "all");
              }}
              className="gradient-button rounded-xl px-6"
            >
              필터 초기화
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

