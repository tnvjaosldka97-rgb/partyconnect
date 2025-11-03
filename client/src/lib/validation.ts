import { z } from 'zod';
import DOMPurify from 'dompurify';

// ============================================
// Input Sanitization
// ============================================

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Remove all HTML tags
    ALLOWED_ATTR: [],
  });
}

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

// ============================================
// Validation Functions
// ============================================

export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  phone: (phone: string): boolean => {
    return /^[0-9-+() ]+$/.test(phone);
  },
  
  name: (name: string): boolean => {
    return /^[a-zA-Z가-힣\s]+$/.test(name) && name.length >= 2;
  },
  
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};

// ============================================
// Zod Schemas
// ============================================

export const HostApplicationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9-+() ]+$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(1, "City is required"),
  spaceType: z.string().min(1, "Space type is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  capacity: z.number().int().min(5, "Minimum capacity is 5").max(500, "Maximum capacity is 500"),
  intro: z.string().min(10, "Introduction must be at least 10 characters"),
  experience: z.string().min(10, "Experience must be at least 10 characters"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  idCardImage: z.string().url("Invalid ID card image URL"),
  criminalRecordImage: z.string().url("Invalid criminal record image URL"),
  agreedToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
  agreedToLegalResponsibility: z.boolean().refine(val => val === true, "You must agree to legal responsibility"),
  status: z.enum(["pending", "approved", "rejected"]),
  appliedAt: z.string().datetime(),
  approvedAt: z.string().datetime().optional(),
});

export const PartySchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  host: z.string().min(2, "Host name must be at least 2 characters"),
  hostId: z.string(),
  price: z.number().int().min(0, "Price cannot be negative").max(1000000, "Price too high"),
  capacity: z.number().int().min(5, "Minimum capacity is 5").max(500, "Maximum capacity is 500"),
  attendees: z.number().int().min(0, "Attendees cannot be negative"),
  ageRange: z.string(),
  type: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
  tags: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  createdAt: z.string().datetime().optional(),
});

export const HostSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9-+() ]+$/, "Invalid phone number"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  status: z.enum(["pending", "approved", "rejected"]),
  appliedAt: z.string().datetime(),
  approvedAt: z.string().datetime().optional(),
});

// ============================================
// Type Guards
// ============================================

export type HostApplication = z.infer<typeof HostApplicationSchema>;
export type Party = z.infer<typeof PartySchema>;
export type Host = z.infer<typeof HostSchema>;

export function isHostApplication(obj: unknown): obj is HostApplication {
  try {
    HostApplicationSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

export function isParty(obj: unknown): obj is Party {
  try {
    PartySchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

export function isHost(obj: unknown): obj is Host {
  try {
    HostSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// Safe Parse Functions
// ============================================

export function safeParseHostApplication(data: unknown) {
  return HostApplicationSchema.safeParse(data);
}

export function safeParseParty(data: unknown) {
  return PartySchema.safeParse(data);
}

export function safeParseHost(data: unknown) {
  return HostSchema.safeParse(data);
}

// ============================================
// Date/Time Validation
// ============================================

export function validateTimeFormat(time: string): { valid: boolean; error?: string } {
  // Accept HH:MM format (24-hour)
  const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  
  if (!timePattern.test(time)) {
    return {
      valid: false,
      error: "Please enter time in HH:MM format (e.g., 14:30 for 2:30 PM)",
    };
  }
  
  return { valid: true };
}

export function validateDateFormat(date: string): { valid: boolean; error?: string } {
  // Accept MM/DD/YYYY or YYYY-MM-DD formats
  const mmddyyyyPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  const yyyymmddPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  
  if (!mmddyyyyPattern.test(date) && !yyyymmddPattern.test(date)) {
    return {
      valid: false,
      error: "Please enter date in MM/DD/YYYY format (e.g., 12/25/2024)",
    };
  }
  
  // Convert MM/DD/YYYY to YYYY-MM-DD for validation
  let dateStr = date;
  if (mmddyyyyPattern.test(date)) {
    const [month, day, year] = date.split('/');
    dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Validate actual date
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) {
    return {
      valid: false,
      error: "Invalid date",
    };
  }
  
  return { valid: true };
}

export function validatePartyDateTime(date: string, time: string): { valid: boolean; error?: string } {
  try {
    const partyDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1); // 1년 후까지만 허용
    
    // 과거 날짜 체크
    if (partyDateTime < now) {
      return {
        valid: false,
        error: "Party date and time must be in the future",
      };
    }
    
    // 너무 먼 미래 체크
    if (partyDateTime > maxDate) {
      return {
        valid: false,
        error: "Party date cannot be more than 1 year in the future",
      };
    }
    
    // 최소 24시간 전에 생성
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 24);
    if (partyDateTime < minDate) {
      return {
        valid: false,
        error: "Party must be created at least 24 hours in advance",
      };
    }
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: "Invalid date or time format",
    };
  }
}

// ============================================
// Capacity Validation
// ============================================

export function validateCapacity(capacity: string | number): { valid: boolean; error?: string } {
  const num = typeof capacity === 'string' ? parseInt(capacity) : capacity;
  
  if (isNaN(num)) {
    return { valid: false, error: "Capacity must be a number" };
  }
  
  if (num < 5) {
    return { valid: false, error: "Minimum capacity is 5 people" };
  }
  
  if (num > 500) {
    return { valid: false, error: "Maximum capacity is 500 people" };
  }
  
  return { valid: true };
}

// ============================================
// Price Validation
// ============================================

export function validatePrice(price: string | number): { valid: boolean; error?: string } {
  const num = typeof price === 'string' ? parseInt(price) : price;
  
  if (isNaN(num)) {
    return { valid: false, error: "Price must be a number" };
  }
  
  if (num < 0) {
    return { valid: false, error: "Price cannot be negative" };
  }
  
  if (num > 1000000) {
    return { valid: false, error: "Maximum price is $1,000,000" };
  }
  
  return { valid: true };
}

