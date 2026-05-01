import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type {Profile} from '../types'; // Ensure this is imported

const ProfilePage = () => {
    const { profile, setProfile, loading } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Explicitly type the state as Partial<Profile> to satisfy the API
    const [formData, setFormData] = useState<Partial<Profile>>({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        bio: profile?.bio || '',
        avatarUrl: profile?.avatarUrl || ''
    });

    if (loading || !profile) {
        return <div className="p-10 text-slate-500 font-mono text-xs">LOADING_PROFILE...</div>;
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // 2. We send the partial formData
            const { data } = await api.updateProfile(formData);

            // 3. 'data' is a full Profile returned by your Java Controller,
            // so setProfile(data) will now work perfectly
            setProfile(data);

            setMessage({ type: 'success', text: 'IDENTITY_UPDATED_SUCCESSFULLY' });
        } catch {
            setMessage({ type: 'error', text: 'SYNC_FAILED_CHECK_CONNECTION' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 py-10">
            <header>
                <h1 className="text-3xl font-bold text-white tracking-tight">Profile Settings</h1>
                <p className="text-slate-500 mt-2 font-mono text-[10px] uppercase tracking-widest">
                    Authorized_as: {profile.role} // {profile.email}
                </p>
            </header>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message.text && (
                        <div className={`p-4 rounded-xl text-[10px] font-black border ${
                            message.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">First Name</label>
                            <input
                                type="text"
                                value={formData.firstName || ''}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Name</label>
                            <input
                                type="text"
                                value={formData.lastName || ''}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Professional Bio</label>
                        <textarea
                            rows={4}
                            value={formData.bio || ''}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none font-sans"
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-xl transition-all"
                        >
                            {isSaving ? 'SYNCING...' : 'SAVE_CHANGES'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;