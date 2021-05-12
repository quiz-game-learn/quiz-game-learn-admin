import {State} from "../../models/State";
import {User} from "firebase";

export const setUserMutation = (state: State, user: User) => {
    state.user = user
}
