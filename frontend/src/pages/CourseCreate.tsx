import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Globe, Layout, DollarSign, BarChart3 } from 'lucide-react';

const CourseCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
        <div className="max-w-3xl mx-auto space-y-8 py-10 px-4">
            <header className="text-center">
                <h2 className="text-4xl font-black text-white tracking-tight">Create New Course</h2>
                <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em] font-black italic">
                    Curriculum_Designer_v1.0
                </p>
            </header>

            {/* Main Card: Using slate-900 and larger rounding to match Login/Signup */}
            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-800">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Course Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Globe size={12} className="text-blue-500" /> Course Title
                        </label>
                        <input
                            required
                            type="text"
                            /* CHANGED: bg-black -> bg-slate-950 and border-slate-800 */
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Advanced Java Microservices"
                        />
                    </div>

                    {/* Course Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Layout size={12} className="text-blue-500" /> Course Description
                        </label>
                        <textarea
                            required
                            rows={5}
                            /* CHANGED: bg-black -> bg-slate-950 */
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all resize-none font-medium leading-relaxed placeholder:text-slate-600"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe the learning objectives and course outcomes..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-2">
                                <DollarSign size={12} className="text-blue-500" /> Price ($)
                            </label>
                            <input
                                required
                                type="number"
                                min="0"
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all font-bold"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1 flex items-center gap-2">
                                <BarChart3 size={12} className="text-blue-500" /> Difficulty Level
                            </label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all cursor-pointer font-bold appearance-none"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 active:scale-[0.98]"
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