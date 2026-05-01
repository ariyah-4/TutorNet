import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type {Lesson} from '../types';

const CreateLesson = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        orderIndex: 1
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!courseId) return;

        setLoading(true);
        try {
            // Using your existing createLesson method
            // We cast to Lesson to satisfy the type definition in api.ts
            await api.createLesson(courseId, formData as Lesson);

            alert("Lesson published successfully!");
            navigate(`/course/${courseId}`);
        } catch (err) {
            console.error("Failed to create lesson", err);
            alert("Error creating lesson. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <button
                onClick={() => navigate(-1)}
                className="text-slate-400 hover:text-white mb-6 flex items-center transition-colors"
            >
                ← Back to Course
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-6">Create New Lesson</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 font-medium mb-2 text-sm uppercase tracking-wider">
                            Lesson Title
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            placeholder="e.g., Understanding the MVC Pattern"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 font-medium mb-2 text-sm uppercase tracking-wider">
                            Order (Step Number)
                        </label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            value={formData.orderIndex}
                            onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 font-medium mb-2 text-sm uppercase tracking-wider">
                            Content
                        </label>
                        <textarea
                            required
                            rows={12}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none font-mono text-sm"
                            placeholder="Type your lesson content here..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
                    >
                        {loading ? 'Creating...' : 'Publish Lesson'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLesson;