import { useState, useEffect } from "react";
import PartyCard from "./PartyCard";
import { Button } from "./ui/button";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { Link } from "wouter";
import { FilterOptions } from "@/types/party";
import { mockParties } from "@/data/mockParties";
import { usePartyFilter } from "@/hooks/usePartyFilter";
import { getApprovedParties } from "@/lib/storage";

interface FeaturedPartiesProps {
  searchQuery?: string;
  selectedCity?: string;
}

export default function FeaturedParties({
  searchQuery = "",
  selectedCity = "all",
}: FeaturedPartiesProps) {
  const [approvedParties, setApprovedParties] = useState<any[]>([]);
  
  // Load approved parties from API and localStorage
  useEffect(() => {
    const loadParties = async () => {
      try {
        // Fetch from API
        const response = await fetch('/api/parties');
        const data = await response.json();
        const apiParties = data.parties || [];
        
        // Also get from localStorage as fallback
        const localParties = getApprovedParties();
        
        // Combine and deduplicate
        const allParties = [...apiParties, ...localParties];
        const uniqueParties = allParties.filter((party, index, self) => 
          index === self.findIndex((p) => p.id === party.id)
        );
        
        // Map to match mockParties format
        const mappedParties = uniqueParties.map((p: any) => {
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
            hostName: p.hostNickname || p.host || "Host",
            rating: Number(p.rating) || 4.5,
          };
        });
        
        setApprovedParties(mappedParties);
      } catch (error) {
        console.error('Failed to load parties from API, using localStorage only:', error);
        // Fallback to localStorage only
        const approved = getApprovedParties();
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
            hostName: p.hostNickname || p.host || "Host",
            rating: Number(p.rating) || 4.5,
          };
        });
        setApprovedParties(mappedParties);
      }
    };
    
    loadParties();
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
    // Check if the filter is currently active
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
      // Deactivate filter: reset to default
      if (type === "dateRange") {
        updateFilter(type, "all" as any);
      } else if (type === "priceRange") {
        updateFilter(type, [0, 1000000]); // Reset to wide range
      } else if (type === "sortBy") {
        updateFilter(type, "none");
      }
    } else {
      // Activate filter
      updateFilter(type, value);
    }
  };

  return (
    <section className="py-20 relative" data-featured-parties>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="animate-fadeIn">
            For You <span className="gradient-text">Featured Parties</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {totalResults > 0
              ? `${totalResults} parties found`
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
                ? filters.priceRange?.[1] === (filter.value as [number, number])?.[1]
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
              <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30 flex items-center gap-2">
                <span>Search: "{searchQuery}"</span>
                <button
                  onClick={() => updateFilter("searchQuery", "")}
                  className="hover:text-red-500 transition-colors w-4 h-4 flex items-center justify-center"
                  aria-label="Remove search filter"
                >
                  ✕
                </button>
              </div>
            )}
            {selectedCity !== "all" && (
              <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30 flex items-center gap-2">
                <span>City: {selectedCity}</span>
                <button
                  onClick={() => updateFilter("city", "all")}
                  className="hover:text-red-500 transition-colors w-4 h-4 flex items-center justify-center"
                  aria-label="Remove city filter"
                >
                  ✕
                </button>
              </div>
            )}
            {filters.dateRange !== "all" && (
              <div className="glass rounded-full px-4 py-2 text-sm border border-primary/30 flex items-center gap-2">
                <span>Date: {quickFilters.find((f) => f.value === filters.dateRange)?.label}</span>
                <button
                  onClick={() => updateFilter("dateRange", "all")}
                  className="hover:text-red-500 transition-colors w-4 h-4 flex items-center justify-center"
                  aria-label="Remove date filter"
                >
                  ✕
                </button>
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
            <div className="text-center">
              <Link href="/all-parties">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass border-primary/30 hover:border-primary/50 hover:bg-primary/10 rounded-2xl px-8 h-12 group"
                >
                  View All Parties ({filteredParties.length})
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
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
    </section>
  );
}

