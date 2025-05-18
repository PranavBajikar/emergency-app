import { useEffect, useState } from "react";
import { PhoneCall, MapPin, Loader2 } from "lucide-react";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          setLoading(false);
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

  const services = [
    { name: "Police", number: "911", color: "bg-blue-600" },
    { name: "Fire", number: "911", color: "bg-red-600" },
    { name: "Medical", number: "911", color: "bg-green-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Emergency Services</h1>

      <div className="mb-6 flex items-center gap-2 text-lg text-gray-700">
        {loading ? (
          <Loader2 className="animate-spin text-blue-500" />
        ) : location ? (
          <>
            <MapPin className="text-red-500" />
            <span>Latitude: {location.lat}, Longitude: {location.lon}</span>
          </>
        ) : (
          <span className="text-red-500">{error}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        {services.map((service) => (
          <div
            key={service.name}
            className={`${service.color} text-white p-5 rounded-lg shadow-lg flex flex-col items-center`}
          >
            <h2 className="text-2xl font-semibold">{service.name}</h2>
            <button
              className="mt-3 bg-white text-black font-medium hover:bg-gray-200 transition flex items-center px-4 py-2 rounded"
              onClick={() => window.location.href = `tel:${service.number}`}
            >
              <PhoneCall className="mr-2" /> Call {service.number}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
