import { act, fireEvent, render, renderHook, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { useTriggerScrollBottom } from "@hooks";
import { TestComponentForwardRef } from "__mocks__/fake/test-component";

describe("Libs/hooks trigger scroll bottom", () => {
    it("Trigger callback when scroll bottom", async () => {
        const callbackSpy = vi.fn();
        const ref = renderHook(() => useRef<HTMLDivElement>(null));
        const callBackEventListener = vi.spyOn(document, "addEventListener")

        // Render test comp
        render(<TestComponentForwardRef ref={ref.result.current} />)

        //Render hook
        const hook = renderHook(() =>
            useTriggerScrollBottom(ref.result.current, callbackSpy)
        )

        //Trigger rerender ref
        act(() => {
            hook.rerender()
        })

        expect(ref.result.current).not.toBeNull();



        if (ref.result.current.current) {

            // Fake trigger to the end
            fireEvent.scroll(document, { target: { scrollY: 1000 } });
            
            //Sure that have call with scroll event
            expect(callBackEventListener).toBeCalled()
            
            await waitFor(() => {
                expect(callbackSpy).toBeCalled()
            })
        }


    })
})