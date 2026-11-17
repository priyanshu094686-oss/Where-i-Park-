// Type definitions for 'Where Did I Park?' - Smart Two-Wheeler Parking System

export type UserRole = 'student' | 'admin';

export type VehicleType = 'Motorcycle' | 'Scooter' | 'Electric Bike' | 'Bicycle';

export type ParkingStatus = 'Available' | 'Limited' | 'Full';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  regNumber: string; // Student/Staff ID e.g. 12509608
  department: string;
  defaultVehicleType: VehicleType;
  defaultVehicleNumber: string;
  phone?: string;
  avatar?: string;
}

export interface AcademicBlock {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  nearestLots: string[]; // IDs of nearest parking lots
}

export interface ParkingLot {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [lat, lng]
  totalCapacity: number;
  occupiedSpaces: number;
  availableSpaces: number;
  status: ParkingStatus;
  assignedBlocks: string[]; // Academic block IDs
  floorOrZones: string[];
  sections: string[];
  distanceFromBlocks?: Record<string, { distanceMeters: number; walkTimeMins: number }>;
  isCovered?: boolean;
  hasCCTV?: boolean;
  hasEVCharging?: boolean;
  description?: string;
}

export interface ParkingSlot {
  id: string;
  lotId: string;
  section: string;
  slotNumber: string;
  isOccupied: boolean;
  vehicleType?: VehicleType;
  vehicleNumber?: string;
  lastUpdated: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  type: VehicleType;
  regNumber: string;
  model: string;
  nickname?: string;
  color?: string;
}

export interface SavedParking {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  regNumber: string;
  lotId: string;
  lotName: string;
  section: string;
  slot: string;
  floorZone: string;
  notes?: string;
  parkedAt: string; // ISO date string
  coordinates?: [number, number];
  academicBlockId?: string;
  isActive: boolean;
}

export interface ParkingHistoryItem {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  regNumber: string;
  lotName: string;
  section: string;
  slot: string;
  floorZone?: string;
  notes?: string;
  parkedAt: string;
  departedAt: string;
  durationMinutes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export type FilterOption = 'all' | 'available' | 'limited' | 'full' | 'nearest' | 'less_crowded';

export type SortOption = 'distance' | 'available_desc' | 'occupancy_asc' | 'capacity_desc';
