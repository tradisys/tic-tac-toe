// @flow

declare module '@tweenjs/tween.js' {
    declare function update(): void;

    declare class Tween {
        constructor<T>(tweenObject: T): Tween,
        start(): Tween,
        stop(): Tween,
        chain(otherTween: Tween): Tween,
        delay(delay: number): Tween,
        to<T>(tweenObject: T, time: number): Tween,
        onUpdate<T>(callback: (tweenObject: T) => void): Tween,
        onComplete<T>(callback: (tweenObject: T) => void): Tween
    }
}
