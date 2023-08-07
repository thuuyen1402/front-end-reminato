import { useEffect, useState } from "react";
import io, { ManagerOptions, SocketOptions } from "socket.io-client";
export const useSocket = ({
    url,
    ops = {},
    _mockSocket = null
}: {
    url: string;
    ops?: Partial<ManagerOptions & SocketOptions>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _mockSocket: any
}) => {
    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(_mockSocket);

    useEffect(() => {
        if (_mockSocket != null) return;
        const socketIo = io(url, {
            ...ops,
        });
        setSocket(socketIo);

        function cleanup() {
            socketIo.disconnect();
        }
        return cleanup;
    }, []);

    return _mockSocket ?? socket;
};
