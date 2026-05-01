import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Enrollment } from '../types';
import { Link } from 'react-router-dom';

const MyLearning = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    // Store progress as { courseId: percentage }
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch all enrollments
                const { data: enrollmentData } = await api.getMyLearning();
                setEnrollments(enrollmentData);

                // 2. Fetch progress for each course in parallel
                const progressResults = await Promise.all(
                    enrollmentData.map(async (enrollment) => {
                        try {
                            const { data: pData } = await api.getCourseProgress(enrollment.course.id);
                            // Based on your backend Map<String, Object> return:
                            return {
                                id: enrollment.course.id,
                                percentage: (pData as any).percentage ?? 0
                            };
                        } catch (err) {
                            return { id: enrollment.course.id, percentage: 0 };
                        }
                    })
                );

                // 3. Convert array to a lookup map
                const newProgressMap: Record<string, number> = {};
                progressResults.forEach(res => {
                    newProgressMap[res.id] = res.percentage;
                });
                setProgressMap(newProgressMap);

            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-white">
            <div className="animate-pulse">Loading your courses and progress...</div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-white mb-8">My Learning</h2>

            {enrollments.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-12 rounded-xl text-center">
                    <p className="text-slate-400 mb-4">You haven't enrolled in any courses yet.</p>
                    <Link to="/browse" className="text-blue-400 hover:underline">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrollments.map((enrollment) => {
                        const progress = progressMap[enrollment.course.id] || 0;

                        return (
                            <div key={enrollment.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white line-clamp-1">
                                            {enrollment.course.title}
                                        </h3>
                                        <span className="text-blue-400 font-bold text-sm">
                                            {Math.round(progress)}%
                                        </span>
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4">
                                        Instructor: {enrollment.course.tutor.firstName} {enrollment.course.tutor.lastName}
                                    </p>

                                    {/* --- Progress Bar UI --- */}
                                    <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="text-slate-500 text-xs mb-4">
                                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </div>

                                <Link
                                    to={`/course/${enrollment.course.id}`}
                                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all"
                                >
                                    {progress === 100 ? 'Review Course' : 'Continue Learning'}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyLearning;