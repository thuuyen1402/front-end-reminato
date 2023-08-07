// Can't find type definition

declare class SocketIoMockClass {
    constructor() { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    on(_message: string, _callback: (message: string) => void) { }
    emit: (_message: string, _outMessage: string) => void
    socketClient: {
        emit: (_message: string, _outMessage: string) => void;
        on: (_message: string, _callback: (message: string) => void) => void;
        connect: () => void;
        disconnect: () => void;
        connected: boolean;
        removeAllListeners: () => void;
    };

}
declare module SocketIoMockClass {

}
declare module "socket.io-mock" {
    export = SocketIoMockClass;
}