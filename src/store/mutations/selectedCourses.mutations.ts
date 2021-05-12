import {State} from "../../models/State";
import {Course} from "@/models/Course";

export const setSelectedCourseMutation = (state: State, selectedQuiz: Course) => {
    state.selectedCourse = selectedQuiz
}
