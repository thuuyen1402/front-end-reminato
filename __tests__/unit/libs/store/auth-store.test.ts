import { describe, expect, it, vi } from 'vitest';
import { authStore } from '@stores/auth-store';
import { act, renderHook } from "@testing-library/react";
import { fakeUserData } from '__mocks__/fake/user';
import api from '@utils/api';
import { AxiosError } from 'axios';


describe('Libs/store Auth store', () => {

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('Set auth ', async () => {
        const { result } = renderHook(() => authStore());
        act(() => {
            result.current.setAuth(fakeUserData);
        })

        expect(result.current).toMatchObject({
            user: fakeUserData,
            isAuth: true,
            isDone: true,
            isCompleted: true,
            isErrored: false
        });
    });

    it('Fetch user', async () => {
        vi.mocked(api.get).mockResolvedValue({
            data: {
                data: fakeUserData,
                message: "Success",
            },
        })
        const { result } = renderHook(() => authStore());

        const res = await result.current.fetchUser();

        expect(res).toMatchObject(fakeUserData);

    });

    it('Refresh have auth', async () => {
        // Mock refresh verify token
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: true,
                message: "Success",
            },
        })
        // Mock get user me
        vi.mocked(api.get).mockResolvedValueOnce({
            data: {
                data: fakeUserData,
                message: "Success",
            },
        })


        const { result } = renderHook(() => authStore());

        await act(async () => {
            await result.current.refresh();
        })


        expect(result.current).toMatchObject({
            isErrored: false,
            isAuth: true,
            isCompleted: true,
            isDone: true,
            user: fakeUserData,
        });

    });
    it('Refresh haven`t auth', async () => {
        // Mock refresh verify token
        vi.mocked(api.get).mockRejectedValue(new AxiosError("Internal server error"))

        const { result } = renderHook(() => authStore());

        await act(async () => {
            await result.current.refresh();
        })

        expect(result.current).toMatchObject({
            isErrored: true,
            isAuth: false,
            isCompleted: false,
            isDone: true,
            user: null,
        });
    });

    it('Logout', async () => {
        // Mock refresh verify token
        vi.mocked(api.put).mockResolvedValue({
            data: {
                message: "Success",
            },
        })

        const { result } = renderHook(() => authStore());

        await act(async () => {
            await result.current.logout();
        })

        expect(result.current).toMatchObject({
            isErrored: false,
            isAuth: false,
            isCompleted: false,
            isDone: true,
            user: null,
        });
    });

    it("Closing auth popup", () => {
        const { result } = renderHook(() => authStore());

        act(() => {
            result.current.onClose()
        })

        expect(result.current).toMatchObject({
            isOpen: false
        });
    })

    it("Opening auth popup", () => {
        const { result } = renderHook(() => authStore());

        act(() => {
            result.current.onOpen()
        })

        expect(result.current).toMatchObject({
            isOpen: true
        });
    })

})



