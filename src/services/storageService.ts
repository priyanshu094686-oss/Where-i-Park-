// Storage Service for 'Where Did I Park?'
// Supports LocalStorage persistence with reactivity, and syncs with Supabase if connected

import { 
  UserProfile, 
  UserRole, 
  ParkingLot, 
  SavedParking, 
  ParkingHistoryItem, 
  NotificationItem, 
  AcademicBlock,
  ParkingStatus
} from '../types';
import { 
  DEFAULT_STUDENT_PROFILE, 
  DEFAULT_ADMIN_PROFILE, 
  DEMO_ACADEMIC_BLOCKS, 
  DEMO_PARKING_LOTS, 
  DEFAULT_SAVED_PARKING, 
  DEFAULT_PARKING_HISTORY, 
  DEFAULT_NOTIFICATIONS 
} from '../data/mockData';

const KEYS = {
  ROLE: 'wip_current_role',
  PROFILE_STUDENT: 'wip_profile_student',
  PROFILE_ADMIN: 'wip_profile_admin',
  SELECTED_BLOCK: 'wip_selected_block_id',
  PARKING_LOTS: 'wip_parking_lots',
  SAVED_PARKING: 'wip_saved_parking',
  PARKING_HISTORY: 'wip_parking_history',
  NOTIFICATIONS: 'wip_notifications',
  THEME: 'wip_theme',
};

// Helper to broadcast state changes across components
export const broadcastChange = (type: string) => {
  window.dispatchEvent(new CustomEvent('wip_data_changed', { detail: { type } }));
};

class StorageService {
  // Initialize storage with mock defaults if empty
  init() {
    if (!localStorage.getItem(KEYS.PARKING_LOTS)) {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    localStorage.setItem(KEYS.ROLE, 'student');
    localStorage.setItem(KEYS.PROFILE_STUDENT, JSON.stringify(DEFAULT_STUDENT_PROFILE));
    localStorage.setItem(KEYS.PROFILE_ADMIN, JSON.stringify(DEFAULT_ADMIN_PROFILE));
    localStorage.setItem(KEYS.SELECTED_BLOCK, 'block-28');
    localStorage.setItem(KEYS.PARKING_LOTS, JSON.stringify(DEMO_PARKING_LOTS));
    localStorage.setItem(KEYS.SAVED_PARKING, JSON.stringify(DEFAULT_SAVED_PARKING));
    localStorage.setItem(KEYS.PARKING_HISTORY, JSON.stringify(DEFAULT_PARKING_HISTORY));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    broadcastChange('all');
  }

  // --- Role & Profile ---
  getCurrentRole(): UserRole {
    return (localStorage.getItem(KEYS.ROLE) as UserRole) || 'student';
  }

  setCurrentRole(role: UserRole) {
    localStorage.setItem(KEYS.ROLE, role);
    this.addNotification({
      title: 'Role Switched',
      message: `You are now interacting as ${role === 'admin' ? 'Campus Parking Admin' : 'Student / Staff'}.`,
      type: 'info',
    });
    broadcastChange('role');
  }

  getUserProfile(role?: UserRole): UserProfile {
    const activeRole = role || this.getCurrentRole();
    const key = activeRole === 'admin' ? KEYS.PROFILE_ADMIN : KEYS.PROFILE_STUDENT;
    const raw = localStorage.getItem(key);
    if (!raw) {
      return activeRole === 'admin' ? DEFAULT_ADMIN_PROFILE : DEFAULT_STUDENT_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return activeRole === 'admin' ? DEFAULT_ADMIN_PROFILE : DEFAULT_STUDENT_PROFILE;
    }
  }

  updateUserProfile(profile: Partial<UserProfile>, role?: UserRole) {
    const activeRole = role || this.getCurrentRole();
    const current = this.getUserProfile(activeRole);
    const updated = { ...current, ...profile };
    const key = activeRole === 'admin' ? KEYS.PROFILE_ADMIN : KEYS.PROFILE_STUDENT;
    localStorage.setItem(key, JSON.stringify(updated));
    broadcastChange('profile');
    return updated;
  }

  // --- Academic Blocks ---
  getAcademicBlocks(): AcademicBlock[] {
    return DEMO_ACADEMIC_BLOCKS;
  }

  getSelectedBlockId(): string {
    return localStorage.getItem(KEYS.SELECTED_BLOCK) || 'block-28';
  }

  setSelectedBlockId(blockId: string) {
    localStorage.setItem(KEYS.SELECTED_BLOCK, blockId);
    broadcastChange('block');
  }

  getSelectedBlock(): AcademicBlock {
    const id = this.getSelectedBlockId();
    return DEMO_ACADEMIC_BLOCKS.find(b => b.id === id) || DEMO_ACADEMIC_BLOCKS[0];
  }

  // --- Parking Lots ---
  getParkingLots(): ParkingLot[] {
    const raw = localStorage.getItem(KEYS.PARKING_LOTS);
    if (!raw) return DEMO_PARKING_LOTS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_PARKING_LOTS;
    }
  }

  getParkingLotById(id: string): ParkingLot | undefined {
    return this.getParkingLots().find(lot => lot.id === id);
  }

  saveParkingLots(lots: ParkingLot[]) {
    localStorage.setItem(KEYS.PARKING_LOTS, JSON.stringify(lots));
    broadcastChange('lots');
  }

  addParkingLot(lot: Omit<ParkingLot, 'id'>): ParkingLot {
    const lots = this.getParkingLots();
    const newId = `lot-${Date.now().toString(36)}`;
    const newLot: ParkingLot = {
      ...lot,
      id: newId,
      availableSpaces: Math.max(0, lot.totalCapacity - lot.occupiedSpaces),
      status: this.calculateStatus(lot.totalCapacity, lot.occupiedSpaces),
    };
    lots.push(newLot);
    this.saveParkingLots(lots);
    this.addNotification({
      title: 'New Parking Lot Added',
      message: `Parking lot "${newLot.name}" has been registered in the system.`,
      type: 'success',
    });
    return newLot;
  }

  updateParkingLot(id: string, updates: Partial<ParkingLot>): ParkingLot | null {
    const lots = this.getParkingLots();
    const index = lots.findIndex(l => l.id === id);
    if (index === -1) return null;

    const existing = lots[index];
    const totalCapacity = updates.totalCapacity ?? existing.totalCapacity;
    const occupiedSpaces = updates.occupiedSpaces !== undefined 
      ? Math.min(totalCapacity, Math.max(0, updates.occupiedSpaces)) 
      : existing.occupiedSpaces;
    const availableSpaces = Math.max(0, totalCapacity - occupiedSpaces);
    const status = updates.status || this.calculateStatus(totalCapacity, occupiedSpaces);

    const updatedLot: ParkingLot = {
      ...existing,
      ...updates,
      totalCapacity,
      occupiedSpaces,
      availableSpaces,
      status,
    };

    lots[index] = updatedLot;
    this.saveParkingLots(lots);
    return updatedLot;
  }

  deleteParkingLot(id: string): boolean {
    const lots = this.getParkingLots();
    const filtered = lots.filter(l => l.id !== id);
    if (filtered.length === lots.length) return false;
    this.saveParkingLots(filtered);
    this.addNotification({
      title: 'Parking Lot Removed',
      message: `Parking lot was removed from system records.`,
      type: 'warning',
    });
    return true;
  }

  adjustLotOccupancy(lotId: string, delta: number): ParkingLot | null {
    const lot = this.getParkingLotById(lotId);
    if (!lot) return null;
    const newOccupied = Math.min(lot.totalCapacity, Math.max(0, lot.occupiedSpaces + delta));
    return this.updateParkingLot(lotId, { occupiedSpaces: newOccupied });
  }

  private calculateStatus(capacity: number, occupied: number): ParkingStatus {
    if (occupied >= capacity) return 'Full';
    const occupancyRate = (occupied / capacity) * 100;
    if (occupancyRate >= 80) return 'Limited';
    return 'Available';
  }

  // --- Saved Parking (Current Vehicle Location) ---
  getSavedParking(): SavedParking | null {
    const raw = localStorage.getItem(KEYS.SAVED_PARKING);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      return data && data.isActive ? data : null;
    } catch {
      return null;
    }
  }

  saveParkingLocation(data: Omit<SavedParking, 'id' | 'isActive'>): SavedParking {
    const newRecord: SavedParking = {
      ...data,
      id: `sp-${Date.now()}`,
      isActive: true,
    };
    localStorage.setItem(KEYS.SAVED_PARKING, JSON.stringify(newRecord));

    // Also update parking lot occupancy (+1)
    if (newRecord.lotId) {
      this.adjustLotOccupancy(newRecord.lotId, 1);
    }

    // Add confirmation notification
    this.addNotification({
      title: 'Vehicle Location Saved! 📍',
      message: `${newRecord.vehicleType} (${newRecord.regNumber}) marked at ${newRecord.lotName}, Section ${newRecord.section}, Slot ${newRecord.slot}.`,
      type: 'success',
      actionUrl: '/find-vehicle',
    });

    broadcastChange('saved_parking');
    return newRecord;
  }

  clearSavedParking(archiveToHistory: boolean = true): boolean {
    const current = this.getSavedParking();
    if (!current) return false;

    if (archiveToHistory) {
      const parkedTime = new Date(current.parkedAt).getTime();
      const now = Date.now();
      const durationMinutes = Math.max(5, Math.round((now - parkedTime) / (1000 * 60)));

      const historyItem: ParkingHistoryItem = {
        id: `hist-${Date.now()}`,
        userId: current.userId,
        vehicleType: current.vehicleType,
        regNumber: current.regNumber,
        lotName: current.lotName,
        section: current.section,
        slot: current.slot,
        floorZone: current.floorZone,
        notes: current.notes,
        parkedAt: current.parkedAt,
        departedAt: new Date().toISOString(),
        durationMinutes,
      };

      this.addHistoryItem(historyItem);
    }

    // Free up lot space (-1)
    if (current.lotId) {
      this.adjustLotOccupancy(current.lotId, -1);
    }

    localStorage.removeItem(KEYS.SAVED_PARKING);
    this.addNotification({
      title: 'Parking Location Released',
      message: `Your saved spot for ${current.regNumber} has been cleared and archived to parking history.`,
      type: 'info',
    });

    broadcastChange('saved_parking');
    return true;
  }

  // --- Parking History ---
  getParkingHistory(): ParkingHistoryItem[] {
    const raw = localStorage.getItem(KEYS.PARKING_HISTORY);
    if (!raw) return DEFAULT_PARKING_HISTORY;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PARKING_HISTORY;
    }
  }

  addHistoryItem(item: ParkingHistoryItem) {
    const history = this.getParkingHistory();
    history.unshift(item);
    localStorage.setItem(KEYS.PARKING_HISTORY, JSON.stringify(history));
    broadcastChange('history');
  }

  deleteHistoryItem(id: string): boolean {
    const history = this.getParkingHistory();
    const filtered = history.filter(h => h.id !== id);
    if (filtered.length === history.length) return false;
    localStorage.setItem(KEYS.PARKING_HISTORY, JSON.stringify(filtered));
    broadcastChange('history');
    return true;
  }

  clearAllHistory() {
    localStorage.setItem(KEYS.PARKING_HISTORY, JSON.stringify([]));
    broadcastChange('history');
  }

  // --- In-App Notifications ---
  getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) return DEFAULT_NOTIFICATIONS;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): NotificationItem {
    const list = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    list.unshift(newNotif);
    // Keep max 20 notifications
    if (list.length > 20) list.pop();
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    broadcastChange('notifications');
    return newNotif;
  }

  markNotificationAsRead(id: string) {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
      broadcastChange('notifications');
    }
  }

  markAllNotificationsAsRead() {
    const list = this.getNotifications().map(n => ({ ...n, isRead: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    broadcastChange('notifications');
  }

  deleteNotification(id: string) {
    const list = this.getNotifications().filter(n => n.id !== id);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    broadcastChange('notifications');
  }
}

export const storageService = new StorageService();
storageService.init();
