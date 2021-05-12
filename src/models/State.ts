import {Quiz} from "./Quiz";
import {Lesson} from "./Lessons";
import {User, UserInfo} from "firebase";
import {Course} from "@/models/Course";
import {UserSettings} from "@/models/User";

export interface State {
    selectedCourse: Course | null,
    availableCoursesForUser: Quiz[] | null,
    answers: Answer[],
    status: string | null
    user: User | null
    userFirebase?: UserInfo | null
    lessons: Lesson[] | null
    userSettings: UserSettings | null
}

export interface Answer {
    questionId: string
    questionNumber: string
    answer: string
    correct:boolean
}
