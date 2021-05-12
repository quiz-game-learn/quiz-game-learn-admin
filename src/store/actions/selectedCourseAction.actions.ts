import {Quiz} from "../../models/Quiz";
import {getQuizzesAvailable} from "@/services/dbService";
import {Course} from "@/models/Course";

export const setSelectedCourseAction = ({commit}: any, selectedQuiz: Course) => {
    commit('setSelectedCourseAction',selectedQuiz)
}
