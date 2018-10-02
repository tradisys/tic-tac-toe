// @flow

// eslint-disable-next-line import/no-unresolved
import {Container, Rectangle, Texture} from 'pixi.js';

type ApplicationOptionsType = {|
    autoStart?: boolean,
    transparent?: boolean,
    backgroundColor?: number,
    view?: HTMLElement,
    resolution?: number,
    preserveDrawingBuffer?: boolean,
    clearBeforeRender?: boolean,
    roundPixels?: boolean,
    sharedTicker?: boolean,
    sharedLoader?: boolean
|};

type TextStyleConstructorType = {
    fontFamily?: string,
    fontSize?: number,
    fontStyle?: 'normal' | 'italic',
    fontWeight?: 'normal' | 'bold',
    fill?: string | [string, string], // color
    stroke?: string, // stroke color
    strokeThickness?: number,
    dropShadow?: boolean,
    dropShadowColor?: string,
    dropShadowBlur?: number,
    dropShadowAngle?: number,
    dropShadowDistance?: number,
    wordWrap?: boolean,
    wordWrapWidth?: number
};

type InteractionEventType = {|
    +data: {|
        +global: {|
            +x: number,
            +y: number
        |},
        +originalEvent: {|
            touches?: Array<{|
                +x: number,
                +y: number
            |}>
        |}
    |}
|};

type MouseEventNameType = 'click' | 'mousedown' | 'mouseup';
type TouchEventNameType = 'tap' | 'touchstart' | 'touchend';

declare module 'pixi.js' {
    // eslint-disable-next-line id-match
    declare export var SCALE_MODES: {|
        +LINEAR: 0,
        +NEAREST: 1
    |};

    declare export var settings: {|
        SCALE_MODE: 0 | 1
    |};

    declare export var loader: {|
        add(imageName: string, imagePath?: string): void,
        load(callback: () => void): void,
        onProgress: {
            add(callback: () => void): void
        }
    |};

    declare class PixiObject {
        on(eventName: MouseEventNameType | TouchEventNameType, callback: (evt: InteractionEventType) => void): void,
        width: number,
        height: number,
        interactive: boolean,
        buttonMode: boolean,
        hitArea: Rectangle,
        position: {
            set(x: number, y: number): void
        },
        anchor: {
            set(x: number, y: number): void
        },
        scale: {
            set(x: number, y: number): void
        },
        alpha: number,
        removeChildren(startIndex?: number, endIndex?: number): void
    }

    declare export class Texture {
        constructor(): Texture,
        static fromImage(spriteName: string): Texture
    }

    declare export class Sprite extends PixiObject {
        constructor(): Sprite,
        texture: Texture,
        tint: number,
        static fromImage(spriteName: string): Sprite
    }

    declare export class Rectangle extends PixiObject {
        constructor(number, number, number, number): Rectangle
    }

    declare export class TextStyle {
        constructor(initialData?: TextStyleConstructorType): TextStyle
    }

    declare export class Text extends PixiObject {
        constructor(text: string | number, style?: TextStyle): Text,
        text: string | number
    }

    declare export class Container {
        constructor(): Container,
        on(eventName: MouseEventNameType | TouchEventNameType, callback: (evt: InteractionEventType) => void): void,
        addChild(pixiObject: PixiObject | Container): void,
        removeChild(pixiObject: PixiObject | Container): void,
        removeChildren(startIndex?: number, endIndex?: number): void,
        getChildAt(index: number): Sprite | void,
        children: Array<PixiObject>,
        interactive: boolean,
        buttonMode: boolean,
        hitArea: Rectangle,
        alpha: number,
        position: {
            set(x: number, y: number): void
        }
    }

    declare export class Application {
        constructor(width: number, height: number, options?: ApplicationOptionsType): Application,
        view: HTMLElement,
        stage: Container,
        renderer: {
            resize(width: number, height: number): void,
            view: {
                toDataURL(): string
            }
        },
        stop: () => void,
        start: () => void,
        destroy: () => void,
        render: () => void
    }

    declare class AnimatedSprite extends PixiObject {
        constructor(textureList: Array<Texture>): AnimatedSprite,
        animationSpeed: number,
        textures: Array<Texture>,
        play(): void
    }

    declare export var extras: {
        AnimatedSprite: typeof AnimatedSprite
    };
}
