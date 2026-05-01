import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type {Assignment} from '../types';
import { ChevronLeft, Rocket } from 'lucide-react';

const AssignmentCreate = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
    const navigate = useNavigate();

    const [data, setData] = useState<Omit<Assignment, 'id' | 'lesson'>>({
        title: '',
        instructions: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonId) return;
        setLoading(true);
        try {
            await api.createAssignment(lessonId, data);
            navigate(`/course/${courseId}/lesson/${lessonId}`);
        } catch (err) {
            console.error("Assignment creation failed:", err);
            alert("Critical Error: Failed to deploy assignment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] mb-8 transition-colors"
            >
                <ChevronLeft size={14} /> Abort Mission
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Deploy Assignment</h1>
                        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-2">
                            System_Target: {lessonId?.slice(0, 18)}...
                        </p>
                    </div>
                    <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500">
                        <Rocket size={32} />
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Assignment Title</label>
                        <input
                            required
                            className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 transition-all font-medium"
                            placeholder="e.g., Module 1 Practical Project"
                            value={data.title}
                            onChange={e => setData({...data, title: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Detailed Instructions</label>
                        <textarea
                            required
                            rows={6}
                            className="w-full bg-black border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-blue-500/50 resize-none transition-all font-medium leading-relaxed"
                            placeholder="Detail the requirements for the students..."
                            value={data.instructions}
                            onChange={e => setData({...data, instructions: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Publish Assignment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssignmentCreate;