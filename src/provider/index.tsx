import '../assets/css/global.css'
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { authStore } from "@stores/auth-store";
import { ProviderNotification } from "./provider-notification";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

export interface Provider {

    router: ReturnType<typeof createBrowserRouter>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _mockSocket?: any
}
export function Provider({ router, _mockSocket = null }: Provider) {
    const { refresh, isDone, isAuth } = authStore();

    useEffect(() => {
        toast.dismiss();
        refresh()
    }, [])
    if (!isDone) return null;

    return <>
        {isAuth &&
            <ProviderNotification _mockSocket={_mockSocket} />
        }
        <RouterProvider router={router} />
        <Toaster
            toastOptions={
                {
                    duration: 5000,
                    success: {
                        duration: 4000
                    }
                }
            }
            position="top-center"
        />
    </>
}