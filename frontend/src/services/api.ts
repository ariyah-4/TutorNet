import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import type {
    Profile,
    Course,
    Enrollment,
    Announcement,
    Lesson,
    Quiz,
    QuizSubmissionRequest,
    QuizGradeResponse,
    Assignment
} from '../types';

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Interceptor to inject the JWT into every request for bearerAuth
apiClient.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export const api = {
    // --- Profile Management ---
    getProfile: () => apiClient.get<Profile>('/profiles/me'),
    updateProfile: (data: Profile) => apiClient.put<Profile>('/profiles/me', data),
    becomeTutor: () => apiClient.post<Profile>('/profiles/become-tutor'),

    // --- Course Discovery & Management ---
    getAllCourses: () => apiClient.get<Course[]>('/courses'),
    createCourse: (data: Course) => apiClient.post<Course>('/courses', data),
    getMyLearning: () => apiClient.get<Enrollment[]>('/courses/my-learning'),
    getMyCourses: () => apiClient.get<Course[]>('/courses/my-courses'),
    enroll: (courseId: string) => apiClient.post<Enrollment>(`/courses/${courseId}/enroll`),
    getCourseProgress: (courseId: string) => apiClient.get<Record<string, object>>(`/courses/${courseId}/progress`),

    // --- Lessons ---
    getLessonsForCourse: (courseId: string) => apiClient.get<Lesson[]>(`/courses/${courseId}/lessons`),
    createLesson: (courseId: string, data: Lesson) => apiClient.post<Lesson>(`/courses/${courseId}/lessons`, data),
    completeLesson: (lessonId: string) => apiClient.post<string>(`/lessons/${lessonId}/complete`),
    markLessonIncomplete: (lessonId: string) => apiClient.post<string>(`/lessons/${lessonId}/incomplete`),
    updateLesson: (lessonId: string, data: Partial<Lesson>) => apiClient.put<Lesson>(`/lessons/${lessonId}`, data),
    deleteLesson: (lessonId: string) => apiClient.delete(`/lessons/${lessonId}`),
    getLesson: (lessonId: string) =>
        apiClient.get<Lesson>(`/lessons/${lessonId}`),

    // --- Quizzes ---
    createQuiz: (lessonId: string, data: Quiz) => apiClient.post<Quiz>(`/lessons/${lessonId}/quiz`, data),
    getQuizByLesson: (lessonId: string) =>
        apiClient.get<Quiz>(`/lessons/${lessonId}/quiz`),
    submitQuiz: (lessonId: string, data: QuizSubmissionRequest) =>
        apiClient.post<QuizGradeResponse>(`/quizzes/${lessonId}/submit`, data),

    // --- Assignments ---
    getAssignmentByLesson: (lessonId: string) => apiClient.get<Assignment>(`/lessons/${lessonId}/assignment`),
    createAssignment: (lessonId: string, data: Assignment) =>
        apiClient.post<Assignment>(`/lessons/${lessonId}/assignment`, data),
    submitAssignment: (lessonId: string, content: string) =>
        apiClient.post(`/assignments/${lessonId}/submit`, { content }),

    // --- Submissions ---
    getMySubmission: (lessonId: string) =>
        apiClient.get(`/assignments/${lessonId}/my-submission`),

    // --- Announcements ---
    getAnnouncements: (courseId: string) => apiClient.get<Announcement[]>(`/courses/${courseId}/announcements`),
    createAnnouncement: (courseId: string, data: Announcement) =>
        apiClient.post<Announcement>(`/courses/${courseId}/announcements`, data),
};