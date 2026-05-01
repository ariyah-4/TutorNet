import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen,
    LayoutDashboard,
    PlusCircle,
    Search,
    LogOut,
    User as UserIcon,
    GraduationCap
} from 'lucide-react';

export default function Sidebar() {
    const { profile, signOut } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['LEARNER', 'TUTOR'] },
        { name: 'Browse Courses', path: '/browse', icon: Search, roles: ['LEARNER', 'TUTOR'] },
        { name: 'My Learning', path: '/my-learning', icon: BookOpen, roles: ['LEARNER'] },
        { name: 'My Created Courses', path: '/my-courses', icon: GraduationCap, roles: ['TUTOR'] },
        { name: 'Create Course', path: '/create-course', icon: PlusCircle, roles: ['TUTOR'] },
        { name: 'Profile', path: '/profile', icon: UserIcon, roles: ['LEARNER', 'TUTOR'] },
    ];

    // Filter items based on the profile role from your backend
    const filteredNav = navItems.filter(item =>
        profile && item.roles.includes(profile.role)
    );

    return (
        <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold text-blue-400">TutorNet</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {filteredNav.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-lg transition ${
                            location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'
                        }`}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-4 px-2">
                    {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} className="w-8 h-8 rounded-full" alt="Avatar" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            {profile?.firstName?.[0] || 'U'}
                        </div>
                    )}
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">
                            {profile ? `${profile.firstName} ${profile.lastName}` : 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{profile?.role}</p>
                    </div>
                </div>
                <button
                    onClick={signOut}
                    className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 transition"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}