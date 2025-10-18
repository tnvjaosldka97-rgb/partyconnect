// LocalStorage 관리 유틸리티

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
}

// 호스트 신청 관리
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

// 호스트 승인 여부 확인
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

// 이메일로 호스트 정보 가져오기
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

// 파티 관리
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

// 호스트 승인 시 자동 파티 생성
export function createPartyFromApplication(application: HostApplication): boolean {
  try {
    const party: Party = {
      id: `party-${Date.now()}`,
      title: `${application.spaceType} 파티 - ${application.city}`,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7일 후
      time: "19:00",
      location: application.address,
      city: application.city,
      host: application.name,
      hostId: application.id,
      price: 35000,
      capacity: application.capacity,
      attendees: 0,
      ageRange: "21-35세",
      type: application.spaceType,
      description: application.intro || "멋진 파티에 여러분을 초대합니다!",
      images: application.images.length > 0 ? application.images : ["/placeholder-party.jpg"],
      tags: ["신규", application.city, application.spaceType],
      rating: 0,
      reviews: 0,
    };
    
    return saveParty(party);
  } catch (error) {
    console.error("Failed to create party from application:", error);
    return false;
  }
}

