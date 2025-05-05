import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

function fetchAddressFromCoords(lat, lng, setAddress) {
  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    .then((res) => res.json())
    .then((data) => setAddress(data.display_name || "Unknown address"))
    .catch(() => setAddress("Unknown address"));
}

function fetchCoordsFromAddress(address, setPosition, setAddress, setError) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data[0]) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setAddress(data[0].display_name);
        setError("");
      } else {
        setError("Address not found");
      }
    })
    .catch(() => setError("Error fetching coordinates"));
}

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(null); // [lat, lng]
  const [address, setAddress] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [geoError, setGeoError] = useState("");

  useEffect(() => {
    if (position) {
      fetchAddressFromCoords(position[0], position[1], setAddress);
    } else {
      setAddress("");
    }
  }, [position]);

  const handleAddressSearch = (e) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    fetchCoordsFromAddress(addressInput, setPosition, setAddress, setGeoError);
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!name.trim() || !position) return;
    setLocations([
      ...locations,
      { id: Date.now(), name, description, lat: position[0], lng: position[1], address },
    ]);
    setName("");
    setDescription("");
    setPosition(null);
    setAddress("");
    setAddressInput("");
    setGeoError("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Locations</h2>
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleAddLocation} className="flex flex-col gap-4 max-w-md">
            <Input
              placeholder="Location Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              <div className="mb-2 font-medium">Pick location on map or search by address:</div>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Search address..."
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                />
                <Button type="button" onClick={handleAddressSearch} variant="outline">
                  Find
                </Button>
              </div>
              {geoError && <div className="text-xs text-red-500 mb-2">{geoError}</div>}
              <MapContainer
                center={position || [27.7, 85.3]}
                zoom={position ? 14 : 6}
                style={{ height: "300px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
              {position && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}</div>
                  <div className="truncate">Address: {address || "Loading..."}</div>
                </div>
              )}
            </div>
            <Button type="submit" disabled={!position}>Add Location</Button>
          </form>
        </CardContent>
      </Card>
      <div>
        <h3 className="text-lg font-semibold mb-2">Existing Locations</h3>
        <ul className="space-y-2">
          {locations.length === 0 && <li className="text-muted-foreground">No locations yet.</li>}
          {locations.map((loc) => (
            <li key={loc.id} className="border rounded p-2">
              <div className="font-medium">{loc.name}</div>
              <div className="text-sm text-muted-foreground">{loc.description}</div>
              {loc.lat && loc.lng && (
                <div className="text-xs text-muted-foreground">
                  Lat: {loc.lat.toFixed(5)}, Lng: {loc.lng.toFixed(5)}
                </div>
              )}
              {loc.address && (
                <div className="text-xs text-muted-foreground truncate">{loc.address}</div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
