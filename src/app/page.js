"use client";

import { useState, useEffect, useMemo } from "react";

// --- DATA: List of Major Cities/Timezones ---
const TIME_ZONES = [
  { city: "New York", country: "USA", zone: "America/New_York", region: "Americas" },
  { city: "London", country: "UK", zone: "Europe/London", region: "Europe" },
  { city: "Paris", country: "France", zone: "Europe/Paris", region: "Europe" },
  { city: "Tokyo", country: "Japan", zone: "Asia/Tokyo", region: "Asia" },
  { city: "New Delhi", country: "India", zone: "Asia/Kolkata", region: "Asia" },
  { city: "Sydney", country: "Australia", zone: "Australia/Sydney", region: "Oceania" },
  { city: "Dubai", country: "UAE", zone: "Asia/Dubai", region: "Asia" },
  { city: "Los Angeles", country: "USA", zone: "America/Los_Angeles", region: "Americas" },
  { city: "Moscow", country: "Russia", zone: "Europe/Moscow", region: "Europe" },
  { city: "Singapore", country: "Singapore", zone: "Asia/Singapore", region: "Asia" },
  { city: "Shanghai", country: "China", zone: "Asia/Shanghai", region: "Asia" },
  { city: "São Paulo", country: "Brazil", zone: "America/Sao_Paulo", region: "Americas" },
  { city: "Istanbul", country: "Turkey", zone: "Europe/Istanbul", region: "Europe" },
  { city: "Seoul", country: "South Korea", zone: "Asia/Seoul", region: "Asia" },
  { city: "Bangkok", country: "Thailand", zone: "Asia/Bangkok", region: "Asia" },
  { city: "Berlin", country: "Germany", zone: "Europe/Berlin", region: "Europe" },
];

export default function Home() {
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Update time every second
  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter logic
  const filteredZones = useMemo(() => {
    return TIME_ZONES.filter((item) => {
      const query = search.toLowerCase();
      return (
        item.city.toLowerCase().includes(query) ||
        item.country.toLowerCase().includes(query) ||
        item.region.toLowerCase().includes(query)
      );
    });
  }, [search]);

  if (!isMounted) return null; // Prevent hydration mismatch

  return (
    <main className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            World Clock
          </h1>
          <p className="text-gray-400 text-lg">Current time across the globe</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
            <input
              type="text"
              placeholder="Search country or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="relative w-full bg-black/50 backdrop-blur-md border border-glassBorder text-white px-6 py-4 rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
            />
            <svg className="w-6 h-6 text-gray-400 absolute right-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredZones.map((zoneData) => (
            <ClockCard key={zoneData.city} data={zoneData} baseTime={now} />
          ))}
        </div>
        
        {filteredZones.length === 0 && (
          <div className="text-center text-gray-500 mt-12 text-xl">
            No locations found matching "{search}"
          </div>
        )}
      </div>
    </main>
  );
}

// --- COMPONENT: Individual Clock Card ---
function ClockCard({ data, baseTime }) {
  // 1. Get the time string for the specific timezone
  const timeString = baseTime.toLocaleTimeString("en-US", {
    timeZone: data.zone,
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  
  // 2. Parse it back to numbers to drive the analog hands
  const [h, m, s] = timeString.split(":").map(Number);
  
  // 3. Calculate degrees
  const degS = s * 6;
  const degM = m * 6 + s * 0.1;
  const degH = (h % 12) * 30 + m * 0.5;

  // 4. Format for Digital Display
  const digitalTime = baseTime.toLocaleTimeString("en-US", {
    timeZone: data.zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  
  const dayName = baseTime.toLocaleDateString("en-US", {
    timeZone: data.zone,
    weekday: "long",
  });

  return (
    <div className="group relative bg-glass border border-glassBorder rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon flex flex-col items-center">
      
      {/* Top Labels */}
      <div className="w-full flex justify-between items-start mb-4 border-b border-white/5 pb-2">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-white tracking-wide">{data.city}</h2>
          <p className="text-sm text-blue-400 font-medium">{data.country}</p>
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-widest">{data.region}</span>
      </div>

      {/* Analog Clock Face (Pure CSS - No Canvas) */}
      <div className="relative w-48 h-48 rounded-full border-4 border-white/10 shadow-inner bg-black/20 backdrop-blur-sm flex justify-center items-center mb-6">
        {/* Clock Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-full flex justify-center"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className="w-1 h-2 bg-gray-600"></div>
          </div>
        ))}

        {/* Center Dot */}
        <div className="absolute w-3 h-3 bg-blue-500 rounded-full z-20 shadow-[0_0_10px_#3b82f6]"></div>

        {/* Hour Hand */}
        <div
          className="hand absolute w-1.5 h-14 bg-white rounded-full z-10 origin-bottom bottom-1/2"
          style={{ transform: `rotate(${degH}deg)` }}
        ></div>

        {/* Minute Hand */}
        <div
          className="hand absolute w-1 h-20 bg-gray-300 rounded-full z-10 origin-bottom bottom-1/2"
          style={{ transform: `rotate(${degM}deg)` }}
        ></div>

        {/* Second Hand */}
        <div
          className="hand absolute w-0.5 h-20 bg-blue-500 rounded-full z-10 origin-bottom bottom-1/2"
          style={{ transform: `rotate(${degS}deg)` }}
        ></div>
      </div>

      {/* Digital Time Display */}
      <div className="text-center">
        <p className="text-3xl font-mono font-bold text-white tabular-nums tracking-wider">
          {digitalTime}
        </p>
        <p className="text-sm text-gray-400 mt-1">{dayName}</p>
      </div>
    </div>
  );
}