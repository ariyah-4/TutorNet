import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type {Enrollment, Announcement} from '../types';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // 1. Fetch the user's enrollments
                const { data: enrollmentData } = await api.getMyLearning();
                setEnrollments(enrollmentData);

                // 2. Fetch progress and announcements for each course in parallel
                const detailPromises = enrollmentData.map(async (enrollment) => {
                    const courseId = enrollment.course.id;

                    const [progressRes, announcementRes] = await Promise.all([
                        api.getCourseProgress(courseId),
                        api.getAnnouncements(courseId)
                    ]);

                    // Accessing the 'percentage' key from Record<string, object>
                    const percentage = typeof progressRes.data['percentage'] === 'number'
                        ? progressRes.data['percentage']
                        : 0;

                    return {
                        courseId,
                        percentage,
                        courseAnnouncements: announcementRes.data
                    };
                });

                const results = await Promise.all(detailPromises);

                // 3. Process results into state
                const newProgressMap: Record<string, number> = {};
                const combinedAnnouncements: Announcement[] = [];

                results.forEach(res => {
                    newProgressMap[res.courseId] = res.percentage;
                    combinedAnnouncements.push(...res.courseAnnouncements);
                });

                // Sort announcements by date (newest first)
                combinedAnnouncements.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setProgressMap(newProgressMap);
                setAnnouncements(combinedAnnouncements.slice(0, 5));
            } catch (err) {
                console.error("Dashboard failed to synchronize:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    if (loading) return (
        <div className="p-12 flex items-center justify-center text-slate-500 font-medium">
            <div className="animate-pulse">Loading command center...</div>
        </div>
    );

    const completedCount = Object.values(progressMap).filter(p => p >= 100).length;

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* --- Summary Header --- */}
            <header>
                <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">Overview of your current learning status and course updates.</p>
            </header>

            {/* --- High-Level Metrics --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-sm">
                    <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">Active Enrollments</p>
                    <p className="text-4xl font-bold text-white mt-2">{enrollments.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-sm">
                    <p className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Courses Completed</p>
                    <p className="text-4xl font-bold text-white mt-2">{completedCount}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-sm">
                    <p className="text-purple-500 text-[10px] font-bold uppercase tracking-widest">New Announcements</p>
                    <p className="text-4xl font-bold text-white mt-2">{announcements.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Recent Activity --- */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Current Progress</h2>
                    <div className="grid gap-4">
                        {enrollments.slice(0, 3).map((e) => (
                            <div key={e.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">{e.course.title}</h3>
                                    <p className="text-xs text-slate-500 mb-4 tracking-wide">Difficulty: {e.course.difficulty}</p>
                                    <ProgressBar progress={progressMap[e.course.id] || 0} />
                                </div>
                                <Link
                                    to={`/course/${e.course.id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
                                >
                                    Continue
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Right Column: Announcements Feed --- */}
                <div className="space-y-6">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Latest News</h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                        {announcements.length === 0 ? (
                            <div className="p-8 text-center text-slate-600 italic text-sm">No recent updates.</div>
                        ) : (
                            announcements.map((ann) => (
                                <div key={ann.id} className="p-5 hover:bg-white/5 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold text-blue-400 uppercase">{ann.course.title}</span>
                                        <span className="text-[10px] text-slate-600">{new Date(ann.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{ann.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;