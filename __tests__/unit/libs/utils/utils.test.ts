import { waitResolve } from '@utils/utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Libs/utils waitResolve', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    const ms = 1000;
    const msSoon = 500

    it('Execute the function with 1000ms', async () => {
        const wait = waitResolve(ms);
        vi.advanceTimersByTime(ms);
        const result = await wait;
        expect(result).toBe(true)
    })

    it('Function end earlier', async () => {
        vi.spyOn(global, 'setTimeout').mockImplementation((callback, time) => {
            if (time === ms) {
                // Fake end earlier
                vi.advanceTimersByTime(msSoon);
                // eslint-disable-next-line @typescript-eslint/ban-types
                return (callback as Function)();
              }
            return 0 as unknown as NodeJS.Timeout;
        });


        try {
            await waitResolve(ms);
        } catch (error) {
            expect(error).toBeDefined();
        }
    })
})