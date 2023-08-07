import { useFormikErrorSubscribe } from "@hooks"
import { act, renderHook, waitFor } from "@testing-library/react"
import { fakeSchema } from "__mocks__/fake/validation"
import { useFormik } from "formik"
import toast from "react-hot-toast";
import { TestComponent } from '__mocks__/fake/test-component'
import { createRoot } from "react-dom/client";

describe("Libs/hooks Hook formik error subscribe", () => {
    
    afterAll(() => {
        vi.restoreAllMocks()
    })

    it("Toast error when failed validation and reset error after change any input", async () => {

        const el = document.createElement("div");
        act(() => {
            createRoot(el).render(<TestComponent />);

        });

        const { result: formikHook } = renderHook(() => useFormik({
            initialValues: {
                field1: "",
                field2: -1,
                field3: true
            },
            validationSchema: fakeSchema,
            onSubmit: () => { }
        },))
        const { result: errorSubscribe, rerender } = renderHook(() => useFormikErrorSubscribe({ formik: formikHook.current }))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockedToastError = vi.spyOn(toast, "error").mockImplementation((() => { }) as any);
        act(() => {
            formikHook.current.submitForm();
        })

        await waitFor(() => {
            expect(Object.keys(formikHook.current.errors).length).toBeGreaterThan(0)
            rerender();//Action useEffect condition
        })

        expect(errorSubscribe.current.isError).toBe(true)
        expect(mockedToastError).toBeCalled();

        //Finish
        await waitFor(() => {
            expect(formikHook.current.isSubmitting).toBe(false);
            rerender()
        })
        const newValue = {
            field1: "abcd",
            field2: 10,
            field3: true
        }

        act(() => {
            formikHook.current.setValues(newValue)
        })

        await waitFor(() => {
            expect(formikHook.current.values).toMatchObject(newValue);
            // Rerender error subscribe
            rerender();
        })

        //reset submit state when typing any input or valid (Try again)
        expect(errorSubscribe.current.isError).toBe(false)

    })


    it("Not toast error when success validation", async () => {

        const el = document.createElement("div");
        act(() => {
            createRoot(el).render(<TestComponent />);

        });

        const { result: formikHook } = renderHook(() => useFormik({
            initialValues: {
                field1: "abcd",
                field2: 2,
                field3: true
            },
            validationSchema: fakeSchema,
            onSubmit: () => { }
        },))
        const { result: errorSubscribe, rerender } = renderHook(() => useFormikErrorSubscribe({ formik: formikHook.current }))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockedToastError = vi.spyOn(toast, "error").mockImplementation((() => { }) as any);
        act(() => {
            // Waiting finish directly with validation always be true
            formikHook.current.submitForm();

        })

        // Go to validation
        await waitFor(() => {
            expect(formikHook.current.isValidating).toBe(true)
        })

        // End Validation
        await waitFor(() => {
            expect(formikHook.current.isValidating).toBe(false);
            expect(Object.keys(formikHook.current.errors).length).toBe(0);
            rerender();
        })

        expect(errorSubscribe.current.isError).toBe(false)
        expect(mockedToastError).not.toBeCalled();

    })
})