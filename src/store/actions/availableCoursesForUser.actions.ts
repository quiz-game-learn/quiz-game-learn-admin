import {Quiz} from "../../models/Quiz";
import {getCoursesAvailable, getQuizzesAvailable} from "@/services/dbService";
import {Course} from "@/models/Course";

export const setAvailableCoursesForUser = ({commit}: any) => {
    getCoursesAvailable(1000,0).then((courses: Course[]) => {
        console.log(courses)
        commit('setAvailableCoursesForUserMutation',courses)
    })
}
