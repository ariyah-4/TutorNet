import type {Course} from '../types';
import { BookOpen, User, BarChart } from 'lucide-react';

interface CourseCardProps {
    course: Course;
    onEnroll: (id: string) => void;
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
            <img
                src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                alt={course.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-blue-600 mb-2 uppercase">
                    <BarChart size={14} />
                    {course.difficulty}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{course.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <User size={14} />
                    <span>{course.tutor.firstName} {course.tutor.lastName}</span>
                </div>
                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {course.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-slate-900">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
                    <button
                        onClick={() => onEnroll(course.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                    >
                        <BookOpen size={16} />
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
}