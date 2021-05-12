import {State} from "../../models/State";
import {Quiz} from "../../models/Quiz";
import {Lesson} from "@/models/Lessons";

export const setLessonsMutation = (state: State, lessons: Lesson[]) => {
    state.lessons = lessons
}
