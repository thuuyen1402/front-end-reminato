import { faker } from '@faker-js/faker';
import { useSocket } from '@hooks';
import { act, renderHook, waitFor } from '@testing-library/react';
import SocketMock from 'socket.io-mock';

//Init server socket mock
const socketServerMock = new SocketMock();

vi.mock("socket.io-client", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (await vi.importActual("socket.io-client")) as Obj<any>;
    const socketInstance = vi.fn().mockImplementation(() => {
        const clientMock = socketServerMock.socketClient
        return {
            connected: true,
            disconnect: vi.fn(),
            on: (_message: string, _callback: (message: string) => void) => {
                clientMock.on(_message, _callback)
            },
            emit: (_message: string, _outMessage: string) => {
                clientMock.emit(_message, _outMessage)
            }
        }
    })
    return {
        ...actual,
        default: socketInstance,
        io: socketInstance
    }
})



describe("Libs/hook Socket hook", () => {

    it('Sockets get message from server', async () => {

        const { result: hook, rerender } = renderHook(() => useSocket({
            url: faker.internet.url.toString()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any))
        act(() => {
            rerender()
        })

        await waitFor(() => {
            expect(hook.current).not.toBeNull()
        })

        if (hook.current) {
            hook.current.on("server-send", (message: string) => {
                expect(message).toBe("merci!")
            })

            socketServerMock.emit("server-send", "merci!")
        }

    });
})