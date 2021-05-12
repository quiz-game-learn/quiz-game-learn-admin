import {Quiz} from "./Quiz";

export interface Lesson {
    id: string,
    type: string,
    index: number,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    description: string,
    frontImage: string,
    subtitle: string,
    parts: Part[],
    difficultyPercent: number,
    initialQuiz: Quiz,
    finalQuiz: Quiz,
    quizzes: Quiz[],
    public: boolean,
    courseId: string,
    imageUrl: string,
    date: Date
}

export interface Part {
    id: string,
    lessonId: string,
    title: string,
    subtitle: string,
    content: string,
    partNumber: number,
    headImageUrl: string,
}