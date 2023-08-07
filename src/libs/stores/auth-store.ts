import serviceAuth from '@services/auth';
import { create } from 'zustand'

type AuthStore = {
    user: UserSimpleInfo | null;
    isAuth: boolean;
    isDone: boolean;
    isCompleted: boolean;
    isErrored: boolean;
    setAuth: (user: UserSimpleInfo) => void;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    fetchUser: () => Promise<UserSimpleInfo | null>;
    // Popup auth
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const authStore = create<AuthStore>()((set, get) => ({
    user: null,
    isAuth: false,
    isCompleted: false,
    isDone: false,
    isErrored: false,
    isOpen: false,
    refresh: async () => {
        const state = { ...get() };

        try {
            await serviceAuth.authVerifyToken();
            // First time
            if (!state.isAuth) {
                state.user = await state.fetchUser();
            }
            state.isAuth = true;
            state.isCompleted = true;
            state.isErrored = false

        } catch (err) {
            state.user = null
            state.isAuth = false;
            state.isErrored = true;
            state.isCompleted = false;
        }
        state.isDone = true;
        set(state)
    },
    fetchUser: async () => {
        try {
            const res = await serviceAuth.authGetMe();
            return res.data.data as UserSimpleInfo
        } catch {
            return null
        }
    },
    setAuth: (user: UserSimpleInfo) => set((state) => {
        return {
            ...state,
            user,
            isAuth: true,
            isDone: true,
            isCompleted: true,
            isErrored: false
        };
    }),
    logout: async () => {
        await serviceAuth.authLogout();
        set((state) =>
        ({
            ...state,
            user: null,
            isAuth: false,
            isDone: true,
            isCompleted: false,
            isErrored: false
        }))
    },
    onOpen: () => set(state => {
        return {
            ...state,
            isOpen: true
        }
    }),
    onClose: () => set(state => {
        return {
            ...state,
            isOpen: false
        }
    })
}));
