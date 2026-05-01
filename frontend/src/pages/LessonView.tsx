import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Added Link
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
                const completedIds: any[] = (progressRes.data as any).completedLessonIds || [];
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

                {/* Lesson Body */}
                <div className="p-8 text-slate-300 prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap mb-8">{lesson.content}</p>

                    {/* --- ASSIGNMENT SECTION --- */}
                    {lesson.assignment && (
                        <div className="not-prose mt-12 p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-600 rounded-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Lesson Assignment</h3>
                                    <p className="text-slate-400 text-sm">Submit your practical work for review.</p>
                                </div>
                            </div>
                            <Link
                                to={`/course/${courseId}/lesson/${lessonId}/assignment`}
                                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-center shadow-lg shadow-blue-900/40"
                            >
                                Open Assignment
                            </Link>
                        </div>
                    )}

                    {/* --- QUIZ SECTION --- */}
                    {lesson.quiz && (
                        <div className="not-prose mt-6 p-6 bg-purple-900/20 border border-purple-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-600 rounded-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Lesson Quiz</h3>
                                    <p className="text-slate-400 text-sm">Test your knowledge of this topic.</p>
                                </div>
                            </div>
                            <Link
                                to={`/course/${courseId}/lesson/${lessonId}/quiz`}
                                className="w-full md:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all text-center shadow-lg shadow-purple-900/40"
                            >
                                Take Quiz
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-8 bg-slate-900/50 border-t border-slate-800 flex flex-col sm:flex-row justify-end gap-4">
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