import Vue from 'vue'
import Vuex from 'vuex'
import {State} from "../models/State";
import {setSelectedCourseMutation} from "@/store/mutations/selectedCourses.mutations";
import {setSelectedCourseAction} from "@/store/actions/selectedCourseAction.actions";
import {setAvailableCoursesForUser} from "@/store/actions/availableCoursesForUser.actions";
import {setAvailableCoursesForUserMutation} from "@/store/mutations/availableCoursesForUser.mutations";
import {setUserMutation, setUserSettingsMutation} from "@/store/mutations/user.mutations";
import {setUser, setUserSettings} from "@/store/actions/user.actions";
import {setLessonsMutation} from "@/store/mutations/lesson.mutations";
import {setLessons, setLessonsInCourse} from "@/store/actions/lesson.actions";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        selectedCourse: null,
        answers: [],
        status: null,
        lessons: null,
        user: null,
        userSettings: null,
        availableCoursesForUser: null
    } as State,
    mutations: {
        setSelectedQuizzMutation: setSelectedCourseMutation,
        setUserMutation: setUserMutation,
        setUserSettingsMutation: setUserSettingsMutation,
        setLessonsMutation: setLessonsMutation,
        setAvailableCoursesForUserMutation: setAvailableCoursesForUserMutation,
    },
    actions: {
        setLessonsInCourse: setLessonsInCourse,
        setSelectedQuizAction: setSelectedCourseAction,
        setUser: setUser,
        setUserSettings: setUserSettings,
        setLessons: setLessons,
        setAvailableCoursesForUser: setAvailableCoursesForUser,
    },
    modules: {}
})

