import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const SubmitAssignment = () => {
    const { lessonId, courseId } = useParams<{ lessonId: string; courseId: string }>();
    const navigate = useNavigate();

    // Data States
    const [instructions, setInstructions] = useState('');
    const [content, setContent] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Status States
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadPageData = async () => {
            if (!lessonId) return;
            try {
                // 1. Fetch Lesson/Instructions (This MUST succeed)
                const lessonRes = await api.getLesson(lessonId);
                const lessonData = lessonRes.data;
                setInstructions(
                    lessonData.assignment?.instructions ||
                    "No specific instructions provided for this assignment."
                );

                // 2. Fetch Existing Submission (Optional: Don't let this crash the page)
                try {
                    const submissionRes = await api.getMySubmission(lessonId);
                    // 204 means success but no content; 200 means we found something
                    if (submissionRes.status === 200 && submissionRes.data) {
                        setContent(submissionRes.data.content);
                        setIsEditMode(true);
                    }
                } catch (subErr) {
                    // We log this but DON'T trigger the error UI
                    console.warn("Note: Could not fetch previous submission (likely none exists yet).");
                    console.log(subErr);
                }

            } catch (err) {
                console.error("Critical error loading assignment details:", err);
                setInstructions("Could not load assignment details. Please try refreshing the page.");
            } finally {
                setIsLoading(false);
            }
        };
        loadPageData();
    }, [lessonId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() || !lessonId) return;

        setIsSubmitting(true);
        try {
            await api.submitAssignment(lessonId, content);
            alert(isEditMode ? "Your work has been updated!" : "Success! Your work has been submitted.");
            navigate(`/course/${courseId}/lesson/${lessonId}`);
        } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to submit work. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="font-medium">Fetching your work...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 mt-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-400 hover:text-white transition-colors mb-6 group"
            >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                Back to Lesson
            </button>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <h1 className="text-2xl font-bold text-white">
                        {isEditMode ? 'Update Assignment' : 'Assignment Submission'}
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Review the requirements and submit your response below.</p>
                </div>

                <div className="p-6 space-y-8">
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Instructions</h2>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl text-slate-300 leading-relaxed italic">
                            {instructions}
                        </div>
                    </section>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Your Response</h2>
                        </div>

                        <textarea
                            className="w-full h-72 bg-slate-950 text-slate-200 p-5 rounded-xl border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none text-lg leading-relaxed placeholder:text-slate-600"
                            placeholder="Type your response or paste your project link here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isSubmitting}
                        />

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                            <p className="text-xs text-slate-500">
                                {content.trim().length > 0 ? `${content.length} characters` : 'Ready to submit?'}
                            </p>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !content.trim()}
                                    className={`relative flex items-center gap-2 px-8 py-3 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                                        isSubmitting || !content.trim()
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        isEditMode ? 'Update Work' : 'Submit Assignment'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitAssignment;