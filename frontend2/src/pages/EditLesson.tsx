import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const EditLesson = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        orderIndex: 1
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchLessonData = async () => {
            if (!courseId || !lessonId) return;
            try {
                // Fetch lessons and find the specific one to edit
                const { data } = await api.getLessonsForCourse(courseId);
                const lesson = data.find(l => l.id === lessonId);

                if (lesson) {
                    setFormData({
                        title: lesson.title,
                        content: lesson.content,
                        orderIndex: lesson.orderIndex
                    });
                }
            } catch (err) {
                console.error("Failed to load lesson", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLessonData();
    }, [courseId, lessonId]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!lessonId) return;

        setSaving(true);
        try {
            // Check if you added updateLesson to your api.ts yet
            // If not, add: updateLesson: (id, data) => apiClient.put(`/lessons/${id}`, data)
            await api.updateLesson(lessonId, formData);
            navigate(`/course/${courseId}`);
        } catch (err) {
            console.error("Failed to update lesson", err);
            alert("Update failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-white">Loading lesson details...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
                <h2 className="text-3xl font-bold text-white mb-6">Edit Lesson</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 font-medium mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 font-medium mb-2">Order Index</label>
                        <input
                            type="number"
                            required
                            className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            value={formData.orderIndex}
                            onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 font-medium mb-2">Content</label>
                        <textarea
                            required
                            rows={12}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                        >
                            {saving ? 'Saving Changes...' : 'Update Lesson'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditLesson;