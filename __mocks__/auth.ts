import api from "@utils/api";
import { fakeUserData } from "./fake/user";
import { act, renderHook } from "@testing-library/react";
import { authStore } from "@stores/auth-store";

export const mockAuth = vi.fn(async (fakeData: typeof fakeUserData = fakeUserData) => {
    vi.mocked(api.get).mockResolvedValueOnce({
        data: {
            data: true,
            message: "Success",
        },
    })
    // Mock get user me
    vi.mocked(api.get).mockResolvedValueOnce(
        {
            data: {
                data: fakeData,
                message: "Success",
            },
        }
    )

    const { result } = renderHook(() => authStore());
    await act(async () => {
        await result.current.refresh();
    })
 

    return result
})