import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Lesson } from '../types';

const LessonView = () => {
    const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId || !lessonId) return;
            try {
                // Fetch both in parallel
                const [lessonRes, progressRes] = await Promise.all([
                    api.getLessonsForCourse(courseId),
                    api.getCourseProgress(courseId)
                ]);

                // 1. Set Lesson Content
                const currentLesson = lessonRes.data.find(l => String(l.id) === String(lessonId));
                setLesson(currentLesson || null);

                // 2. Check Completion Status
                // We use String() cast to ensure UUIDs from backend match strings from useParams
                const completedIds: any[] = (progressRes.data as any).completedLessonIds || [];

                console.log("Comparing:", lessonId, "against list:", completedIds);
                const found = completedIds.some(id => String(id) === String(lessonId));

                setIsCompleted(found);
            } catch (err) {
                console.error("Error fetching lesson data", err);
            }
        };
        fetchData();
    }, [courseId, lessonId]);

    const handleToggleCompletion = async () => {
        if (!lessonId) return;
        setActionLoading(true);
        try {
            if (isCompleted) {
                await api.markLessonIncomplete(lessonId);
                setIsCompleted(false);
            } else {
                await api.completeLesson(lessonId);
                setIsCompleted(true);
            }
        } catch (err) {
            alert("Failed to update progress.");
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    if (!lesson) return <div className="p-8 text-white">Loading lesson...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4">
            <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="text-slate-400 hover:text-white mb-6 flex items-center transition-colors"
            >
                ← Back to Syllabus
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-800">
                    <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
                </div>

                <div className="p-8 min-h-[400px] text-slate-300 prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
                </div>

                <div className="p-8 bg-slate-900/50 border-t border-slate-800 flex justify-end gap-4">
                    <button
                        onClick={handleToggleCompletion}
                        disabled={actionLoading}
                        className={`px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${
                            isCompleted
                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        {actionLoading ? 'Updating...' : isCompleted ? '✕ Mark as Incomplete' : '✓ Mark as Complete'}
                    </button>

                    {/* Return to Syllabus is always useful for navigation */}
                    <button
                        onClick={() => navigate(`/course/${courseId}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
                    >
                        Return to Syllabus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonView;