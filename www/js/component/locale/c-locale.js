// @flow

/* global window, IS_PRODUCTION */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../app/reducer';
import type {LocaleType} from './reducer';
import type {LocaleNameType} from './const';
import {allLocales, localeConst} from './const';
import type {LangKeyType} from './translation/type';

type StateType = null;

type ReduxPropsType = {|
    +locale: LocaleType
|};

type PassedPropsType = {|
    +stringKey: LangKeyType
|};

export function getLocalizedString(stringKey: LangKeyType, localeName: LocaleNameType): string {
    // eslint-disable-next-line id-match
    if (!IS_PRODUCTION) {
        if (!stringKey) {
            console.error('stringKey is not define', stringKey);
            return 'TEXT';
        }

        if (!allLocales[localeConst.defaults.localeName].hasOwnProperty(stringKey)) {
            console.error('has no key stringKey', stringKey);
            return stringKey;
        }
    }

    return allLocales[localeName][stringKey];
}

class Locale extends Component<ReduxPropsType, PassedPropsType, StateType> {
    // eslint-disable-next-line id-match
    props: $Exact<{...ReduxPropsType, ...PassedPropsType}>;
    state: StateType;

    render(): string {
        const view = this;
        const {props} = view;

        return getLocalizedString(props.stringKey, props.locale.name);
    }
}

export default connect(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        locale: state.locale
    }),
    {
        // setUser
    }
)(Locale);
