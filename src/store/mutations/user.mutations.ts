import {State} from "../../models/State";
import {User} from "firebase";
import {UserSettings} from "@/models/User";

export const setUserMutation = (state: State, user: User) => {
    state.user = user
}

export const setUserSettingsMutation = (state: State, user: UserSettings) => {
    state.userSettings = user
}