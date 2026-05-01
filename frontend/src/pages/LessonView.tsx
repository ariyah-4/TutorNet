import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Lesson } from '../types';
import { Plus, ChevronLeft, BookOpen, HelpCircle, FileText } from 'lucide-react';

const LessonView = () => {
    const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
    const { profile } = useAuth();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const isTutor = profile?.role === 'TUTOR';

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId || !lessonId) return;
            try {
                const [lessonRes, progressRes] = await Promise.all([
                    api.getLessonsForCourse(courseId),
                    api.getCourseProgress(courseId)
                ]);

                const currentLesson = lessonRes.data.find(l => String(l.id) === String(lessonId));
                setLesson(currentLesson || null);

                // Check progress for everyone (including Tutors)
                const completedIds: any[] = (progressRes.data as any).completedLessonIds || [];
                setIsCompleted(completedIds.some(id => String(id) === String(lessonId)));
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
        } finally {
            setActionLoading(false);
        }
    };

    if (!lesson) return <div className="p-10 text-slate-500 font-mono italic">SYNCING_CONTENT...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <button
                onClick={() => navigate(`/course/${courseId}`)}
                className="text-[10px] font-black text-slate-500 hover:text-white flex items-center gap-2 uppercase tracking-[0.2em] transition-all"
            >
                <ChevronLeft size={14} /> Return to Syllabus
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">{lesson.title}</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                            Deployment_ID: {lessonId?.slice(0, 8)}
                        </p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-2xl text-slate-700">
                        <BookOpen size={28} />
                    </div>
                </div>

                <div className="p-10 space-y-12">
                    <article className="prose prose-invert max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                            {lesson.content}
                        </p>
                    </article>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* --- ASSIGNMENT SECTION --- */}
                        <div className={`p-8 rounded-3xl border transition-all ${
                            lesson.assignment ? 'bg-blue-600/10 border-blue-500/30' : 'bg-slate-950 border-slate-800 border-dashed'
                        }`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3 rounded-xl ${lesson.assignment ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white uppercase tracking-tight text-sm">Practical Assignment</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        {lesson.assignment ? 'Submission Available' : 'Not Provided'}
                                    </p>
                                </div>
                            </div>

                            {lesson.assignment && (
                                <Link
                                    to={`/course/${courseId}/lesson/${lessonId}/assignment`}
                                    className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl text-center transition-all shadow-lg shadow-blue-900/20 mb-3"
                                >
                                    Open Assignment
                                </Link>
                            )}

                            {/* Tutor can still see "Add Assignment" if one doesn't exist */}
                            {isTutor && !lesson.assignment && (
                                <Link
                                    to={`/course/${courseId}/lesson/${lessonId}/create-assignment`}
                                    className="flex items-center justify-center gap-2 w-full py-4 border border-slate-800 hover:border-blue-500 text-slate-500 hover:text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all"
                                >
                                    <Plus size={14} /> Add Assignment
                                </Link>
                            )}
                        </div>

                        {/* --- QUIZ SECTION --- */}
                        <div className={`p-8 rounded-3xl border transition-all ${
                            lesson.quiz ? 'bg-purple-600/10 border-purple-500/30' : 'bg-slate-950 border-slate-800 border-dashed'
                        }`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3 rounded-xl ${lesson.quiz ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                    <HelpCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-black text-white uppercase tracking-tight text-sm">Knowledge Check</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        {lesson.quiz ? 'Take Assessment' : 'Not Provided'}
                                    </p>
                                </div>
                            </div>

                            {lesson.quiz && (
                                <Link
                                    to={`/course/${courseId}/lesson/${lessonId}/quiz`}
                                    className="block w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl text-center transition-all shadow-lg shadow-purple-900/40 mb-3"
                                >
                                    Take Quiz
                                </Link>
                            )}

                            {/* Tutor can still see "Add Quiz" if one doesn't exist */}
                            {isTutor && !lesson.quiz && (
                                <Link
                                    to={`/course/${courseId}/lesson/${lessonId}/create-quiz`}
                                    className="flex items-center justify-center gap-2 w-full py-4 border border-slate-800 hover:border-purple-500 text-slate-500 hover:text-purple-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all"
                                >
                                    <Plus size={14} /> Add Quiz
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Controls - Visible to everyone */}
                <div className="p-10 bg-black/20 border-t border-slate-800 flex flex-col sm:flex-row justify-end gap-4">
                    <button
                        onClick={handleToggleCompletion}
                        disabled={actionLoading}
                        className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 ${
                            isCompleted
                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-900/20'
                        }`}
                    >
                        {actionLoading ? 'Syncing...' : isCompleted ? '✕ Mark Incomplete' : '✓ Mark Complete'}
                    </button>

                    <button
                        onClick={() => navigate(`/course/${courseId}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                    >
                        Return to Syllabus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonView;