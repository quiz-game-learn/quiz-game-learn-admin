import {User} from "firebase";
import {UserSettings} from "@/models/User";

export const setUser = ({commit}: any, user: User) => {
        commit('setUserMutation',user)
}

export const setUserSettings = ({commit}: any, userSettings: UserSettings) => {
        commit('setUserSettingsMutation',userSettings)
}