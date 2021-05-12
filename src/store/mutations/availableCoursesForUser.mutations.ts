import {State} from "../../models/State";
import {Quiz} from "../../models/Quiz";

export const setAvailableCoursesForUserMutation = (state: State, quizes: Quiz[]) => {
    state.availableCoursesForUser = quizes
}
