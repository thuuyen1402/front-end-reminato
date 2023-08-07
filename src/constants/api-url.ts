export const API_URL = {
    AUTH: {
        SIGN_IN: "/account/sign-in",
        LOGOUT: "/account/logout",
        VERIFY: {
            TOKEN: "/verify/token"
        },
        USER: {
            ME: "/account/me"
        }
    },
    VIDEO: {
        SHARE: "/videos/sharing",
        VIDEOS: {
            GETS: "/videos",
            VOTE: (id: string) => `/videos/${id}/vote`
        }
    }
}