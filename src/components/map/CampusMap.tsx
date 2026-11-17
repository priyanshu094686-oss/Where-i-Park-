import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  ShieldAlert, 
  Compass
} from 'lucide-react';
import { ParkingLot, AcademicBlock, SavedParking } from '../../types';

interface CampusMapProps {
  lots: ParkingLot[];
  selectedBlock: AcademicBlock;
  savedParking?: SavedParking | null;
  selectedLotId?: string | null;
  onSelectLot?: (lot: ParkingLot) => void;
  height?: string;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  lots,
  selectedBlock,
  savedParking,
  selectedLotId,
  onSelectLot,
  height = '500px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  const [filterStatus, setFilterStatus] = useState<'all' | 'Available' | 'Limited' | 'Full'>('all');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // LPU Campus Center coordinates
      const map = L.map(mapContainerRef.current, {
        center: [31.2536, 75.7037],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // OpenStreetMap Tiles with subtle styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | LPU INT335 P07',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers whenever lots, selectedBlock, or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // 1. Academic Block Marker
    if (selectedBlock && selectedBlock.coordinates) {
      const blockIcon = L.divIcon({
        className: 'custom-academic-marker',
        html: `
          <div style="background: #0F172A; color: white; padding: 6px 10px; border-radius: 9999px; font-weight: 700; font-size: 11px; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(15,23,42,0.3); border: 2px solid #38BDF8; white-space: nowrap;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            <span>${selectedBlock.code}</span>
          </div>
        `,
        iconSize: [80, 30],
        iconAnchor: [40, 15],
      });

      const blockMarker = L.marker(selectedBlock.coordinates, { icon: blockIcon }).addTo(markersGroup);
      blockMarker.bindPopup(`
        <div style="padding: 12px; font-family: sans-serif;">
          <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #0284C7; font-weight: 700;">Selected Academic Block</span>
          <h4 style="margin: 4px 0 2px 0; font-size: 13px; font-weight: 700; color: #0F172A;">${selectedBlock.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #64748B;">${selectedBlock.description}</p>
        </div>
      `);
    }

    // 2. Saved Vehicle Marker (if active)
    if (savedParking && savedParking.isActive && savedParking.coordinates) {
      const vehicleIcon = L.divIcon({
        className: 'user-vehicle-pin',
        html: `
          <div style="background: #0284C7; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.4); border: 2px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/></svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const vehicleMarker = L.marker(savedParking.coordinates, { icon: vehicleIcon }).addTo(markersGroup);
      vehicleMarker.bindPopup(`
        <div style="padding: 12px; font-family: sans-serif;">
          <span style="font-size: 10px; font-weight: 700; color: #0284C7; text-transform: uppercase;">Your Parked Vehicle</span>
          <h4 style="margin: 4px 0 2px 0; font-size: 13px; font-weight: 700; color: #0F172A;">${savedParking.regNumber} (${savedParking.vehicleType})</h4>
          <p style="margin: 0; font-size: 11px; color: #334155;"><strong>${savedParking.lotName}</strong></p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748B;">Section ${savedParking.section} • Slot ${savedParking.slot}</p>
        </div>
      `);
    }

    // 3. Parking Lots Markers
    const filteredLots = filterStatus === 'all' 
      ? lots 
      : lots.filter(l => l.status === filterStatus);

    filteredLots.forEach((lot) => {
      let bgGrad = 'linear-gradient(135deg, #10B981, #059669)';
      let strokeColor = '#059669';
      let statusTextColor = '#059669';

      if (lot.status === 'Limited') {
        bgGrad = 'linear-gradient(135deg, #F59E0B, #D97706)';
        strokeColor = '#D97706';
        statusTextColor = '#D97706';
      } else if (lot.status === 'Full') {
        bgGrad = 'linear-gradient(135deg, #EF4444, #DC2626)';
        strokeColor = '#DC2626';
        statusTextColor = '#DC2626';
      }

      const isSelected = selectedLotId === lot.id;

      const markerHtml = `
        <div style="transform: translate(-50%, -100%); cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          <div style="background: ${bgGrad}; color: white; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: ${isSelected ? '2.5px solid #0284C7' : '1.5px solid white'}; min-width: 42px; justify-content: center;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/></svg>
            <span>${lot.availableSpaces}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${strokeColor};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'parking-lot-marker',
        html: markerHtml,
        iconSize: [48, 48],
        iconAnchor: [24, 48],
      });

      const lotMarker = L.marker(lot.coordinates, { icon: customIcon }).addTo(markersGroup);

      const distanceInfo = lot.distanceFromBlocks?.[selectedBlock.id] || { distanceMeters: 250, walkTimeMins: 3 };

      const popupContent = document.createElement('div');
      popupContent.style.padding = '14px';
      popupContent.style.fontFamily = 'Inter, system-ui, sans-serif';
      popupContent.style.minWidth = '240px';
      popupContent.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748B;">Two-Wheeler Lot</span>
          <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background: ${lot.status === 'Available' ? '#ECFDF5' : lot.status === 'Limited' ? '#FFFBEB' : '#FEF2F2'}; color: ${statusTextColor};">
            ${lot.status}
          </span>
        </div>
        <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0F172A;">${lot.name}</h4>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569;">
          📍 <strong>${distanceInfo.distanceMeters}m</strong> from ${selectedBlock.code} (~${distanceInfo.walkTimeMins} min walk)
        </p>

        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span style="color: #64748B;">Available Spaces:</span>
            <strong style="color: ${lot.status === 'Available' ? '#059669' : lot.status === 'Limited' ? '#D97706' : '#DC2626'}; font-size: 12px;">${lot.availableSpaces} / ${lot.totalCapacity}</strong>
          </div>
          <div style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 9999px; overflow: hidden;">
            <div style="width: ${(lot.occupiedSpaces / lot.totalCapacity) * 100}%; height: 100%; background: ${lot.status === 'Available' ? '#10B981' : lot.status === 'Limited' ? '#F59E0B' : '#EF4444'};"></div>
          </div>
        </div>

        <div style="display: flex; gap: 6px;">
          <button id="btn-select-${lot.id}" style="flex: 1; padding: 6px 10px; background: #0284C7; color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
            Select Lot
          </button>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${lot.coordinates[0]},${lot.coordinates[1]}" target="_blank" rel="noopener noreferrer" style="padding: 6px 8px; background: #F1F5F9; color: #334155; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none; display: flex; align-items: center; justify-content: center;">
            Maps ↗
          </a>
        </div>
      `;

      lotMarker.bindPopup(popupContent);

      lotMarker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${lot.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectLot) onSelectLot(lot);
            map.closePopup();
          };
        }
      });

      lotMarker.on('click', () => {
        if (onSelectLot) onSelectLot(lot);
      });
    });

    // If a specific lot is selected, draw a demo line between the academic block and the lot
    if (selectedLotId && selectedBlock) {
      const targetLot = lots.find(l => l.id === selectedLotId);
      if (targetLot) {
        const pathCoords: [number, number][] = [
          selectedBlock.coordinates,
          targetLot.coordinates,
        ];

        routeLayerRef.current = L.polyline(pathCoords, {
          color: '#0284C7',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8',
        }).addTo(map);

        map.panTo(targetLot.coordinates, { animate: true });
      }
    }
  }, [lots, selectedBlock, savedParking, selectedLotId, filterStatus]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([31.2536, 75.7037], 16, { animate: true });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-card bg-white">
      {/* Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Status Filter Tabs */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200 pointer-events-auto flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Lots ({lots.length})
          </button>
          <button
            onClick={() => setFilterStatus('Available')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              filterStatus === 'Available'
                ? 'bg-emerald-600 text-white'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Available
          </button>
          <button
            onClick={() => setFilterStatus('Limited')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              filterStatus === 'Limited'
                ? 'bg-amber-500 text-white'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Limited
          </button>
          <button
            onClick={() => setFilterStatus('Full')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
              filterStatus === 'Full'
                ? 'bg-red-600 text-white'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            Full
          </button>
        </div>

        {/* Map Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleRecenter}
            className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Recenter campus view"
          >
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Center Campus</span>
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative" />

      {/* Bottom Disclaimer Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md text-slate-300 text-[11px] px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Demonstration Campus Map:</strong> Markers illustrate university two-wheeler parking proximity and availability.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Green = Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Orange = Limited
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Red = Full
          </span>
        </div>
      </div>
    </div>
  );
};
