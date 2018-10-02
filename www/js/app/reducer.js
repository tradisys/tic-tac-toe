// @flow

import type {AuthType} from '../component/auth/reducer';
import auth from '../component/auth/reducer';

import type {LocaleType} from '../component/locale/reducer';
import locale from '../component/locale/reducer';

import type {SystemType} from '../component/system/reducer/root';
import system from '../component/system/reducer/root';

export {auth, locale, system};

export type GlobalStateType = {|
    +auth: AuthType,
    +locale: LocaleType,
    +system: SystemType
|};
