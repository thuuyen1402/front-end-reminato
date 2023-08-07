import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { TestChildComponent } from "__mocks__/fake/test-component"
import { BackToTop } from "../../../src/components/back-to-top"

describe("Components back to top button", () => {
    it("Contain elements", async () => {
        render(
            <TestChildComponent>
                <BackToTop />
            </TestChildComponent>)
        expect(await screen.findByRole("button")).toBeInTheDocument();
    })

    it("Trigger scroll to on click", async () => {

        const mockScrollToSpy = vi.spyOn(window, "scrollTo")
        render(
            <TestChildComponent>
                <BackToTop />
            </TestChildComponent>)
        const button = await screen.findByRole("button")
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        await waitFor(() => {
            expect(mockScrollToSpy).toBeCalled()
        })

    })

})