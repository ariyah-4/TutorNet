import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen,
    LayoutDashboard,
    PlusCircle,
    Search,
    LogOut,
    GraduationCap
} from 'lucide-react';

export default function Sidebar() {
    const { profile, signOut } = useAuth();
    const location = useLocation();

    // 1. Removed 'Profile' from navItems to keep the UI clean
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['LEARNER', 'TUTOR'] },
        { name: 'Browse Courses', path: '/browse', icon: Search, roles: ['LEARNER', 'TUTOR'] },
        { name: 'My Learning', path: '/my-learning', icon: BookOpen, roles: ['LEARNER'] },
        { name: 'My Created Courses', path: '/my-courses', icon: GraduationCap, roles: ['TUTOR'] },
        { name: 'Create Course', path: '/create-course', icon: PlusCircle, roles: ['TUTOR'] },
    ];

    const filteredNav = navItems.filter(item =>
        profile && item.roles.includes(profile.role)
    );

    return (
        <aside className="w-64 bg-slate-900 text-white h-screen sticky top-0 flex flex-col border-r border-slate-800">
            <div className="p-6">
                <h1 className="text-xl font-bold text-blue-400 tracking-tight">TutorNet</h1>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {filteredNav.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                            location.pathname === item.path
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* 2. Integrated Profile Section at the bottom */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link
                    to="/profile"
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                        location.pathname === '/profile'
                            ? 'bg-blue-600/10 border border-blue-500/50'
                            : 'hover:bg-slate-800/50 border border-transparent'
                    }`}
                >
                    {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} className="w-9 h-9 rounded-full object-cover border border-slate-700" alt="Avatar" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-inner">
                            {profile?.firstName?.[0] || 'U'}
                        </div>
                    )}
                    <div className="overflow-hidden">
                        <p className={`text-sm font-bold truncate transition-colors ${
                            location.pathname === '/profile' ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'
                        }`}>
                            {profile ? `${profile.firstName} ${profile.lastName}` : 'Guest User'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mt-1">
                            {profile?.role}
                        </p>
                    </div>
                </Link>

                <button
                    onClick={signOut}
                    className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}