import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Defined local interface for the request body to ensure type safety
interface CourseCreateRequest {
    title: string;
    description: string;
    price: number;
    difficulty: string;
}

const CourseCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 1. Initial state updated from 'category' to 'difficulty'
    const [formData, setFormData] = useState<CourseCreateRequest>({
        title: '',
        description: '',
        price: 0,
        difficulty: 'Beginner'
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Successfully sending typed difficulty data to the backend
            await api.createCourse(formData);

            alert('Course published successfully!');
            navigate('/'); // Redirect to dashboard to see the new course
        } catch (err) {
            console.error('Failed to create course:', err);
            alert('Error: Ensure you have active Tutor credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
            <header className="mb-8">
                <h2 className="text-2xl font-bold text-white">Create New Course</h2>
                <p className="text-slate-500 text-sm mt-1">Define your curriculum and set the challenge level.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Course Title</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Advanced Java Microservices"
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                        required
                        rows={4}
                        className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="What will students learn in this module?"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Price ($)</label>
                        <input
                            required
                            type="number"
                            min="0"
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        {/* 2. Label and Options changed to Difficulty */}
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Difficulty Level</label>
                        <select
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                    >
                        {loading ? 'SYNCHRONIZING...' : 'Publish Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseCreate;