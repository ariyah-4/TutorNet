import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type {Quiz, QuizGradeResponse, QuizSubmissionRequest} from '../types';

const TakeQuiz = () => {
    const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [result, setResult] = useState<QuizGradeResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!lessonId) return;
            try {
                const response = await api.getQuizByLesson(lessonId);
                setQuiz(response.data);
            } catch (err) {
                console.error("Failed to fetch quiz", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [lessonId]);

    const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
        if (result) return; // Prevent changing answers after submission
        setSelectedAnswers({ ...selectedAnswers, [questionIndex]: optionIndex });
    };

    const handleSubmit = async () => {
        if (!quiz || !lessonId) return;

        const submission: QuizSubmissionRequest = {
            selectedOptions: quiz.questions.map((_, i) => selectedAnswers[i] ?? -1)
        };

        try {
            // Change this line:
            const response = await api.submitQuiz(lessonId, submission);
            setResult(response.data); // <--- Access .data here
        } catch (err) {
            console.error("Submission failed", err);
            alert("Error submitting quiz.");
        }
    };

    if (loading) return <div className="text-center p-10 text-slate-400">Loading Quiz...</div>;
    if (!quiz) return <div className="text-center p-10 text-red-400">Quiz not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{quiz.title}</h2>
                    <p className="text-slate-400 max-w-md">{quiz.description}</p>
                </div>
                {result && (
                    <div className="text-right bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-2xl">
                        <div className="text-4xl font-black text-blue-500">{result.score}%</div>
                        <div className="text-xs uppercase text-slate-500 font-bold tracking-widest mt-1">
                            {result.correctAnswers} / {result.totalQuestions} Correct
                        </div>
                    </div>
                )}
            </div>

            {/* Success/Feedback Message */}
            {result && (
                <div className="mb-8 p-4 bg-blue-600/10 border border-blue-500/50 rounded-xl text-blue-100 text-center">
                    {result.message}
                </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
                {quiz.questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                        <p className="text-lg text-white mb-6 font-medium">
                            <span className="text-slate-500 mr-3">0{qIndex + 1}</span> {q.text}
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            {q.options.map((option, oIndex) => {
                                const isSelected = selectedAnswers[qIndex] === oIndex;
                                return (
                                    <button
                                        key={`${q.id}-${oIndex}`}
                                        onClick={() => handleOptionSelect(qIndex, oIndex)}
                                        disabled={!!result}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                                            isSelected
                                                ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            isSelected ? 'border-blue-500' : 'border-slate-600'
                                        }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                        </div>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-12 flex justify-center pb-20">
                {!result ? (
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                        className="bg-blue-600 disabled:opacity-30 disabled:grayscale hover:bg-blue-700 text-white px-20 py-4 rounded-2xl font-bold text-lg transition-all"
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(`/course/${courseId}`)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-20 py-4 rounded-2xl font-bold text-lg border border-slate-700"
                    >
                        Continue to Course
                    </button>
                )}
            </div>
        </div>
    );
};

export default TakeQuiz;