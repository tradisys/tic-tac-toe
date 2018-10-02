// @flow

// eslint-disable-next-line import/no-unresolved
import {Container} from 'pixi.js';

type ViewportSettingType = {|
    screenWidth: number,
    screenHeight: number,
    worldWidth: number,
    worldHeight: number
|};

declare module 'pixi-viewport' {
    declare export default class Viewport extends Container {
        constructor(settings: ViewportSettingType): Viewport,
        resize(screenWidth: number, screenHeight: number, worldWidth: number, worldHeight: number): void
    }
}
