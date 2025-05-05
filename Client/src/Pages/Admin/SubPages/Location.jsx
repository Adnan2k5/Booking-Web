import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLocations([
      ...locations,
      { id: Date.now(), name, description },
    ]);
    setName("");
    setDescription("");
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
            <Button type="submit">Add Location</Button>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
