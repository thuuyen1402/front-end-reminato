import { render, screen, waitFor } from '@testing-library/react';
import { mockAuth } from '__mocks__/auth';
import { TestComponent } from '__mocks__/fake/test-component';
import toast from 'react-hot-toast';
import SocketMock from 'socket.io-mock';
import { ProviderNotification } from '../../../src/provider/provider-notification';
import { fakeVideoSharing } from '__mocks__/fake/video';

//Init server socket mock
const socketServerMock = new SocketMock();

vi.mock("socket.io-client", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = (await vi.importActual("socket.io-client")) as Obj<any>;
    const socketInstance = vi.fn().mockImplementation(() => {
        const clientMock = socketServerMock.socketClient;
        return {
            connected: true,
            disconnect: vi.fn(),
            on: (_message: string, _callback: (message: string) => void) => {
                clientMock.on(_message, _callback)
            },
            emit: (_message: string, _outMessage: string) => {
                clientMock.emit(_message, _outMessage)
            },
            connect: vi.fn(),
            removeAllListeners: vi.fn()
        }
    })
    return {
        ...actual,
        default: socketInstance,
        io: socketInstance
    }
})


describe("Provider notification", () => {

    it("User new video sharing", async () => {
        //Mock
        const mockToastCustom = vi.spyOn(toast, "custom");
        const { current: {
            user
        } } = await mockAuth();


        render(
            <ProviderNotification>
                <TestComponent />
            </ProviderNotification>
        )

        expect(await screen.findByText("TESTING COMPONENT")).toBeInTheDocument()

        socketServerMock.emit("new_video_sharing", JSON.stringify({
            ...fakeVideoSharing,
            sharedBy: {
                id: fakeVideoSharing.sharedBy.id + "-diff-id-will-be-show"
            }
        }))
        await waitFor(() => {
            expect(mockToastCustom).toBeCalledTimes(1)
        })

        // Same id will not get, cause of the video share come from the sender
        socketServerMock.emit("new_video_sharing", JSON.stringify({
            ...fakeVideoSharing,
            sharedBy: {
                id: user?.id
            }
        }))
        await waitFor(() => {
            expect(mockToastCustom).not.toBeCalledTimes(2)
        })
    })
})