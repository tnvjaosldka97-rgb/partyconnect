import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartyCard from "@/components/PartyCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { mockParties } from "@/data/mockParties";
import { usePartyFilter } from "@/hooks/usePartyFilter";
import { getApprovedParties } from "@/lib/storage";

export default function AllParties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [approvedParties, setApprovedParties] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Load approved parties from localStorage
  useEffect(() => {
    const approved = getApprovedParties();
    
    // Map localStorage parties to match mockParties format
    const mappedParties = approved.map((p: any) => {
      const price = Number(p.price) || 0;
      const attendees = Number(p.attendees) || 0;
      const capacity = Number(p.capacity) || 20;
      
      return {
        id: p.id,
        title: p.title || "Untitled Party",
        image: (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : "/placeholder-party.jpg",
        date: p.date,
        dateTimestamp: new Date(p.date).getTime(),
        location: p.location || p.city || "TBA",
        city: p.city || "Unknown",
        price: price,
        priceFormatted: `$${price.toLocaleString()}`,
        attendees: attendees,
        maxAttendees: capacity,
        ageRange: p.ageRange || "21-35",
        type: p.type || "Party",
        theme: p.type || "Party",
        description: p.description || "",
        hostName: p.host || "Host",
        rating: Number(p.rating) || 4.5,
      };
    });
    
    setApprovedParties(mappedParties);
  }, []);
  
  // Combine mockParties with approved parties
  const allParties = [...mockParties, ...approvedParties];
  
  const { filters, filteredParties, updateFilter, totalResults } =
    usePartyFilter(allParties);

  // 외부에서 전달된 검색어와 도시 필터 적용
  if (filters.searchQuery !== searchQuery) {
    updateFilter("searchQuery", searchQuery);
  }
  if (filters.city !== selectedCity) {
    updateFilter("city", selectedCity);
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, filters.dateRange, filters.priceRange, filters.sortBy]);

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
    // 현재 필터가 활성화되어 있는지 확인
    const currentValue = filters[type];
    let isCurrentlyActive = false;
    
    if (type === "dateRange") {
      isCurrentlyActive = currentValue === value;
    } else if (type === "priceRange") {
      isCurrentlyActive = Array.isArray(currentValue) && 
                          Array.isArray(value) &&
                          currentValue[0] === value[0] && 
                          currentValue[1] === value[1];
    } else if (type === "sortBy") {
      isCurrentlyActive = currentValue === value;
    }
    
    if (isCurrentlyActive) {
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

  // Pagination logic
  const itemsPerPage = isMobile ? 6 : filteredParties.length; // 6 items per page on mobile, all on desktop
  const totalPages = Math.ceil(filteredParties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParties = filteredParties.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!isMobile || totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-lg glass border-white/20 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              onClick={() => goToPage(1)}
              className="w-9 h-9 rounded-lg glass border-white/20"
            >
              1
            </Button>
            {startPage > 2 && <span className="text-muted-foreground">...</span>}
          </>
        )}
        
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant="outline"
            onClick={() => goToPage(page)}
            className={`w-9 h-9 rounded-lg glass border-white/20 ${
              currentPage === page 
                ? 'bg-primary/20 border-primary/50 text-primary font-semibold' 
                : ''
            }`}
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-muted-foreground">...</span>}
            <Button
              variant="outline"
              onClick={() => goToPage(totalPages)}
              className="w-9 h-9 rounded-lg glass border-white/20"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-lg glass border-white/20 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
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
              All <span className="gradient-text">Parties</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {totalResults > 0
                ? `${totalResults} parties found${isMobile && totalPages > 1 ? ` • Page ${currentPage} of ${totalPages}` : ''}`
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
                  key={`${filter.label}-${isActive}`}
                  variant="outline"
                  onClick={() => handleQuickFilter(filter.type, filter.value)}
                  style={{
                    borderColor: isActive ? 'rgb(168, 85, 247)' : 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: isActive ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    color: isActive ? 'rgb(168, 85, 247)' : 'inherit',
                    fontWeight: isActive ? '600' : '400'
                  }}
                  className="glass rounded-full px-6 transition-all hover:border-primary/50 hover:bg-primary/10"
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
                  Date: {quickFilters.find((f) => f.value === filters.dateRange)?.label}
                </div>
              )}
            </div>
          )}

          {/* Party Grid */}
          {filteredParties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentParties.map((party, index) => (
                  <div
                    key={party.id}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PartyCard {...party} />
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </>
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

