import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Course } from '../types';
import { Link } from 'react-router-dom';

const MyCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorCourses = async () => {
            try {
                const { data } = await api.getMyCourses();
                setCourses(data);
            } catch (err) {
                console.error("Failed to fetch authored courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTutorCourses();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-white animate-pulse">
            Loading your course catalog...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">My Authored Courses</h2>
                    <p className="text-slate-400 mt-2">Manage your curriculum and track student entry points.</p>
                </div>
                <Link
                    to="/create-course"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    + Create New Course
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-16 rounded-2xl text-center border-dashed">
                    <div className="text-5xl mb-4">📚</div>
                    <p className="text-slate-400 text-lg mb-6">You haven't created any courses yet.</p>
                    <Link to="/create-course" className="text-blue-400 hover:text-blue-300 font-semibold underline">
                        Launch your first course now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center group hover:border-blue-500/50 transition-all"
                        >
                            <div className="flex-1 mb-6 md:mb-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                        {course.title}
                                    </h3>
                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-700">
                                        {course.difficulty || 'Standard'}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm line-clamp-2 max-w-2xl">
                                    {course.description}
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-xs font-medium">
                                    <span className="text-green-400 bg-green-950/30 px-2 py-1 rounded">
                                        Price: ${course.price.toFixed(2)}
                                    </span>
                                    <span className="text-slate-500">
                                        Created: {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                <Link
                                    to={`/course/${course.id}`}
                                    className="flex-1 md:flex-none text-center bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    Preview
                                </Link>
                                <Link
                                    to={`/course/${course.id}/create-lesson`}
                                    className="flex-1 md:flex-none text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                                >
                                    Add Content
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCourses;