import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin, PhoneCall, Loader2 } from "lucide-react";
import axios from "axios";

const DynamicMap = dynamic(() => import("../components/MapClient"), {
  ssr: false,
});

export default function Home() {
  const [location, setLocation] = useState(null);
  const [country, setCountry] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const emergencyDirectory = {
    US: [
      { name: "Police", number: "911", color: "bg-blue-600" },
      { name: "Fire", number: "911", color: "bg-red-600" },
      { name: "Medical", number: "911", color: "bg-green-600" },
    ],
    IN: [
      { name: "Police", number: "100", color: "bg-blue-600" },
      { name: "Fire", number: "101", color: "bg-red-600" },
      { name: "Ambulance", number: "102", color: "bg-green-600" },
    ],
    EU: [{ name: "All Services", number: "112", color: "bg-purple-600" }],
  };

  const getEmergencyServices = () => {
    if (!country) return emergencyDirectory["US"];
    return emergencyDirectory[country] || emergencyDirectory["EU"];
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          setLocation(coords);
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.lat}&lon=${coords.lon}`
            );
            const code = res.data.address.country_code?.toUpperCase();
            setCountry(code);
          } catch {
            setError("Could not detect country.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white font-mono">
      <h1 className="text-4xl font-bold mb-6 text-cyan-400 neon-text">
        🚨 Cyberpunk Emergency Services
      </h1>

      <div className="mb-6 flex items-center gap-2 text-lg">
        {loading ? (
          <Loader2 className="animate-spin text-cyan-400" />
        ) : location ? (
          <>
            <MapPin className="text-red-400" />
            <span>
              {location.lat.toFixed(4)}, {location.lon.toFixed(4)} •{" "}
              {country || "Unknown"}
            </span>
          </>
        ) : (
          <span className="text-red-500">{error}</span>
        )}
      </div>

      {location && <DynamicMap lat={location.lat} lon={location.lon} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mt-8">
        {getEmergencyServices().map((service) => (
          <div
            key={service.name}
            className={`${service.color} p-5 rounded-lg shadow-xl border border-white bg-opacity-10 backdrop-blur-md`}
          >
            <h2 className="text-2xl font-semibold text-white">{service.name}</h2>
            <button
              className="mt-3 bg-black text-white border border-cyan-400 hover:bg-cyan-700 transition px-4 py-2 rounded flex items-center"
              onClick={() => (window.location.href = `tel:${service.number}`)}
            >
              <PhoneCall className="mr-2" /> Call {service.number}
            </button>
          </div>
        ))}
      </div>

      <footer className="mt-10 text-sm text-gray-400">
        Built with 💀 & ⚡ by Pranav • Stay Safe. Stay Smart.
      </footer>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 8px cyan, 0 0 16px cyan;
        }
        .shadow-neon {
          box-shadow: 0 0 20px cyan;
        }
      `}</style>
    </div>
  );
}
