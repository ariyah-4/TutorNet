import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const CourseCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Using simple object state that matches the expected Backend JSON
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        difficulty: 'Beginner'
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Now TypeScript accepts this because the API expects a Partial<Course>
            await api.createCourse(formData);

            alert('Course published successfully!');
            navigate('/');
        } catch (err) {
            console.error('Failed to create course:', err);
            alert('Error: Check your Tutor permissions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-6">
            <header>
                <h2 className="text-3xl font-bold text-white tracking-tight">Create New Course</h2>
                <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-black">Curriculum_Designer_v1.0</p>
            </header>

            <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Course Title</label>
                        <input
                            required
                            type="text"
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Advanced Java Microservices"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Course Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price ($)</label>
                            <input
                                required
                                type="number"
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Difficulty Level</label>
                            <select
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                        >
                            {loading ? 'PUBLISHING_TO_CATALOG...' : 'Publish Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseCreate;