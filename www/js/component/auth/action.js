// @flow

import type {PopupNameType, UserType} from './reducer';
import {authConst} from './const';

export type SetUserType = {|
    +type: 'auth__set-user-state',
    +payload: UserType
|};

export function setUser(userState: UserType): SetUserType {
    return {
        type: authConst.action.type.setUserState,
        payload: userState
    };
}

export type PopupStateType = {|
    +isOpen: boolean
|};

export type SetPopupStateType = {|
    +type: 'auth__set-popup-state',
    +payload: {|
        +popupName: PopupNameType,
        +state: PopupStateType
    |}
|};

function setPopupState(popupName: PopupNameType, state: PopupStateType): SetPopupStateType {
    return {
        type: authConst.action.type.setPopupState,
        payload: {popupName, state}
    };
}

export function openLoginPopup(): SetPopupStateType {
    return setPopupState(authConst.popupName.login, {isOpen: true});
}

export function closeLoginPopup(): SetPopupStateType {
    return setPopupState(authConst.popupName.login, {isOpen: false});
}
