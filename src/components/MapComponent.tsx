import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CivicReport, IssueCategory, PriorityLevel } from '../types';
import { ThumbsUp, Filter, Eye, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../translations';

interface MapComponentProps {
  reports: CivicReport[];
  onSelectReport: (report: CivicReport) => void;
  onSupportReport: (id: string) => void;
  lang: Language;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  reports,
  onSelectReport,
  onSupportReport,
  lang,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const t = translations[lang];

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Filtered reports list
  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'all' && r.issueType !== selectedCategory) return false;
    if (selectedPriority !== 'all' && r.priorityLevel !== selectedPriority) return false;
    return true;
  });

  // Helper to color marker by priority
  const getMarkerColor = (level: PriorityLevel): string => {
    switch (level) {
      case 'CRITICAL':
        return '#e11d48'; // rose red
      case 'HIGH':
        return '#f97316'; // orange
      case 'MEDIUM':
        return '#f59e0b'; // amber
      default:
        return '#0d9488'; // teal
    }
  };

  // Initialize map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default centered on Lucknow / UP region
      const map = L.map(mapContainerRef.current, {
        center: [26.8467, 80.9462],
        zoom: 12,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive or clean up
    };
  }, []);

  // Update map markers when filteredReports change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    filteredReports.forEach((report) => {
      const color = getMarkerColor(report.priorityLevel);

      // Custom Circular Pulsing Pin SVG
      const customIcon = L.divIcon({
        className: 'custom-civic-marker',
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              position: absolute;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background-color: ${color};
              opacity: 0.35;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></span>
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background-color: ${color};
              border: 2px solid white;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 11px;
            ">
              !
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([report.latitude, report.longitude], { icon: customIcon });

      // Interactive Popup Card
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 max-w-xs text-xs';
      popupContent.innerHTML = `
        <div style="font-family: inherit;">
          <img src="${report.imageUrl}" style="width:100%; height:110px; object-fit:cover; border-radius:12px; margin-bottom:8px;" />
          <div style="display:flex; justify-between; align-items:center; margin-bottom:4px;">
            <span style="font-weight:bold; font-size:13px; color:#0f172a;">${report.issueTitle}</span>
          </div>
          <p style="color:#64748b; margin-bottom:6px;">📍 ${report.villageOrArea}, ${report.district}</p>
          <div style="display:flex; gap:6px; align-items:center; margin-bottom:8px;">
            <span style="background:${color}; color:white; font-weight:bold; padding:2px 8px; border-radius:12px;">
              ${report.priorityLevel} (${report.priorityScore}/100)
            </span>
            <span style="background:#f1f5f9; color:#334155; font-weight:600; padding:2px 8px; border-radius:12px;">
              ${report.status}
            </span>
          </div>
          <p style="color:#475569; font-size:11px; margin-bottom:10px;">
            👍 ${report.supportCount} people affected
          </p>
          <button id="btn-view-${report.id}" style="
            width:100%;
            background: var(--brand-primary, #0a3c40);
            color: var(--brand-primary-fg, #ffffff);
            font-weight:bold;
            padding:7px;
            border-radius:10px;
            border:none;
            cursor:pointer;
          ">
            View Issue Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-view-${report.id}`);
        if (btn) {
          btn.onclick = () => onSelectReport(report);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredReports, onSelectReport]);

  return (
    <div className="space-y-4">
      {/* Map Control Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--brand-card)] p-4 rounded-2xl border border-[var(--brand-border)] shadow-sm">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[var(--brand-primary)]" />
          <span className="font-bold text-xs text-[var(--brand-text-main)] uppercase tracking-wider">
            Map Filters:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-semibold"
          >
            <option value="all">All Categories</option>
            <option value="pothole">{t.cat_pothole}</option>
            <option value="garbage">{t.cat_garbage}</option>
            <option value="broken_streetlight">{t.cat_broken_streetlight}</option>
            <option value="open_drain">{t.cat_open_drain}</option>
            <option value="water_leakage">{t.cat_water_leakage}</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="p-2 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] text-[var(--brand-text-main)] font-semibold"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Priority</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
            <option value="LOW">🟢 Low Priority</option>
          </select>

          <span className="text-[var(--brand-text-muted)] font-medium ml-2">
            Showing {filteredReports.length} map pins
          </span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border border-[var(--brand-border)] shadow-lg z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};
