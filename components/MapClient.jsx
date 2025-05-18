"use client";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapClient({ lat, lon }) {
  useEffect(() => {
    const map = L.map("map").setView([lat, lon], 13);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    ).addTo(map);

    const markerIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.marker([lat, lon], { icon: markerIcon })
      .addTo(map)
      .bindPopup("You are here")
      .openPopup();

    return () => map.remove();
  }, [lat, lon]);

  return (
    <div
      id="map"
      className="w-full h-64 rounded-2xl border border-cyan-500 shadow-neon"
    />
  );
}
