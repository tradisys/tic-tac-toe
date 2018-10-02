// @flow

import {combineReducers} from 'redux';
import type {PopupStateType} from './action';
import {authConst} from './const';
import type {ActionDataType} from '../../app/type';
import type {SymbolType} from '../game/api';
import {symbolMap} from '../game/api';

export type UserType = {|
    +id: string,
    +address: string,
    +phrase: string,
    +privateKey: string,
    +publicKey: string,
    +symbol: SymbolType
|};

const defaultUserState: UserType = {
    id: '',
    address: '',
    phrase: '',
    privateKey: '',
    publicKey: '',
    symbol: symbolMap.noDefine
};

export type PopupNameType = 'login';

export type PopupMapStateType = {|
    +login: PopupStateType
|};

const defaultPopupMapState: PopupMapStateType = {
    [authConst.popupName.login]: {
        isOpen: false
    }
};

export type AuthType = {|
    +user: UserType,
    +popup: PopupMapStateType
|};

export default combineReducers({
    user: (userState: UserType = defaultUserState, actionData: ActionDataType): UserType => {
        if (actionData.type !== authConst.action.type.setUserState) {
            return userState;
        }

        if (typeof actionData.payload === 'undefined') {
            return userState;
        }

        return actionData.payload;
    },
    popup: (popupMapState: PopupMapStateType = defaultPopupMapState, actionData: ActionDataType): PopupMapStateType => {
        if (actionData.type !== authConst.action.type.setPopupState) {
            return popupMapState;
        }

        if (typeof actionData.payload === 'undefined') {
            return popupMapState;
        }

        const {popupName, state} = actionData.payload;

        const newState = {...popupMapState[popupName], ...state};

        return {...popupMapState, [popupName]: newState};
    }
});
