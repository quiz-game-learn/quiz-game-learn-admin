import {User} from "firebase";

export const setUser = ({commit}: any, user: User) => {
        commit('setUserMutation',user)
}
