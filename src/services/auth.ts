import { API_URL } from "../constants/api-url";
import api from "@utils/api";

export type AuthSignIn = {
    data: {
        email: string;
        password: string
    }
}

async function authSignIn(ctx: AuthSignIn) {
    return await api.post(API_URL.AUTH.SIGN_IN, ctx.data)
}

async function authLogout() {
    return await api.put(API_URL.AUTH.LOGOUT, {})
}

async function authVerifyToken() {
    return await api.get(API_URL.AUTH.VERIFY.TOKEN)
}

async function authGetMe() {
    return await api.get(API_URL.AUTH.USER.ME)
}

export default {
    authSignIn,
    authLogout,
    authVerifyToken,
    authGetMe,
}