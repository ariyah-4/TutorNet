import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Question {
    text: string;
    options: string[];
    correctOptionIndex: number;
}

const CreateQuiz = () => {
    const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([
        { text: '', options: ['', '', '', ''], correctOptionIndex: 0 }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], correctOptionIndex: 0 }]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestionText = (index: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = text;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lessonId) return;

        try {
            await api.createQuiz(lessonId, { title, questions } as any);
            alert("Quiz created successfully!");
            navigate(`/course/${courseId}`);
        } catch (err) {
            console.error("Failed to create quiz", err);
            alert("Error creating quiz.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-white mb-8">Create Lesson Quiz</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Quiz Title */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <label className="block text-slate-400 text-sm font-bold mb-2 uppercase">Quiz Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Mid-term Knowledge Check"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                {/* Questions List */}
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-slate-900 p-6 rounded-xl border border-slate-800 relative">
                        <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-500"
                        >
                            Remove Question
                        </button>

                        <label className="block text-slate-400 text-sm font-bold mb-2 uppercase">Question {qIndex + 1}</label>
                        <input
                            type="text"
                            value={q.text}
                            onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white mb-6 focus:outline-none focus:border-blue-500"
                            placeholder="Enter the question text..."
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
                                    <input
                                        type="radio"
                                        name={`correct-${qIndex}`}
                                        checked={q.correctOptionIndex === oIndex}
                                        onChange={() => {
                                            const newQuestions = [...questions];
                                            newQuestions[qIndex].correctOptionIndex = oIndex;
                                            setQuestions(newQuestions);
                                        }}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                        placeholder={`Option ${oIndex + 1}`}
                                        className="bg-transparent w-full text-white focus:outline-none"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center pt-6">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
                    >
                        + Add Another Question
                    </button>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 text-slate-400 font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
                        >
                            Save Quiz
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;