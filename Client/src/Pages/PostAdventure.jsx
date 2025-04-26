import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAdventure } from "../Api/adventure.api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBill, FaChalkboardTeacher, FaImages } from "react-icons/fa";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-white py-10 relative overflow-hidden">
            {/* Decorative SVG shapes for background */}
            <svg className="absolute top-0 left-0 w-80 h-80 opacity-20 -z-10" viewBox="0 0 200 200"><circle cx="100" cy="100" r="100" fill="#38bdf8" /></svg>
            <svg className="absolute bottom-0 right-0 w-96 h-96 opacity-10 -z-10" viewBox="0 0 200 200"><rect width="200" height="200" rx="60" fill="#2563eb" /></svg>
            {/* Adventure banner */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-6 flex flex-col items-center">
                <img src="/src/assets/scubadiving-min.jpg" alt="Adventure Banner" className="w-40 h-24 object-cover rounded-2xl shadow-lg border-4 border-white/80" />
                <span className="mt-2 text-cyan-700 font-bold tracking-widest text-lg drop-shadow">Your Next Adventure Awaits</span>
            </div>
            <div className="w-full max-w-xl p-10 pt-24 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
                <h2 className="font-extrabold mb-8 text-blue-700 text-center drop-shadow text-4xl font-adventure">Post New Adventure</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <FaUser className="absolute left-3 top-3 text-cyan-400 text-xl" />
                        <Input name="name" value={form.name} onChange={handleChange} required placeholder="Adventure Name" className="pl-10 focus:ring-2 focus:ring-cyan-400 transition rounded-xl" />
                    </div>
                    <div className="relative">
                        <FaImages className="absolute left-3 top-3 text-cyan-400 text-xl" />
                        <Textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="pl-10 focus:ring-2 focus:ring-cyan-400 transition rounded-xl" />
                    </div>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-3 text-cyan-400 text-xl" />
                        <Input name="location" value={form.location} onChange={handleChange} required placeholder="Location" className="pl-10 focus:ring-2 focus:ring-cyan-400 transition rounded-xl" />
                    </div>
                    <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-3 text-cyan-400 text-xl" />
                        <Input type="date" name="date" value={form.date} onChange={handleChange} required className="pl-10 focus:ring-2 focus:ring-cyan-400 transition rounded-xl" />
                    </div>
                    <div className="relative">
                        <FaMoneyBill className="absolute left-3 top-3 text-cyan-400 text-xl" />
                        <Input type="number" name="exp" value={form.exp} onChange={handleChange} required placeholder="Experience (Price)" className="pl-10 focus:ring-2 focus:ring-cyan-400 transition rounded-xl" />
                    </div>
                    <div className="relative">
                        <FaChalkboardTeacher className="absolute left-3 top-3 text-cyan-400 text-xl" />
                        <Input name="instructor" value={form.instructor} onChange={handleChange} required placeholder="Instructor ID" className="pl-10 focus:ring-2 focus:ring-cyan-400 transition rounded-xl" />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2 text-blue-800 flex items-center gap-2"><FaImages className="text-cyan-400" /> Media (up to 4 images)</label>
                        <Input type="file" name="medias" accept="image/*" multiple onChange={handleMediaChange} required className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition" />
                        {medias.length > 0 && (
                            <div className="flex gap-3 mt-3">
                                {Array.from(medias).map((file, idx) => (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-16 h-16 object-cover rounded-xl border shadow-lg hover:scale-105 transition"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow text-center font-semibold animate-pulse">{error}</div>}
                    {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded shadow text-center font-semibold animate-bounce">{success}</div>}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xl rounded-2xl transition disabled:opacity-60 disabled:cursor-not-allowed border-2 border-cyan-200 hover:scale-105 active:scale-95 focus:ring-4 focus:ring-cyan-200"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                                Posting...
                            </span>
                        ) : "Post Adventure"}
                    </Button>
                </form>
            </div>
            {/* Custom font for adventure heading */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');
                .font-adventure { font-family: 'Luckiest Guy', cursive; letter-spacing: 2px; }
                .animate-fade-in { animation: fadeInUp 1s cubic-bezier(.23,1.01,.32,1) both; }
                @keyframes fadeInUp {
                  0% { opacity: 0; transform: translateY(40px); }
                  100% { opacity: 1; transform: none; }
                }
            `}</style>
        </div>
    );
}
