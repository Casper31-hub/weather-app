import { useState, useEffect, useRef } from "react";
import {
  Search,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Thermometer,
  CloudLightning,
  CloudRain,
  Sun,
  Cloud,
  Clock,
  Compass,
  Info,
  Moon
} from "lucide-react";

interface LocationData {
  location_id?: string;
  location_name?: string;
}

interface ForecastRecord {
  location?: LocationData;
  date?: string;
  morning_forecast?: string;
  afternoon_forecast?: string;
  night_forecast?: string;
  summary_forecast?: string;
  summary_when?: string;
  min_temp?: number;
  max_temp?: number;
}

// Module-level in-memory cache surviving component mount/unmount
let memoryCacheData: ForecastRecord[] | null = null;
let memoryCacheTimestamp: number | null = null;

export default function WeatherForecastWidget() {
  const [records, setRecords] = useState<ForecastRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load weather on mount
  useEffect(() => {
    loadWeatherData(false);

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadWeatherData = async (force: boolean) => {
    setLoading(true);
    setError(null);
    setWarningMessage(null);

    try {
      const now = Date.now();
      let fetched: ForecastRecord[] = [];

      // Check in-memory cache
      if (!force && memoryCacheData && memoryCacheTimestamp && now - memoryCacheTimestamp < 5 * 60 * 1000) {
        fetched = memoryCacheData;
      } else {
        const response = await fetch("/api/weather/forecast");
        if (!response.ok) {
          throw new Error(`Server responded with standing ${response.status}`);
        }
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid forecast scroll structure received from high kingdom.");
        }
        
        if (data.length === 0) {
          throw new Error("The celestial chronicle of forecasts is currently empty.");
        }

        // Save to in-memory cache
        memoryCacheData = data;
        memoryCacheTimestamp = now;
        fetched = data;
      }

      setRecords(fetched);

      // Set default selected location if not already selected
      if (fetched.length > 0) {
        // Find if Kuala Lumpur exists, otherwise pick first available
        const defaultLoc = fetched.find((r) => r.location?.location_name?.toLowerCase() === "kuala lumpur")
          || fetched[0];
        
        if (defaultLoc?.location?.location_name && !selectedLocation) {
          setSelectedLocation(defaultLoc.location.location_name);
        }
      }

    } catch (err: any) {
      console.error("Failed to fetch weather forecast:", err);
      
      // If we have previous cached data in memory, use it as fallback
      if (memoryCacheData && memoryCacheData.length > 0) {
        setRecords(memoryCacheData);
        setWarningMessage("Celestial mists prevented fresh scrying. Displaying previously recorded omens.");
        if (!selectedLocation && memoryCacheData[0]?.location?.location_name) {
          setSelectedLocation(memoryCacheData[0].location.location_name);
        }
      } else {
        setError(err?.message || "Failed to establish scrying link to the sky kingdom.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadWeatherData(true);
  };

  // Get all unique locations that actually exist in the dataset
  const uniqueLocations = Array.from(
    new Set(
      records
        .map((r) => r.location?.location_name)
        .filter((name): name is string => typeof name === "string" && name.trim() !== "")
    )
  ).sort() as string[];

  // Filter locations list by search query
  const filteredLocations = uniqueLocations.filter((loc: string) =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get forecast records for selected location, sorted by date (if date exists)
  const locationForecasts = records
    .filter((r) => r.location?.location_name === selectedLocation)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return a.date.localeCompare(b.date);
    });

  // Primary (earliest or current) forecast
  const currentForecast = locationForecasts[0];
  // Subsequent forecast dates
  const futureForecasts = locationForecasts.slice(1);

  // Helper to determine weather icon based on forecast string
  const getWeatherIcon = (forecast: string | undefined) => {
    if (!forecast) return <Cloud className="w-6 h-6 text-slate-400" />;
    const f = forecast.toLowerCase();
    if (f.includes("ribut petir") || f.includes("lightning") || f.includes("thunderstorm")) {
      return <CloudLightning className="w-8 h-8 text-amber-500 animate-bounce" />;
    }
    if (f.includes("hujan") || f.includes("rain") || f.includes("basah")) {
      return <CloudRain className="w-8 h-8 text-sky-400 animate-pulse" />;
    }
    if (f.includes("tiada hujan") || f.includes("cerah") || f.includes("clear") || f.includes("sunny")) {
      return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />;
    }
    return <Cloud className="w-8 h-8 text-stone-300" />;
  };

  return (
    <div className="quest-card p-6 flex flex-col gap-6" id="weather-forecast-widget">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-[#CA8A04] pb-4 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-heading text-quest-primary tracking-wide flex items-center gap-2">
            <Compass className="w-5 h-5 text-quest-primary animate-spin-slow" />
            Auguries of the Skies
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-quest-muted mt-1">
            Real-time Meteorological Omen Transmissions
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          {memoryCacheTimestamp && (
            <div className="text-[10px] text-quest-muted font-mono flex items-center gap-1 bg-[#1A0F0A] border border-[#5c3b25] px-2 py-1 rounded-sm">
              <Clock className="w-3 h-3" />
              <span>Scry age: {Math.round((Date.now() - memoryCacheTimestamp) / 1000)}s</span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={loading}
            id="weather-refresh-btn"
            className="quest-btn-outline px-3 py-1.5 text-xs flex items-center gap-2 font-heading cursor-pointer"
            title="Force refresh celestial forecasts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            REFRESH
          </button>
        </div>
      </div>

      {/* Warning Message Box if showing cached data on error */}
      {warningMessage && (
        <div className="bg-amber-950/40 border border-amber-600/80 p-3 rounded-sm flex items-start gap-2.5 text-amber-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider block mb-0.5 text-[10px]">Celestial Interference</span>
            <p className="opacity-90">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-rose-950/40 border border-rose-600/80 p-6 rounded-sm text-center flex flex-col items-center gap-3">
          <AlertTriangle className="w-10 h-10 text-rose-500 animate-pulse" />
          <div>
            <h4 className="font-heading text-rose-400 uppercase tracking-wider text-sm">Scrying Scroll Fractured</h4>
            <p className="text-xs text-quest-muted max-w-md mt-1">
              {error}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="quest-btn-secondary px-5 py-2 text-xs"
          >
            Re-establish Link
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-4 text-quest-muted">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-[#5c3b25] border-t-[#CA8A04] animate-spin"></div>
            <Compass className="w-6 h-6 text-[#CA8A04] absolute top-3 left-3 animate-pulse" />
          </div>
          <div>
            <p className="font-heading text-sm text-quest-primary animate-pulse uppercase tracking-wider">Scrying local clouds...</p>
            <p className="text-[10px] font-mono mt-1">Calling GET api.data.gov.my/weather/forecast/ ...</p>
          </div>
        </div>
      )}

      {/* Real Data State */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SEARCH & LOCATION SELECTOR SECTION (LEFT) */}
          <div className="lg:col-span-4 flex flex-col gap-4" id="weather-search-section">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-quest-muted px-1">
                Search Realm Location
              </label>
              
              <div ref={dropdownRef} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search e.g. Johor Bahru, Petaling..."
                    className="quest-input pl-9 pr-4 py-2 text-sm w-full font-heading"
                    id="weather-search-input"
                  />
                  <Search className="w-4 h-4 text-quest-muted absolute left-3 top-3" />
                </div>

                {/* Autocomplete Dropdown List */}
                {isDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[#23140c] border border-[#CA8A04]/40 rounded-sm shadow-2xl divide-y divide-[#5c3b25]/20 scrollbar-thin">
                    {filteredLocations.length === 0 ? (
                      <div className="p-3 text-xs text-quest-muted italic">No matching realms found.</div>
                    ) : (
                      filteredLocations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setSelectedLocation(loc);
                            setSearchQuery("");
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-sans transition-colors cursor-pointer block ${
                            selectedLocation === loc
                              ? "bg-[#CA8A04]/20 text-quest-primary font-bold border-l-2 border-[#CA8A04]"
                              : "text-[#BFA98A] hover:bg-[#2C1A10] hover:text-[#F5E6D3]"
                          }`}
                        >
                          🏰 {loc}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick List / Shortcuts */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-wider text-quest-muted font-heading px-1">
                Prominent Fiefdoms
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {["Kuala Lumpur", "Johor Bahru", "Georgetown", "Kuantan", "Kota Kinabalu", "Kuching"]
                  .filter(name => uniqueLocations.includes(name))
                  .slice(0, 6)
                  .map((name) => (
                    <button
                      key={name}
                      onClick={() => setSelectedLocation(name)}
                      className={`py-1.5 px-2.5 text-[10px] text-left uppercase tracking-wider font-heading rounded-sm border transition-all truncate cursor-pointer ${
                        selectedLocation === name
                          ? "bg-[#CA8A04]/10 text-quest-primary border-[#CA8A04] shadow-[0_0_8px_rgba(202,138,4,0.15)]"
                          : "border-[#5c3b25]/50 bg-[#1C100A] text-quest-muted hover:border-[#CA8A04]/40 hover:text-quest-text"
                      }`}
                    >
                      🛡️ {name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Total Realm Stats */}
            <div className="mt-auto p-3.5 bg-[#1C100A] border border-[#CA8A04]/20 rounded-sm">
              <span className="text-[9px] uppercase tracking-wider text-quest-muted font-heading block mb-1">
                Aether Network Integrity
              </span>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-stone-400">Total Fiefdoms:</span>
                <span className="text-quest-primary font-bold">{uniqueLocations.length}</span>
              </div>
            </div>
          </div>

          {/* CURRENT WEATHER DETAIL (RIGHT) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {currentForecast ? (
              <div className="bg-[#2C1A10] border border-[#CA8A04] rounded-sm p-6 flex flex-col gap-6 relative shadow-lg">
                {/* Decorative gold accent ribbon on left side */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CA8A04]" />

                {/* Location Meta */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-[#5c3b25]/40 pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-quest-primary font-bold">
                      Current Selection
                    </span>
                    <h3 className="text-2xl uppercase mt-1 font-heading text-quest-text" id="weather-location-name">
                      {currentForecast.location?.location_name || "Unknown Realm"}
                    </h3>
                  </div>

                  {currentForecast.date && (
                    <div className="flex items-center gap-1.5 text-xs text-quest-muted font-heading bg-[#1A0F0A] px-2.5 py-1 rounded-sm border border-[#5c3b25]/40">
                      <Calendar className="w-3.5 h-3.5 text-[#CA8A04]" />
                      <span>{currentForecast.date}</span>
                    </div>
                  )}
                </div>

                {/* Highlights and Temperatures */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Sky Condition big display */}
                  <div className="md:col-span-7 flex items-center gap-4">
                    <div className="p-4 bg-[#1A0F0A] border border-[#CA8A04]/40 rounded-sm shadow-[inset_0_0_10px_rgba(202,138,4,0.15)] flex items-center justify-center shrink-0">
                      {getWeatherIcon(currentForecast.summary_forecast)}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-quest-muted font-heading tracking-wider">
                        Aura Condition ({currentForecast.summary_when || "Overall"})
                      </span>
                      <p className="text-xl font-heading font-bold text-quest-primary uppercase tracking-wide mt-0.5">
                        {currentForecast.summary_forecast || "Sky Mists"}
                      </p>
                    </div>
                  </div>

                  {/* Temp values (only if they exist) */}
                  <div className="md:col-span-5 flex justify-end gap-6 border-l border-dashed border-[#5c3b25]/40 pl-6 py-2">
                    {typeof currentForecast.min_temp === "number" && (
                      <div className="text-center">
                        <span className="text-[9px] uppercase text-quest-muted font-heading tracking-wider block">
                          Min Temp
                        </span>
                        <div className="flex items-center justify-center gap-1 text-sky-400 font-mono text-xl font-bold mt-1">
                          <Thermometer className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>{currentForecast.min_temp}°C</span>
                        </div>
                      </div>
                    )}

                    {typeof currentForecast.max_temp === "number" && (
                      <div className="text-center">
                        <span className="text-[9px] uppercase text-quest-muted font-heading tracking-wider block">
                          Max Temp
                        </span>
                        <div className="flex items-center justify-center gap-1 text-rose-400 font-mono text-xl font-bold mt-1">
                          <Thermometer className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{currentForecast.max_temp}°C</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Three Pillars (Morning, Afternoon, Night) Forecasts */}
                <div className="border-t border-[#5c3b25]/40 pt-4 mt-2">
                  <span className="text-[10px] uppercase tracking-widest text-quest-muted font-heading block mb-3">
                    Astrological Phase Shifts
                  </span>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {/* Morning */}
                    {currentForecast.morning_forecast && (
                      <div className="p-3 bg-[#1A0F0A] border border-[#5c3b25]/40 rounded-sm text-center flex flex-col items-center gap-1.5">
                        <span className="text-[9px] uppercase text-quest-muted font-heading font-semibold tracking-wider">
                          🌅 Morning
                        </span>
                        <div className="p-1 rounded-sm">
                          {getWeatherIcon(currentForecast.morning_forecast)}
                        </div>
                        <span className="text-[10px] font-sans text-quest-text font-medium line-clamp-1">
                          {currentForecast.morning_forecast}
                        </span>
                      </div>
                    )}

                    {/* Afternoon */}
                    {currentForecast.afternoon_forecast && (
                      <div className="p-3 bg-[#1A0F0A] border border-[#5c3b25]/40 rounded-sm text-center flex flex-col items-center gap-1.5">
                        <span className="text-[9px] uppercase text-quest-muted font-heading font-semibold tracking-wider">
                          ☀️ Afternoon
                        </span>
                        <div className="p-1 rounded-sm">
                          {getWeatherIcon(currentForecast.afternoon_forecast)}
                        </div>
                        <span className="text-[10px] font-sans text-quest-text font-medium line-clamp-1">
                          {currentForecast.afternoon_forecast}
                        </span>
                      </div>
                    )}

                    {/* Night */}
                    {currentForecast.night_forecast && (
                      <div className="p-3 bg-[#1A0F0A] border border-[#5c3b25]/40 rounded-sm text-center flex flex-col items-center gap-1.5">
                        <span className="text-[9px] uppercase text-quest-muted font-heading font-semibold tracking-wider">
                          🌌 Night
                        </span>
                        <div className="p-1 rounded-sm">
                          {getWeatherIcon(currentForecast.night_forecast)}
                        </div>
                        <span className="text-[10px] font-sans text-quest-text font-medium line-clamp-1">
                          {currentForecast.night_forecast}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-text disclaimer */}
                <div className="text-[9px] text-quest-muted italic flex items-center gap-1.5 border-t border-[#5c3b25]/20 pt-3">
                  <Info className="w-3 h-3 text-[#CA8A04]" />
                  <span>Officially authorized prognostications sourced directly from MET Malaysia scrolls.</span>
                </div>

              </div>
            ) : (
              <div className="bg-[#2C1A10] border border-[#5c3b25]/40 rounded-sm p-12 text-center text-quest-muted flex flex-col items-center justify-center gap-3">
                <Compass className="w-12 h-12 text-[#5c3b25] animate-spin-slow" />
                <h4 className="font-heading text-lg text-[#F5E6D3] uppercase tracking-wider">Selected Location Empty</h4>
                <p className="text-xs max-w-md">
                  Please choose a realm from the Search section list to gaze into its astrological weather alignments.
                </p>
              </div>
            )}

            {/* MULTI-DAY ALMANAC FORECAST LIST (IF AVAILABLE) */}
            {futureForecasts.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] uppercase tracking-widest text-quest-muted font-heading px-1">
                  Chronicle of Coming Days
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {futureForecasts.slice(0, 3).map((f, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-[#1C100A] border border-[#5c3b25]/40 hover:border-[#CA8A04]/40 rounded-sm flex flex-col gap-2 transition-all"
                    >
                      <div className="flex justify-between items-center text-[10px] font-heading text-quest-muted">
                        <span>🗓️ {f.date || "Upcoming Day"}</span>
                      </div>
                      <div className="flex items-center gap-2.5 mt-1">
                        <div className="p-1 bg-[#2C1A10] border border-[#5c3b25]/20 rounded-sm">
                          {getWeatherIcon(f.summary_forecast)}
                        </div>
                        <div className="truncate">
                          <p className="text-xs text-quest-text uppercase font-semibold truncate leading-tight">
                            {f.summary_forecast || "Sky mists"}
                          </p>
                          <p className="text-[10px] text-quest-muted font-mono mt-0.5">
                            {f.min_temp !== undefined && f.max_temp !== undefined 
                              ? `${f.min_temp}°C - ${f.max_temp}°C`
                              : "Temp uncertain"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
