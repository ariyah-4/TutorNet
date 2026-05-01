import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        /* Changed bg-slate-50 to bg-slate-950 and added text-white */
        <div className="flex bg-slate-950 min-h-screen text-white">
            <Sidebar />

            {/*
              Ensure the main area is also dark.
              Adding 'overflow-y-auto' helps if your lesson content gets long.
            */}
            <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}