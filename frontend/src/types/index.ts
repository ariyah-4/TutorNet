/**
 * TutorNet Type Definitions
 * Mirroring api-docs_3.json schemas for end-to-end type safety.
 */

// --- Profile & Identity ---

export interface Profile {
    id: string; // uuid
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
    role: 'LEARNER' | 'TUTOR';
    updatedAt: string; // date-time string
}

// --- Course & Curriculum ---

export interface Course {
    id: string; // uuid
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    difficulty: string;
    createdAt: string; // date-time string
    tutor: Profile;
}

export interface Lesson {
    id: string;
    title: string;
    content: string;
    orderIndex: number;
    course?: Course;

    assignment?: Assignment;
    quiz?: Quiz;
}

// --- Assessments (Quizzes & Assignments) ---

export interface Question {
    id: string; // uuid
    text: string;
    options: string[];
    correctOptionIndex: number;
}

export interface Quiz {
    id: string; // uuid
    title: string;
    description: string;
    lesson: Lesson;
    questions: Question[];
}

export interface QuizSubmissionRequest {
    selectedOptions: number[];
}

export interface QuizGradeResponse {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    message: string;
}

export interface Assignment {
    id: string; // uuid
    title: string;
    instructions: string;
    lesson: Lesson;
}

// --- Relationships & Communication ---

export interface Enrollment {
    id: number; // int64
    learner: Profile;
    course: Course;
    enrolledAt: string; // date-time string
}

export interface Announcement {
    id: string; // uuid
    title: string;
    content: string;
    createdAt: string; // date-time string
    course: Course;
}