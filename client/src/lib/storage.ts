// LocalStorage management utilities

export interface HostApplication {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  spaceType: string;
  address: string;
  capacity: number;
  intro: string;
  experience: string;
  images: string[];
  idCardImage: string;
  criminalRecordImage: string;
  agreedToTerms: boolean;
  agreedToLegalResponsibility: boolean;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  approvedAt?: string;
}

export interface Party {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  city: string;
  host: string;
  hostId: string;
  price: number;
  capacity: number;
  attendees: number;
  ageRange: string;
  type: string;
  description: string;
  images: string[];
  tags: string[];
  rating: number;
  reviews: number;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

// Host application management
export function getHostApplications(): HostApplication[] {
  const data = localStorage.getItem("hostApplications");
  return data ? JSON.parse(data) : [];
}

export function saveHostApplication(application: HostApplication): boolean {
  try {
    const applications = getHostApplications();
    applications.push(application);
    localStorage.setItem("hostApplications", JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error("Failed to save host application:", error);
    return false;
  }
}

export function updateHostApplicationStatus(
  id: string,
  status: "approved" | "rejected"
): boolean {
  try {
    const applications = getHostApplications();
    const index = applications.findIndex((app) => app.id === id);
    
    if (index === -1) return false;
    
    applications[index].status = status;
    applications[index].approvedAt = new Date().toISOString();
    
    localStorage.setItem("hostApplications", JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error("Failed to update application status:", error);
    return false;
  }
}

// Check if host is approved
export function isHostApproved(email: string): boolean {
  try {
    const applications = getHostApplications();
    const application = applications.find(
      (app) => app.email.toLowerCase() === email.toLowerCase() && app.status === "approved"
    );
    return !!application;
  } catch (error) {
    console.error("Failed to check host approval:", error);
    return false;
  }
}

// Get host information by email
export function getHostByEmail(email: string): HostApplication | null {
  try {
    const applications = getHostApplications();
    const application = applications.find(
      (app) => app.email.toLowerCase() === email.toLowerCase() && app.status === "approved"
    );
    return application || null;
  } catch (error) {
    console.error("Failed to get host by email:", error);
    return null;
  }
}

// Party management
export function getParties(): Party[] {
  const data = localStorage.getItem("parties");
  return data ? JSON.parse(data) : [];
}

export function saveParty(party: Party): boolean {
  try {
    const parties = getParties();
    parties.push(party);
    localStorage.setItem("parties", JSON.stringify(parties));
    return true;
  } catch (error) {
    console.error("Failed to save party:", error);
    return false;
  }
}

// Update party status (approve/reject)
export function updatePartyStatus(
  id: string,
  status: "approved" | "rejected"
): boolean {
  try {
    const parties = getParties();
    const index = parties.findIndex((party) => party.id === id);
    
    if (index === -1) return false;
    
    parties[index].status = status;
    
    localStorage.setItem("parties", JSON.stringify(parties));
    return true;
  } catch (error) {
    console.error("Failed to update party status:", error);
    return false;
  }
}

// Get approved parties only
export function getApprovedParties(): Party[] {
  try {
    const parties = getParties();
    return parties.filter((party) => party.status === "approved");
  } catch (error) {
    console.error("Failed to get approved parties:", error);
    return [];
  }
}

// Update party
export function updateParty(id: string, updatedParty: Partial<Party>): boolean {
  try {
    const parties = getParties();
    const index = parties.findIndex((party) => party.id === id);
    
    if (index === -1) return false;
    
    parties[index] = { ...parties[index], ...updatedParty };
    
    localStorage.setItem("parties", JSON.stringify(parties));
    return true;
  } catch (error) {
    console.error("Failed to update party:", error);
    return false;
  }
}

// Delete party
export function deleteParty(id: string): boolean {
  try {
    const parties = getParties();
    const filteredParties = parties.filter((party) => party.id !== id);
    localStorage.setItem("parties", JSON.stringify(filteredParties));
    return true;
  } catch (error) {
    console.error("Failed to delete party:", error);
    return false;
  }
}

// Delete host application
export function deleteHostApplication(id: string): boolean {
  try {
    const applications = getHostApplications();
    const filteredApplications = applications.filter((app) => app.id !== id);
    localStorage.setItem("hostApplications", JSON.stringify(filteredApplications));
    return true;
  } catch (error) {
    console.error("Failed to delete host application:", error);
    return false;
  }
}

// Auto-create party when host is approved
export function createPartyFromApplication(application: HostApplication): boolean {
  try {
    const party: Party = {
      id: `party-${Date.now()}`,
      title: `${application.spaceType} Party - ${application.city}`,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days later
      time: "19:00",
      location: application.address,
      city: application.city,
      host: application.name,
      hostId: application.id,
      price: 45,
      capacity: application.capacity,
      attendees: 0,
      ageRange: "21-35",
      type: application.spaceType,
      description: application.intro || "Join us for an amazing party!",
      images: application.images.length > 0 ? application.images : ["/placeholder-party.jpg"],
      tags: ["new", application.city, application.spaceType],
      rating: 0,
      reviews: 0,
    };
    
    return saveParty(party);
  } catch (error) {
    console.error("Failed to create party from application:", error);
    return false;
  }
}

