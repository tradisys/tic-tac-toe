// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../../app/reducer';
import type {ContextRouterType} from '../../../type/react-router-dom-v4';
import style from './style.scss';
import type {SymbolType} from '../api';
import {getImageComponent} from './helper';
import noDefineImage from './i/no-define.png';
import {symbolMap} from '../api';
import classNames from 'classnames';
import MtSvgLines from 'react-mt-svg-lines';

type ReduxPropsType = {
    // +reduxProp: boolean
};

type ReduxActionType = {
    // +setSmth: (smth: string) => string
};

type PassedPropsType = {|
    +value: SymbolType,
    +isWin: boolean,
    +onClick: () => void | Promise<void>
    // +passedProp: string
|};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>
        // ...$Exact<ContextRouterType>,
        // +children: Node
    }>>;

type StateType = {
    // +state: number
};

const reduxAction: ReduxActionType = {
    // setSmth // imported from actions
};

class Cell extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = {};
    }

    render(): Node {
        const view = this;
        const {props, state} = view;

        const SvgComponent = getImageComponent(props.value);

        return (
            <button
                onClick={(): void | Promise<void> => props.onClick()}
                onKeyPress={(): void | Promise<void> => props.onClick()}
                className={classNames(style.cell, {[style.cell_win]: props.isWin})}
                type="button"
            >
                <img className={style.cell_bg} src={noDefineImage} alt=""/>
                <div
                    className={classNames(style.cell_value, {
                        [style.cell_value_set]: props.value !== symbolMap.noDefine
                    })}
                >
                    <MtSvgLines animate duration={700}>
                        <SvgComponent/>
                    </MtSvgLines>
                </div>
            </button>
        );
    }
}

export default connect(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        // reduxProp: true
    })
    // reduxAction
)(Cell);
