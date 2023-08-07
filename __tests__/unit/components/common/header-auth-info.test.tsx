import { act, fireEvent, render, screen } from '@testing-library/react';
import { mockAuth } from '__mocks__/auth';
import { describe, expect, it, vi } from 'vitest';
import { HeaderAuthInfo } from '@components';
import { fakeUserData } from '__mocks__/fake/user';
import { BrowserRouter } from 'react-router-dom'
import toast from 'react-hot-toast';

const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
    ...(await vi.importActual("react-router-dom")) as Obj<unknown>,

    useNavigate: () => mockedUsedNavigate
}));


describe('Components/common header auth info', () => {

    afterAll(() => {
        vi.restoreAllMocks()
    })

    it("Not Signed-in", async () => {
        const { container } = render(<HeaderAuthInfo />, { wrapper: BrowserRouter });
        expect(container).toBeEmptyDOMElement();
    });

    it('Signed-in info', async () => {
        await mockAuth(fakeUserData);
        render(<HeaderAuthInfo />, { wrapper: BrowserRouter });
        expect(await screen.findByText(fakeUserData.email)).toBeInTheDocument()

    });

    it('Clicked logout button', async () => {
        await mockAuth(fakeUserData);
        render(<HeaderAuthInfo />, { wrapper: BrowserRouter });

        // Check Sign out button exist
        const signOutButton = await screen.queryAllByTestId("sign-out")
        expect(signOutButton.length).gt(0);

        const mockedToastSuccess = vi.spyOn(toast, "success")
        await act(async () => {
            for (const button of signOutButton) {
                await fireEvent.click(button);
            }
        })

        // Check sign out can callable 
        expect(mockedToastSuccess).toHaveBeenCalledTimes(signOutButton.length)

    });

    it('Clicked sharing button', async () => {
        await mockAuth(fakeUserData);
        render(<HeaderAuthInfo />, { wrapper: BrowserRouter });

        // Check Sharing button exist
        const videoShareButton = await screen.queryAllByTestId("sharing")
        expect(videoShareButton.length).gt(0);

        await act(async () => {
            for (const button of videoShareButton) {
                await fireEvent.click(button);
            }
        })

        expect(mockedUsedNavigate).toHaveBeenCalledTimes(videoShareButton.length)

    });

})