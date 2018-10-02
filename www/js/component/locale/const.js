// @flow

/* global window, PROJECT_ID */

export type LocaleNameType = 'en-US' | 'ru-RU' | 'zh-CN' | 'zh-TW';

import {enUs} from './translation/en-us/data';
import {ruRu} from './translation/ru-ru/data';
import {zhCn} from './translation/zh-cn/data';
import {zhTw} from './translation/zh-tw/data';

export const localeNameReference: {[key: string]: LocaleNameType} = {
    enUs: 'en-US',
    ruRu: 'ru-RU',
    zhCN: 'zh-CN',
    zhTW: 'zh-TW'
};

export const allLocales = {
    'en-US': enUs,
    'ru-RU': ruRu,
    'zh-CN': zhCn,
    'zh-TW': zhTw
};

const localeNameList: Array<LocaleNameType> = Object.keys(localeNameReference).map(
    (localeKey: string): LocaleNameType => localeNameReference[localeKey]
);

export const localeConst = {
    action: {
        type: {
            setLocale: 'locale__set-locale'
        }
    },
    defaults: {
        localeName: 'en-US'
    },
    key: {
        localStorage: {
            // eslint-disable-next-line id-match
            localeName: PROJECT_ID + '-locale-name-v.1.0'
        }
    },
    localeNameList
};
