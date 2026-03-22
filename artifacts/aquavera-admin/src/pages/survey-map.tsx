import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, WMSTileLayer, LayersControl, useMap, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/context/language-context";
import { Map as MapIcon, Layers, Search, MapPin, MousePointer2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  
  // Reverse Geocoding States
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(null);
  const [clickedPlaceName, setClickedPlaceName] = useState("");
  const [isReverseloading, setIsReverseLoading] = useState(false);

  // Maharashtra Center
  const center: [number, number] = [19.7515, 75.7139];
  const zoom = 7;

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
      // Automatically trigger reverse geocoding for coordinates to get the place name
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
        setClickedCoords(null); // Clear click state on new search
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
      // Bhuvan Reverse Geocoding API
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
       console.error("Reverse Geocoding failed:", error);
       setClickedPlaceName("Identification Failed");
    } finally {
      setIsReverseLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <MapIcon className="w-8 h-8 text-emerald-600" />
              {t("sidebar.survey_map") || "Survey Map"}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              GIS-Integrated Cadastral & Satellite Verification Portal (Bhuvan ISRO)
            </p>
          </div>

          <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-full md:w-[400px]">
            <Input 
              placeholder="Search Village, District or Parcel..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="border-none bg-transparent focus-visible:ring-0 text-xs font-bold"
            />
            <Button 
              size="sm" 
              onClick={handleSearch}
              disabled={isSearching}
              className="rounded-xl bg-slate-900 font-black text-[10px] tracking-widest h-9 px-4"
            >
              <Search className="w-3.5 h-3.5 mr-1" /> {isSearching ? "SCANNING..." : "SEARCH"}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[650px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
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
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur p-4 rounded-2xl shadow-2xl border border-slate-100 max-w-[240px]">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer2 className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Map Interactions</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Click anywhere on the map to trigger **Bhuvan Reverse Geocoding** and identify local place names.
              </p>
            </div>
          </MapContainer>
        </div>

        {/* Legend/Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
