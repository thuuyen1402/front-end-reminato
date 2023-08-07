import { ToastNotify } from "@components";
import { useSocket } from "@hooks";
import { authStore } from "@stores/auth-store"
import { ReactNode, useEffect } from "react"
import toast from "react-hot-toast";

export interface ProviderNotification {
    children?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _mockSocket?: any
}
export function ProviderNotification({ children, _mockSocket = null }: ProviderNotification) {
    const { isAuth, user } = authStore();
    const socket = useSocket({
        url: import.meta.env.VITE_SERVER_NOTIFY_API_URL,
        ops: {
            withCredentials: true,
        },
        _mockSocket
    })

    useEffect(() => {
        if (isAuth) {
            if (!socket?.connected) {
                socket?.connect()
            }

            socket?.on("new_video_sharing", (message: string) => {
                console.log("12345")
                try {
                    const video = JSON.parse(message) as NotifyServiceConsume;

                    if (video.sharedBy.id != user?.id)
                        toast.custom(t => <ToastNotify t={t} info={video} />, { duration: 10000 })
                }
                catch {
                    // eslint-disable-next-line no-empty
                }
            });

            return () => {
                socket?.removeAllListeners();
            }
        }

    }, [
        isAuth,
        user,
        socket
    ])
    return <>
        {children}
    </>
}