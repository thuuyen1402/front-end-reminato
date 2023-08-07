import { AxiosError } from 'axios';
import _ from 'lodash'
export function getError(err: unknown) {
    if (err instanceof AxiosError) {
        return (
            (_.isString(err.response?.data?.message))
                ?
                err.response?.data?.message
                :
                err.response?.data?.message?.message
        ) ?? err?.message ?? "Unknown error"
    } else
        if (err instanceof Error) {
            return err.message;
        } else if (_.isObject(err))
            return JSON.stringify(err);
        else return err?.toString() ?? "Unknown error"
}