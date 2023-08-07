import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockAuth } from '__mocks__/auth';
import { describe, expect, it, vi } from 'vitest';
import { fakeUserData } from '__mocks__/fake/user';
import { BrowserRouter } from 'react-router-dom'
import toast from 'react-hot-toast';
import serviceVideo from '@services/video';
import { SharingPage } from '@pages/video/sharing';
import { faker } from '@faker-js/faker';
import { fakeVideoSharing } from '__mocks__/fake/video';
vi.mock("@services/video")

describe('Pages/video/sharing Sharing video page', () => {

    afterEach(() => {
        vi.restoreAllMocks();
    })

    it("Not contain elements", async () => {
        const { container } = render(<SharingPage />, { wrapper: BrowserRouter });
        expect(container).toBeEmptyDOMElement()
    });

    it("Contain elements", async () => {
        await mockAuth(fakeUserData);
        render(<SharingPage />, { wrapper: BrowserRouter });
        expect(await screen.findByText("Share a youtube movie")).toBeInTheDocument();
        expect(await screen.findByText("Youtube URL:")).toBeInTheDocument();
        expect(await screen.findByPlaceholderText("url")).toBeInTheDocument();
        expect(await screen.findByText("Share")).toBeInTheDocument();
    });

    it('Sharing video success', async () => {
        const mockedToastSuccess = vi.spyOn(toast, "success");
        await mockAuth(fakeUserData);

        render(<SharingPage />, { wrapper: BrowserRouter });

        // Check exist
        const urlInput = await screen.findByPlaceholderText(/url/i);

        expect(urlInput).toBeInTheDocument()

        // Change great input
        const url = faker.internet.url()
        fireEvent.change(urlInput, { target: { value: url } });


        const submitButton = await await screen.findByText("Share")
        expect(submitButton).toBeInTheDocument();

        const callRequest = vi.mocked(serviceVideo.videoSharing).mockImplementationOnce((
        ) => {
            return {
                data: {
                    data: fakeVideoSharing
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
        })



        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(callRequest).toBeCalled();
            expect(mockedToastSuccess).toBeCalledWith("Sharing video success, your video will notify to the others")
        })

    });

    it('Validated submitted', async () => {
        const mockedToastError = vi.spyOn(toast, "error");
        await mockAuth(fakeUserData);
        const callRequest = vi.mocked(serviceVideo.videoSharing).mockImplementationOnce((
        ) => {
            throw new Error("Internal server erro")
        })

        render(<SharingPage />, { wrapper: BrowserRouter });


        const urlInput = await screen.findByPlaceholderText(/url/i);

        expect(urlInput).toBeInTheDocument()

        const submitButton = await await screen.findByText("Share")
        expect(submitButton).toBeInTheDocument();



        // Empty url
        let url = ""//
        fireEvent.change(urlInput, { target: { value: url } });

        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockedToastError).toBeCalled();
            expect(callRequest).not.toBeCalled();
        })

        // Not is url
        url = faker.lorem.sentence()
        fireEvent.change(urlInput, { target: { value: url } });

        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockedToastError).toBeCalled();
            expect(callRequest).not.toBeCalled();
        })

        // Server error
        url = faker.internet.url()
        fireEvent.change(urlInput, { target: { value: url } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockedToastError).toBeCalled();
            expect(callRequest).toBeCalled()
        })



        // // Missing email
        // fireEvent.change(emailInput, { target: { value: fakeLoginData } });
        // fireEvent.change(passwordInput, { target: { value: fakeLoginData.password } });
        // fireEvent.click(submitButton);
        // await waitFor(() => {
        //     expect(mockedToastError).toBeCalled()
        // })

        // // Missing password
        // fireEvent.change(emailInput, { target: { value: fakeLoginData.email } });
        // fireEvent.change(passwordInput, { target: { value: "" } });
        // fireEvent.click(submitButton);
        // await waitFor(() => {
        //     expect(mockedToastError).toBeCalled()
        // })

        // // Request error
        // const mockRequest = vi.mocked(serviceAuth.authSignIn).mockImplementationOnce(() => {
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     return new AxiosError("Internal server error") as any
        // })

        // fireEvent.change(emailInput, { target: { value: fakeLoginData.email } });
        // fireEvent.change(passwordInput, { target: { value: fakeLoginData.password } });
        // fireEvent.click(submitButton);
        // await waitFor(() => {
        //     expect(mockedToastError).toBeCalled();
        //     expect(mockRequest).toBeCalled()
        // })

        // const callRequest = vi.mocked(serviceVideo.videoSharing).mockImplementationOnce((
        //     ) => {
        //         return {
        //             data: {
        //                 data: fakeVideoSharing
        //             }
        //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //         } as any
        //     })
    });

})

