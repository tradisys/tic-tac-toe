// @flow

import type {SetLocaleType} from '../component/locale/action';
import type {OnResizeType, OnSetIsScrollEnableType} from '../component/system/action';
import type {SetPopupStateType, SetUserType} from '../component/auth/action';

type DefaultActionDataType = {|type: string|};

export type ActionDataType =
    | DefaultActionDataType
    | OnResizeType
    | SetUserType
    | SetLocaleType
    | SetPopupStateType
    | OnSetIsScrollEnableType;
