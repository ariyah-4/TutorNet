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

    if (loading) return <div className="p-8 text-white">Loading syllabus...</div>;
    if (!course) return <div className="p-8 text-white">Course not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <header className="mb-12 flex justify-between items-start gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
                    <p className="text-slate-400 text-lg">{course.description}</p>
                </div>
                {isTutor && (
                    <Link
                        to={`/course/${courseId}/create-lesson`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shrink-0 shadow-lg shadow-blue-900/20"
                    >
                        + Add Lesson
                    </Link>
                )}
            </header>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-200 mb-6">Course Content</h2>
                {lessons.map((lesson, index) => {
                    const isDone = completedLessonIds.includes(lesson.id);

                    return (
                        <div
                            key={lesson.id}
                            className="flex flex-col sm:flex-row sm:items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group gap-4"
                        >
                            <div className="flex items-center flex-1">
                                {/* Visual Checkmark / Number Circle */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 border-2 transition-all font-bold shrink-0 ${
                                    isDone
                                        ? 'bg-green-500/10 border-green-500 text-green-500'
                                        : 'bg-slate-800 border-transparent text-slate-400'
                                }`}>
                                    {isDone ? '✓' : (lesson.orderIndex || index + 1)}
                                </div>

                                <div>
                                    <h3 className={`font-medium ${isDone ? 'text-slate-400' : 'text-white'}`}>
                                        {lesson.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 ml-14 sm:ml-0">
                                {/* LEARNERS: Take Quiz Button */}
                                {!isTutor && (
                                    <Link
                                        to={`/course/${courseId}/lesson/${lesson.id}/quiz`}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                            isDone
                                                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20'
                                        }`}
                                    >
                                        {isDone ? 'Retake Quiz' : 'Take Quiz'}
                                    </Link>
                                )}

                                <Link
                                    to={`/course/${courseId}/lesson/${lesson.id}`}
                                    className="text-blue-500 hover:text-blue-400 font-medium px-3 py-1 text-sm sm:text-base"
                                >
                                    {isDone ? 'Revisit' : 'View'}
                                </Link>

                                {isTutor && (
                                    <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                                        {/* TUTORS: Create Quiz Link */}
                                        <Link
                                            to={`/course/${courseId}/lesson/${lesson.id}/create-quiz`}
                                            className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-2.5 py-1.5 rounded-md transition-all font-bold uppercase tracking-wider"
                                        >
                                            + Quiz
                                        </Link>

                                        <Link
                                            to={`/course/${courseId}/edit-lesson/${lesson.id}`}
                                            className="text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-md text-xs transition-colors"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={(e) => handleDeleteLesson(e, lesson.id)}
                                            className="text-red-500 hover:text-red-400 bg-red-500/10 px-2.5 py-1.5 rounded-md text-xs transition-colors"
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