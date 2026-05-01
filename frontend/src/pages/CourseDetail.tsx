import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Course, Lesson } from '../types';

const CourseDetail = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { profile } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const isTutor = profile?.id === course?.tutor?.id;

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId) return;
            try {
                const [courseRes, lessonsRes, progressRes] = await Promise.all([
                    api.getAllCourses(),
                    api.getLessonsForCourse(courseId),
                    api.getCourseProgress(courseId)
                ]);

                const currentCourse = courseRes.data.find(c => c.id === courseId);
                setCourse(currentCourse || null);
                setLessons(lessonsRes.data);
                setCompletedLessonIds((progressRes.data as any).completedLessonIds || []);
            } catch (err) {
                console.error("Error fetching course details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId]);

    const handleDeleteLesson = async (e: React.MouseEvent, lessonId: string) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to delete this lesson?")) return;

        try {
            await api.deleteLesson(lessonId);
            setLessons(prev => prev.filter(l => l.id !== lessonId));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete lesson.");
        }
    };

    if (loading) return <div className="p-10 text-slate-500 font-mono italic">SYNCING_SYLLABUS...</div>;
    if (!course) return <div className="p-8 text-white">Course not found.</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <header className="mb-12 flex justify-between items-start gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-4">{course.title}</h1>
                    <p className="text-slate-400 text-lg max-w-2xl">{course.description}</p>
                </div>
                {isTutor && (
                    <Link
                        to={`/course/${courseId}/create-lesson`}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shrink-0 shadow-lg shadow-blue-900/20"
                    >
                        + Add Lesson
                    </Link>
                )}
            </header>

            <div className="space-y-4">
                <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 px-2">Course Content</h2>
                {lessons.map((lesson, index) => {
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                        <div
                            key={lesson.id}
                            className="flex flex-col lg:flex-row lg:items-center p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all group gap-4 shadow-xl"
                        >
                            <div className="flex items-center flex-1">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-5 border-2 transition-all font-black text-sm shrink-0 ${
                                    isDone
                                        ? 'bg-green-500/10 border-green-500/50 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                        : 'bg-slate-950 border-slate-800 text-slate-500'
                                }`}>
                                    {isDone ? '✓' : (lesson.orderIndex || index + 1)}
                                </div>

                                <div className="overflow-hidden">
                                    <h3 className={`font-bold text-lg truncate ${isDone ? 'text-slate-400 italic' : 'text-white'}`}>
                                        {lesson.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">
                                        Module_{lesson.id.slice(0, 4)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 ml-16 lg:ml-0">
                                {/* INTERACTION BUTTONS: Visible to both Learners AND Tutors if content exists */}
                                {lesson.assignment && (
                                    <Link
                                        to={`/course/${courseId}/lesson/${lesson.id}/assignment`}
                                        className="px-4 py-2 bg-blue-600/10 text-blue-400 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        Assignment
                                    </Link>
                                )}
                                {lesson.quiz && (
                                    <Link
                                        to={`/course/${courseId}/lesson/${lesson.id}/quiz`}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isDone
                                                ? 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                                : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20'
                                        }`}
                                    >
                                        {isDone ? 'Retake Quiz' : 'Take Quiz'}
                                    </Link>
                                )}

                                <Link
                                    to={`/course/${courseId}/lesson/${lesson.id}`}
                                    className="text-slate-300 hover:text-blue-400 font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 transition-all"
                                >
                                    {isDone ? 'Revisit' : 'Start Lesson'}
                                </Link>

                                {/* TUTOR MANAGEMENT: Only visible to the assigned Tutor */}
                                {isTutor && (
                                    <div className="flex items-center gap-2 border-l border-slate-800 pl-4 ml-1">
                                        <Link
                                            to={`/course/${courseId}/lesson/${lesson.id}/create-assignment`}
                                            className={`text-[9px] px-3 py-2 rounded-lg font-black uppercase tracking-wider transition-all border ${
                                                lesson.assignment
                                                    ? 'bg-slate-800 text-slate-500 border-transparent italic'
                                                    : 'bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600 hover:text-white'
                                            }`}
                                        >
                                            {lesson.assignment ? '✓ Assignment' : '+ Assignment'}
                                        </Link>

                                        <Link
                                            to={`/course/${courseId}/lesson/${lesson.id}/create-quiz`}
                                            className={`text-[9px] px-3 py-2 rounded-lg font-black uppercase tracking-wider transition-all border ${
                                                lesson.quiz
                                                    ? 'bg-slate-800 text-slate-500 border-transparent italic'
                                                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500 hover:text-white'
                                            }`}
                                        >
                                            {lesson.quiz ? '✓ Quiz' : '+ Quiz'}
                                        </Link>

                                        <Link
                                            to={`/course/${courseId}/edit-lesson/${lesson.id}`}
                                            className="text-slate-500 hover:text-white bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={(e) => handleDeleteLesson(e, lesson.id)}
                                            className="text-red-500/50 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg text-[9px] font-black uppercase transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CourseDetail;