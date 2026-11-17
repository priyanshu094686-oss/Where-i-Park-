import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { UserRole, UserProfile, ParkingLot, SavedParking, ParkingHistoryItem, NotificationItem, AcademicBlock } from '../types';

export function useStorage() {
  const [role, setRole] = useState<UserRole>(storageService.getCurrentRole());
  const [profile, setProfile] = useState<UserProfile>(storageService.getUserProfile());
  const [academicBlocks] = useState<AcademicBlock[]>(storageService.getAcademicBlocks());
  const [selectedBlockId, setSelectedBlockId] = useState<string>(storageService.getSelectedBlockId());
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>(storageService.getParkingLots());
  const [savedParking, setSavedParking] = useState<SavedParking | null>(storageService.getSavedParking());
  const [parkingHistory, setParkingHistory] = useState<ParkingHistoryItem[]>(storageService.getParkingHistory());
  const [notifications, setNotifications] = useState<NotificationItem[]>(storageService.getNotifications());

  const refreshState = () => {
    const currentRole = storageService.getCurrentRole();
    setRole(currentRole);
    setProfile(storageService.getUserProfile(currentRole));
    setSelectedBlockId(storageService.getSelectedBlockId());
    setParkingLots(storageService.getParkingLots());
    setSavedParking(storageService.getSavedParking());
    setParkingHistory(storageService.getParkingHistory());
    setNotifications(storageService.getNotifications());
  };

  useEffect(() => {
    const handler = () => {
      refreshState();
    };

    window.addEventListener('wip_data_changed', handler);
    return () => window.removeEventListener('wip_data_changed', handler);
  }, []);

  const switchRole = (newRole: UserRole) => {
    storageService.setCurrentRole(newRole);
    refreshState();
  };

  const selectBlock = (blockId: string) => {
    storageService.setSelectedBlockId(blockId);
    setSelectedBlockId(blockId);
  };

  const selectedBlock = academicBlocks.find(b => b.id === selectedBlockId) || academicBlocks[0];

  return {
    role,
    profile,
    academicBlocks,
    selectedBlockId,
    selectedBlock,
    parkingLots,
    savedParking,
    parkingHistory,
    notifications,
    switchRole,
    selectBlock,
    refreshState,
  };
}
