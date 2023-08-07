import { getError } from '@utils/error'
import { AxiosError } from 'axios';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';



describe('Libs/error getError', () => {
    beforeAll(() => {

    })
    afterEach(() => {
        vi.restoreAllMocks()
    })


    it('Correct error message for AxiosError', () => {
        const axiosError: AxiosError = new AxiosError('This is an AxiosError message');
        expect(getError(axiosError)).toBe('This is an AxiosError message');
    });

    it('Correct error message for regular Error', () => {
        const regularError = new Error('This is a regular error');
        expect(getError(regularError)).toBe('This is a regular error');
    });

    it('Correct error message for an object', () => {
        const objError = {
            code: 404,
            message: 'Object error',
        };
        expect(getError(objError)).toBe(JSON.stringify(objError));
    });

    it('Correct error message for other types', () => {
        const unknownError = 123;
        expect(getError(unknownError)).toBe('123');
    });

})