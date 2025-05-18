import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Map({ lat, lon }) {
  useEffect(() => {
    // Dynamically load Leaflet CSS on client only
    import("leaflet/dist/leaflet.css");

    // Fix Leaflet default icon paths
    // This must run on client only (window is defined here)
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md border border-gray-600">
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>You are here.</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
