//lib/types.ts
import {
  Car,
  CarFront,
  Contrast,
  Palette,
  Settings,
  Shield,
  ShieldCheck,
  Ship,
  Sparkles,
  Sun,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Car types
export type CarStatus = "Available" | "Reserved" | "Sold" | "Incoming";

export type CarCondition = "Local" | "Imported" | "Foreign Used";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Car {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  bodyType: string;
  engine: string;
  drive: string;
  color: string;
  condition: CarCondition;
  status: CarStatus;
  featured: boolean;
  images: string[];
  features: string[];
  description: string;
  sellerId?: string;              // who owns this car
  approvalStatus?: ApprovalStatus; // pending, approved or rejected
  rejectionReason?: string;       // why the admin rejected it
  createdAt: string;
}

// Service types
export interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  priceFrom: number | null;
  duration: string | null;
}

// Package types
export type PackageCategory =
  | "Window Tinting"
  | "Paint Protection"
  | "Detailing";

export interface Package {
  id: string;
  slug: string;
  name: string;
  category: PackageCategory;
  description: string;
  price: number;
  originalPrice: number | null;
  duration: string;
  features: string[];
  popular: boolean;
}

// Product types
export type ProductCategory = "Accessories" | "Spare Parts";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
  rating: number;
}

// Gallery types
export type GalleryCategory =
  | "Wraps"
  | "PPF"
  | "Tinting"
  | "Styling"
  | "Imports"
  | "Detailing";

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  description: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  car: string;
  date: string;
}

// Site information types
export interface SiteInfo {
  name: string;
  tagline: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  location: string;
  address: string;
  established: number;
  hours: { days: string; time: string }[];
  socials: { name: string; url: string }[];
}

// Format prices in Kenyan shillings
export function formatKES(amount: number): string {
  return `KES ${new Intl.NumberFormat("en-KE").format(amount)}`;
}

// Format mileage
export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat("en-KE").format(km)} km`;
}

// Generate a WhatsApp link
export function whatsappLink(
  number: string,
  message: string
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

// Map service data icon names to Lucide React icons
const ICONS: Record<string, LucideIcon> = {
  Ship,
  Car,
  CarFront,
  Sparkles,
  Palette,
  Shield,
  ShieldCheck,
  Contrast,
  Wrench,
  Settings,
  Sun,
};

// Return the matching icon or a default icon
export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Settings;
}
