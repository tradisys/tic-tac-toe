// @flow

/* global window */

import {combineReducers} from 'redux';
import type {LocaleNameType} from './const';
import {localeConst} from './const';
import type {ActionDataType} from '../../app/type';

function getLocaleName(): LocaleNameType {
    const savedLocaleName = window.localStorage.getItem(localeConst.key.localStorage.localeName);
    const localeNameList: Array<LocaleNameType> = localeConst.localeNameList;

    if (localeNameList.includes(savedLocaleName)) {
        return savedLocaleName;
    }

    const navigatorLanguages = window.navigator.languages;

    if (!Array.isArray(navigatorLanguages)) {
        return localeConst.defaults.localeName;
    }

    let localeName = localeConst.defaults.localeName;

    navigatorLanguages.every(
        (deviceLocaleName: string): boolean => {
            if (localeNameList.includes(deviceLocaleName)) {
                localeName = deviceLocaleName;
                return false;
            }

            return true;
        }
    );

    return localeName;
}

const initialLocaleName = getLocaleName();

window.localStorage.setItem(localeConst.key.localStorage.localeName, initialLocaleName);

export type LocaleType = {|
    +name: LocaleNameType
|};

export default combineReducers({
    name: (localeName: LocaleNameType = initialLocaleName, actionData: ActionDataType): LocaleNameType => {
        if (actionData.type !== localeConst.action.type.setLocale) {
            return localeName;
        }

        if (typeof actionData.payload === 'undefined') {
            return localeName;
        }

        return actionData.payload.localeName;
    }
});
