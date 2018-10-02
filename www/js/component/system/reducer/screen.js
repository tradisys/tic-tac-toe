// @flow

/* global window */

import {systemConst} from '../const';
import type {ActionDataType} from '../../../app/type';

type ScreenWidthNameType = 'desktop' | 'tablet' | 'mobile';

const screenMinWidth: {[key: ScreenWidthNameType]: number} = {
    desktop: 1280,
    tablet: 768,
    mobile: 320
};

export const screenNameReference: {[key: ScreenWidthNameType]: ScreenWidthNameType} = {
    desktop: 'desktop',
    tablet: 'tablet',
    mobile: 'mobile'
};

export type ScreenType = {|
    +width: number,
    +height: number,
    +name: ScreenWidthNameType,
    +isDesktop: boolean,
    +isTablet: boolean,
    +isMobile: boolean,
    +littleThen: Array<ScreenWidthNameType>,
    +isLandscape: boolean,
    +isPortrait: boolean
|};

function getScreenName(screenWidth: number): ScreenWidthNameType {
    let screenName = 'mobile';

    Object.keys(screenMinWidth).every(
        (screenNameInList: ScreenWidthNameType): boolean => {
            if (screenWidth >= screenMinWidth[screenNameInList]) {
                screenName = screenNameInList;
                return false;
            }

            return true;
        }
    );

    return screenName;
}

function getLittleThen(screenWidth: number): Array<ScreenWidthNameType> {
    const littleThenList = [];

    Object.keys(screenMinWidth).forEach((screenName: ScreenWidthNameType) => {
        if (screenWidth < screenMinWidth[screenName]) {
            littleThenList.push(screenName);
        }
    });

    return littleThenList;
}

function getScreenState(width: number, height: number): ScreenType {
    const isLandscape = width > height; // use >, do not use >=, if width === height it is portrait
    const screenName = getScreenName(width);

    return {
        width,
        height,
        name: screenName,
        littleThen: getLittleThen(width),
        isDesktop: screenName === screenNameReference.desktop,
        isTablet: screenName === screenNameReference.tablet,
        isMobile: screenName === screenNameReference.mobile,
        isLandscape,
        isPortrait: !isLandscape
    };
}

const {clientWidth, clientHeight} = window.document.documentElement;

const defaultScreenState = getScreenState(clientWidth, clientHeight);

export default (screenState: ScreenType = defaultScreenState, actionData: ActionDataType): ScreenType => {
    if (actionData.type !== systemConst.action.type.resize) {
        return screenState;
    }

    if (typeof actionData.payload === 'undefined') {
        return screenState;
    }

    const {width, height} = actionData.payload;

    if (screenState.width === width && screenState.height === height) {
        return screenState;
    }

    return getScreenState(width, height);
};
