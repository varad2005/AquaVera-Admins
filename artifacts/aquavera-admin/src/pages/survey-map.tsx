import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, WMSTileLayer, LayersControl, useMap, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/context/language-context";
import { 
  Map as MapIcon, 
  Search, 
  MapPin, 
  MousePointer2, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Layers,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRequests } from "@/hooks/use-mock-api";
import { StatusBadge } from "@/components/ui-custom/status-badge";
import { formatCurrency, cn } from "@/lib/utils";
import { Link } from "wouter";
import { WaterRequest, RequestStatus } from "@/data/mock-data";
import L from "leaflet";

// Fix Leaflet Marker icon issue in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- BHUVAN CONFIGURATION ---
const BHUVAN_WMS_BASE = "https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms";
const BHUVAN_API_KEY = import.meta.env.VITE_BHUVAN_API_KEY || "";
const BHUVAN_REVERSE_API_KEY = import.meta.env.VITE_BHUVAN_REVERSE_API_KEY || "";

// Custom Pin Factory for Water Requests
function createRequestPin(status: RequestStatus) {
  let bgColor = "#10b981"; // emerald
  let shadowColor = "rgba(16, 185, 129, 0.4)";
  let pulseRing = "";
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`;

  if (status === "Flagged") {
    bgColor = "#ef4444"; // red
    shadowColor = "rgba(239, 68, 68, 0.5)";
    pulseRing = `<div style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid #ef4444; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`;
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  } else if (status === "Pending") {
    bgColor = "#f59e0b"; // amber
    shadowColor = "rgba(245, 158, 11, 0.4)";
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  } else if (status === "Rejected") {
    bgColor = "#64748b"; // slate
    shadowColor = "rgba(100, 116, 139, 0.3)";
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  }

  return L.divIcon({
    className: "custom-map-pin-container",
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${pulseRing}
        <div style="
          width: 30px; 
          height: 30px; 
          background-color: ${bgColor}; 
          border-radius: 9999px; 
          border: 2.5px solid white; 
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 4px 14px ${shadowColor};
        ">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

// Component to handle map view updates
function ZoomToResult({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 14, { animate: true, duration: 2 });
  }
  return null;
}

// Component to handle map click events (Reverse Geocoding)
function MapEventsHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function SurveyMap() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCoords, setSearchCoords] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [resultName, setResultName] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | RequestStatus>("ALL");
  
  // Reverse Geocoding States
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(null);
  const [clickedPlaceName, setClickedPlaceName] = useState("");
  const [isReverseloading, setIsReverseLoading] = useState(false);

  // Fetch real requests from API
  const { data: requests, isLoading: isLoadingRequests } = useRequests(1, 100);

  // Maharashtra Center
  const center: [number, number] = [19.7515, 75.7139];
  const zoom = 7;

  // Filter valid requests with numeric coordinates
  const requestsWithCoords = useMemo(() => {
    return (requests || []).filter(
      (r: WaterRequest) =>
        typeof r.latitude === "number" &&
        typeof r.longitude === "number" &&
        !isNaN(r.latitude) &&
        !isNaN(r.longitude) &&
        r.latitude !== 0 &&
        r.longitude !== 0
    );
  }, [requests]);

  // Counts for filters
  const pendingCount = requestsWithCoords.filter((r: WaterRequest) => r.status === "Pending").length;
  const approvedCount = requestsWithCoords.filter((r: WaterRequest) => r.status === "Approved").length;
  const flaggedCount = requestsWithCoords.filter((r: WaterRequest) => r.status === "Flagged").length;

  // Final filtered list displayed on map
  const displayRequests = useMemo(() => {
    if (statusFilter === "ALL") return requestsWithCoords;
    return requestsWithCoords.filter((r: WaterRequest) => r.status === statusFilter);
  }, [requestsWithCoords, statusFilter]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    
    // Check if input is Latitude, Longitude (e.g., "19.0760, 72.8777")
    const coordMatch = searchQuery.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/) || searchQuery.match(/^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/);
    
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      setSearchCoords([lat, lon]);
      setResultName(`GPS: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
      setIsSearching(false);
      handleMapClick(lat, lon);
      return;
    }

    try {
      const response = await fetch(`https://bhuvan.nrsc.gov.in/api/geonames/geonames_search.php?token=${BHUVAN_API_KEY}&searchtext=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        const firstResult = data[0];
        setSearchCoords([parseFloat(firstResult.lat), parseFloat(firstResult.lon)]);
        setResultName(firstResult.pname || firstResult.name || searchQuery);
        setClickedCoords(null);
      } else if (data && data.results && data.results.length > 0) {
        const firstResult = data.results[0];
        setSearchCoords([parseFloat(firstResult.lat), parseFloat(firstResult.lon)]);
        setResultName(firstResult.pname || firstResult.name || searchQuery);
        setClickedCoords(null);
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setClickedCoords([lat, lon]);
    setClickedPlaceName("Identifying...");
    setIsReverseLoading(true);
    try {
      if (!BHUVAN_REVERSE_API_KEY) {
        throw new Error("Missing Bhuvan API Key");
      }
      const response = await fetch(`https://bhuvan.nrsc.gov.in/api/geonames/reverse_geonames_search.php?token=${BHUVAN_REVERSE_API_KEY}&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        setClickedPlaceName(data[0].pname || data[0].name || "Unnamed Area");
      } else if (data && data.results && data.results.length > 0) {
        setClickedPlaceName(data.results[0].pname || data.results[0].name || "Unnamed Area");
      } else {
        setClickedPlaceName("No information found");
      }
    } catch (error) {
      try {
        const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const osmData = await osmResponse.json();
        
        if (osmData && osmData.display_name) {
          const parts = osmData.display_name.split(',').slice(0, 3).join(',');
          setClickedPlaceName(parts || "Unnamed Area");
        } else {
          setClickedPlaceName("No information found");
        }
      } catch (fallbackError) {
        setClickedPlaceName("Identification Failed");
      }
    } finally {
      setIsReverseLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header with Search and Pin Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <MapIcon className="w-8 h-8 text-emerald-600" />
                {t("sidebar.survey_map") || "Survey Map"}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                {requestsWithCoords.length} Geo-Verified Parcels
              </span>
            </div>
            <p className="text-slate-500 font-medium mt-1 text-sm">
              ISRO Bhuvan satellite telemetry synchronized with real-time irrigation requests.
            </p>
          </div>

          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-[420px]">
            <Input 
              placeholder="Search Village, District, or GPS coords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="border-none bg-transparent focus-visible:ring-0 text-xs font-bold"
            />
            <Button 
              size="sm" 
              onClick={handleSearch}
              disabled={isSearching}
              className="rounded-xl bg-slate-900 font-black text-[10px] tracking-widest h-9 px-4 shrink-0 hover:bg-emerald-600 transition-colors"
            >
              <Search className="w-3.5 h-3.5 mr-1" /> {isSearching ? "SCANNING..." : "SEARCH"}
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Pins:</span>
            
            <button
              onClick={() => setStatusFilter("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all",
                statusFilter === "ALL" 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              All ({requestsWithCoords.length})
            </button>
            <button
              onClick={() => setStatusFilter("Pending")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5",
                statusFilter === "Pending" 
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20" 
                  : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("Approved")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5",
                statusFilter === "Approved" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter("Flagged")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5",
                statusFilter === "Flagged" 
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20" 
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
              Flagged ({flaggedCount})
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium px-2">
            Showing <strong className="text-slate-700">{displayRequests.length}</strong> plotted requests
          </p>
        </div>

        {/* Map Container */}
        <div className="relative h-[650px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
          <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <ZoomToResult coords={searchCoords} />
            <MapEventsHandler onMapClick={handleMapClick} />
            
            <LayersControl position="topright">
              {/* Base Layer: OpenStreetMap */}
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>

              {/* Base Layer: Google Satellite */}
              <LayersControl.BaseLayer name="Satellite Imagery">
                <TileLayer
                  attribution='&copy; Google Maps'
                  url="http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}"
                />
              </LayersControl.BaseLayer>

              {/* Bhuvan Specific Layers */}
              <LayersControl.Overlay name="Bhuvan - Maharashtra State Boundary">
                <WMSTileLayer
                  url={BHUVAN_WMS_BASE}
                  params={{
                    layers: "state_boundary",
                    format: "image/png",
                    transparent: true,
                    version: "1.1.1",
                    token: BHUVAN_API_KEY
                  } as any}
                  attribution='&copy; ISRO Bhuvan'
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Bhuvan - Land Use Land Cover">
                <WMSTileLayer
                  url={BHUVAN_WMS_BASE}
                  params={{
                    layers: "lulc:lulc_50k_1516",
                    format: "image/png",
                    transparent: true,
                    version: "1.1.1",
                    token: BHUVAN_API_KEY
                  } as any}
                  attribution='&copy; ISRO Bhuvan'
                />
              </LayersControl.Overlay>

              <LayersControl.Overlay name="Bhuvan - Water Bodies">
                <WMSTileLayer
                  url={BHUVAN_WMS_BASE}
                  params={{
                    layers: "water_bodies",
                    format: "image/png",
                    transparent: true,
                    version: "1.1.1",
                    token: BHUVAN_API_KEY
                  } as any}
                  attribution='&copy; ISRO Bhuvan'
                />
              </LayersControl.Overlay>
            </LayersControl>

            {/* PLOTTED WATER REQUEST PINS FROM DATABASE */}
            {displayRequests.map((req: WaterRequest) => (
              <Marker
                key={req.id}
                position={[req.latitude!, req.longitude!]}
                icon={createRequestPin(req.status)}
              >
                <Popup className="custom-request-popup">
                  <div className="p-2 space-y-3 min-w-[240px] max-w-[280px]">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Request</span>
                        <p className="font-mono font-black text-sm text-slate-900">{req.id}</p>
                      </div>
                      <StatusBadge status={req.status} className="text-[9px] px-2 py-0.5 rounded-full" />
                    </div>

                    {/* Farmer & Location Info */}
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-snug">{req.farmerName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        {req.village}, {req.district}
                      </p>
                    </div>

                    {/* Telemetry & Agronomy Details */}
                    <div className="bg-slate-50 p-2.5 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Crop:</span>
                        <span className="font-bold text-slate-700">{req.cropType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">7/12 Land ID:</span>
                        <span className="font-mono font-bold text-slate-700 bg-white px-1.5 rounded border border-slate-200">
                          {req.landId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Calculated Tariff:</span>
                        <span className="font-black text-emerald-600">{formatCurrency(req.calculatedBilling)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 font-medium">NDVI Index:</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded border border-indigo-100">
                          {req.ndviIndex}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">AI Score:</span>
                        <span className={cn(
                          "font-bold px-1.5 rounded",
                          req.confidenceScore >= 70 ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                        )}>
                          {req.confidenceScore}%
                        </span>
                      </div>
                    </div>

                    {/* Action: Open Deep Inspection */}
                    <Link href={`/requests/${req.id}`}>
                      <button className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm">
                        Inspect Request <ExternalLink className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Search Marker */}
            {searchCoords && (
              <Marker position={searchCoords}>
                <Popup>
                  <div className="p-1">
                    <p className="font-bold text-slate-900">{resultName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {searchCoords[0].toFixed(5)}, {searchCoords[1].toFixed(5)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Click Results Marker */}
            {clickedCoords && (
              <Marker position={clickedCoords}>
                <Popup>
                  <div className="p-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-2">
                       <MapPin className="w-3 h-3 text-red-500" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Point</p>
                    </div>
                    <p className="font-bold text-slate-900 leading-tight mb-2">
                       {clickedPlaceName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono bg-slate-50 p-1 rounded">
                      {clickedCoords[0].toFixed(5)}, {clickedCoords[1].toFixed(5)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Controls Overlay */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl border border-slate-100 max-w-[260px]">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Map Interactions</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Click any status pin to view farmer particulars, 7/12 land records, and telemetry audits. Click empty terrain to reverse geocode place names.
              </p>
            </div>
          </MapContainer>
        </div>

        {/* Legend/Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MapInsight 
            title="Total Plotted Parcels" 
            desc="Requests with verified GPS telemetry coordinates."
            value={`${requestsWithCoords.length} PLOTTED`}
            color="emerald"
          />
          <MapInsight 
            title="Satellite NDVI" 
            desc="Live vegetation index tracking for active crop cycles."
            value="ACTIVE"
            color="emerald"
          />
          <MapInsight 
            title="Cadastral Sync" 
            desc="7/12 land polygon alignment status."
            value="CONNECTED"
            color="blue"
          />
          <MapInsight 
            title="Reverse Geocode" 
            desc="Real-time coordinate-to-place name resolution."
            value={isReverseloading ? "IDENTIFYING..." : "READY"}
            color="amber"
          />
        </div>
      </div>
    </AppLayout>
  );
}

function MapInsight({ title, desc, value, color }: { title: string, desc: string, value: string, color: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100"
  };

  return (
    <Card className="rounded-2xl border-slate-100 shadow-sm">
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
          <p className="text-[11px] text-slate-600 font-medium leading-tight">{desc}</p>
        </div>
        <div className={cn("mt-4 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest w-fit", colors[color])}>
           {value}
        </div>
      </CardContent>
    </Card>
  );
}
