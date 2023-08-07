import { mockAuth } from "__mocks__/auth"
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { ProtectedRoute } from "@router/protected";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { authStore } from "@stores/auth-store";


describe("Components/router protected", () => {
    afterAll(() => {
        vi.restoreAllMocks()
    })

    it("Render children", async () => {
        await mockAuth();
        render(<ProtectedRoute >
            RENDER
        </ProtectedRoute>, { wrapper: BrowserRouter })
        expect(await screen.findByText("RENDER")).toBeInTheDocument()
    })
    it("Not render children", async () => {
        const { result } = renderHook(() => authStore())
        render(
            <MemoryRouter initialEntries={["/sharing/video"]}>
                <ProtectedRoute >
                    RENDER
                </ProtectedRoute>
            </MemoryRouter>)
        expect((await screen.queryAllByText("RENDER")).length).toBe(0);

        expect(result.current.isAuth).toBe(false)
        await waitFor(() => {
            expect(window.location.pathname).toBe("/")
        })
    })
})