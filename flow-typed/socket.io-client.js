// @flow

type SocketIoOptionsType = {|
    transports: ['websocket'],
    'force new connection': true
|};

type SocketCallbackFunctionType = (message?: string) => void;

type SocketType = {|
    id: string,
    on(event: string, callbackFunction: SocketCallbackFunctionType): void
|};

declare module 'socket.io-client' {
    declare export function connect(url: string, options: SocketIoOptionsType): SocketType;
}
