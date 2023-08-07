import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import { mockAuth } from '__mocks__/auth';
import { describe, expect, it, vi } from 'vitest';
import { fakeLoginData, fakeUserData } from '__mocks__/fake/user';
import { BrowserRouter } from 'react-router-dom'
import toast from 'react-hot-toast';
import { ModalLogin } from '../../../../src/components/modal/modal-login';
import { authStore } from '@stores/auth-store';
import serviceAuth from '@services/auth';
import { AxiosError } from 'axios';
vi.mock("@services/auth")


describe('Components/modal modal login', () => {

    afterEach(() => {
        vi.restoreAllMocks();
    })

    it("Signed-in and not contain any element", async () => {
        await mockAuth(fakeUserData);
        const { container } = render(<ModalLogin />, { wrapper: BrowserRouter });
        expect(container).toBeEmptyDOMElement()
    });
    // const { getByPlaceholderText, getByText } = render(<App />);
    // const deviceNameInput = getByPlaceholderText(/device name/i);

    it('Container elements', async () => {
        const { result } = renderHook(() => authStore());

        render(<ModalLogin />, { wrapper: BrowserRouter });
        expect(await screen.findByTestId("modal-login")).toBeInTheDocument()

        // Opening modal
        act(() => {
            result.current.onOpen()
        })
        expect(await screen.findByPlaceholderText(/email/i)).toBeInTheDocument()
        expect(await screen.findByPlaceholderText(/password/i)).toBeInTheDocument()
        expect(await screen.findByRole("button", {
            name: /Close/i
        })).toBeInTheDocument()
        expect(await screen.findByLabelText("login-button-mobile")).toBeInTheDocument()

    });

    it('Open modal', async () => {
        const { result } = renderHook(() => authStore());
        const spyOnOpen = vi.spyOn(result.current, "onOpen")


        render(<ModalLogin />, { wrapper: BrowserRouter });

        const button = await screen.findByTestId("modal-login");
        fireEvent.click(button);

        expect(spyOnOpen).toBeCalled();
    })

    it('Close modal', async () => {
        const { result } = renderHook(() => authStore());

        render(<ModalLogin />, { wrapper: BrowserRouter });

        act(() => {
            result.current.onOpen()
        })

        const button = await screen.findByRole("button", {
            name: /Close/i
        })

        expect(button).toBeInTheDocument();
        fireEvent.click(button);

        expect(result.current.isOpen).toBe(false);
    });

    it('Submit login success', async () => {

        const { result } = renderHook(() => authStore());

        render(<ModalLogin />, { wrapper: BrowserRouter });

        act(() => {
            result.current.onOpen()
        })

        const emailInput = await screen.findByPlaceholderText(/email/i);
        const passwordInput = (await screen.findByPlaceholderText(/password/i))
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()

        // Change great input

        fireEvent.change(emailInput, { target: { value: fakeLoginData.email } });
        fireEvent.change(passwordInput, { target: { value: fakeLoginData.password } });


        const submitButton = await screen.findByLabelText("login-button-mobile")
        expect(submitButton).toBeInTheDocument();

        const callRequest = vi.mocked(serviceAuth.authSignIn).mockImplementationOnce(() => {
            return {
                data: {
                    data: {
                        user: fakeUserData
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
        })

        const mockedToastSuccess = vi.spyOn(toast, "success");

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(callRequest).toBeCalled();
            expect(mockedToastSuccess).toBeCalled()
        })

    });

    it('Validated submitted', async () => {

        const { result } = renderHook(() => authStore());

        render(<ModalLogin />, { wrapper: BrowserRouter });

        act(() => {
            result.current.onOpen()
        })

        const emailInput = await screen.findByPlaceholderText(/email/i);
        const passwordInput = (await screen.findByPlaceholderText(/password/i))
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()

        const submitButton = await screen.findByLabelText("login-button-mobile")

        expect(submitButton).toBeInTheDocument();

        const mockedToastError = vi.spyOn(toast, "error");

        // Missing email
        fireEvent.change(emailInput, { target: { value: fakeLoginData } });
        fireEvent.change(passwordInput, { target: { value: fakeLoginData.password } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockedToastError).toBeCalled()
        })

        // Missing password
        fireEvent.change(emailInput, { target: { value: fakeLoginData.email } });
        fireEvent.change(passwordInput, { target: { value: "" } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockedToastError).toBeCalled()
        })

        // Request error
        const mockRequest = vi.mocked(serviceAuth.authSignIn).mockImplementationOnce(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return new AxiosError("Internal server error") as any
        })

        fireEvent.change(emailInput, { target: { value: fakeLoginData.email } });
        fireEvent.change(passwordInput, { target: { value: fakeLoginData.password } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockedToastError).toBeCalled();
            expect(mockRequest).toBeCalled()
        })

    });

})

