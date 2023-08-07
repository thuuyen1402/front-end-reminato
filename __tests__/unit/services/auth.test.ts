import { getError } from '@utils/error'
import api from "@utils/api";
import { afterEach, describe, expect, it, vi } from 'vitest';
import serviceAuth from '@services/auth';
import { fakeCookie, fakeLoginData, fakeUserData } from '__mocks__/fake/user';


describe('Service auth sign in', () => {

    afterEach(() => {
        vi.restoreAllMocks()
    })


    it('Sign in', async () => {
        const resolveData = {
            access_token: fakeCookie.jwt,
            refresh_token: fakeCookie.rs,
            user: fakeUserData,
        }
        vi.mocked(api.post).mockResolvedValue({
            data: {
                data: resolveData
            },
        })

        try {
            const res = await serviceAuth.authSignIn({
                data: fakeLoginData
            })

            expect(res.data).toMatchObject(resolveData)
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }

    });

    it("Get user me", async () => {
        vi.mocked(api.get).mockResolvedValue({
            data: {
                data: fakeUserData,
                message: "Success",
            },
        });

        try {
            const res = await serviceAuth.authGetMe();
            expect(res.data?.data).toBe(fakeUserData)
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }
    })

    it("Verify token", async () => {
        vi.mocked(api.get).mockResolvedValue({
            data: {
                data: true,
                message: "Success",
            },
        })

        try {
            const res = await serviceAuth.authVerifyToken();
            expect(res.data?.data).toBe(true)
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }

    })

    it("Logout", async () => {
        vi.mocked(api.put).mockResolvedValue({
            data: {
                message: "Success",
            },
        })

        try {
            const res = await serviceAuth.authLogout();
            expect(res.data.message).toBe("Success")
        } catch (err) {
            expect(getError(err)).toBeTypeOf("string")
        }

    })
})

/* Fake data */

