import type { Course } from '../types';
import { BookOpen, User, BarChart } from 'lucide-react';

interface CourseCardProps {
    course: Course;
    onEnroll: (id: string) => void;
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
    return (
        <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all group flex flex-col h-full">
            {/* Image Section with subtle overlay */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1 space-y-4">
                {/* Difficulty Badge - glassmorphism style */}
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-1.5">
                        <BarChart size={12} />
                        {course.difficulty}
                    </div>
                </div>

                {/* Title & Tutor */}
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                        {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <User size={14} className="opacity-50" />
                        <span>{course.tutor.firstName} {course.tutor.lastName}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {course.description}
                </p>

                {/* Footer: Price & Enroll */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                    <span className="text-2xl font-black text-white">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <button
                        onClick={() => onEnroll(course.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <BookOpen size={14} />
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
}