import { routerConfig } from '@router/index'
import { screen, render } from '@testing-library/react'
import { mockAuth } from '__mocks__/auth'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'


describe("Main", () => {

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("Runnable home page", () => {

        const router = createMemoryRouter(routerConfig, {
            initialEntries: ["/"],
        });
        const { container } = render(
            <RouterProvider router={router} />
        )

        expect(container).not.toBeEmptyDOMElement()
    })

    it("Runnable sharing video page", async () => {
        await mockAuth()
        const routers = createMemoryRouter(routerConfig, {
            initialEntries: ["/video/sharing"],
        });

        const { container } = render(
            <RouterProvider router={routers} />
        )
        expect(container).not.toBeEmptyDOMElement();
    })

    it("404", async () => {
        const routers = createMemoryRouter(routerConfig, {
            initialEntries: ["/any-url-not-exist"],
        });

        render(
            <RouterProvider router={routers} />
        )

        expect(await screen.findByText("404")).toBeInTheDocument()
    })
})