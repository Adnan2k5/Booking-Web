import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdventure } from "../Api/adventure.api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export default function PostAdventure() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
        exp: "",
        instructor: "",
    });
    const [medias, setMedias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleMediaChange = (e) => {
        setMedias([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const data = new FormData();
            Object.entries(form).forEach(([key, value]) => data.append(key, value));
            medias.forEach((file) => data.append("medias", file));
            await createAdventure(data);
            setSuccess("Adventure posted successfully!");
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to post adventure");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Post New Adventure</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <Textarea name="description" value={form.description} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block font-medium mb-1">Location</label>
                    <Input name="location" value={form.location} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block font-medium mb-1">Date</label>
                    <Input type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block font-medium mb-1">Experience (Price)</label>
                    <Input type="number" name="exp" value={form.exp} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block font-medium mb-1">Instructor ID</label>
                    <Input name="instructor" value={form.instructor} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block font-medium mb-1">Media (up to 4 images)</label>
                    <Input type="file" name="medias" accept="image/*" multiple onChange={handleMediaChange} required />
                </div>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-600">{success}</div>}
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                    {loading ? "Posting..." : "Post Adventure"}
                </Button>
            </form>
        </div>
    );
}
