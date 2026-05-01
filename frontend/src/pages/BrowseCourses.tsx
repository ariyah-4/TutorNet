import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { Search, Loader2 } from 'lucide-react';

export default function BrowseCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.getAllCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleEnroll = async (courseId: string) => {
        try {
            await api.enroll(courseId);
            alert("Successfully enrolled!");
        } catch (error) {
            alert("Enrollment failed. You might already be enrolled.");
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em] italic">Synchronising_Catalog...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    {/* FIXED: Visibility for image_3e7a70.jpg */}
                    <h1 className="text-4xl font-black text-white tracking-tight">
                        Explore Courses
                    </h1>
                    <p className="text-lg font-medium text-slate-400">
                        Discover new skills from our expert tutors.
                    </p>
                </div>

                {/* Dark Themed Search Bar */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 font-bold text-sm shadow-2xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.id} course={course} onEnroll={handleEnroll} />
                    ))}
                </div>
            ) : (
                /* Themed Empty State */
                <div className="text-center py-24 bg-slate-900/30 rounded-[2.5rem] border-2 border-dashed border-slate-800/50">
                    <div className="inline-flex p-5 bg-slate-900 rounded-3xl mb-6 text-slate-600">
                        <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
                        We couldn't find any courses matching "<span className="text-blue-400 italic">{searchTerm}</span>".
                    </p>
                </div>
            )}
        </div>
    );
}