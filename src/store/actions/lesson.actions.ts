import {getLessonsAvailable, getLessonsInCourse, getQuizzesAvailable} from "@/services/dbService";
import {Lesson} from "@/models/Lessons";

export const setLessons = ({commit}: any) => {
    getLessonsAvailable(1000,0).then((lessons: Lesson[]) => {
        console.log(lessons)
        commit('setLessonsMutation',lessons)
    })
}

export const setLessonsInCourse = ({commit}: any, courseId: string) => {
    getLessonsInCourse(1000,0, courseId).then((lessons: Lesson[]) => {
        console.log(lessons)
        commit('setLessonsMutation',lessons)
    })
}
