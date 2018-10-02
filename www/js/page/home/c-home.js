// @flow

/* global BUILD_DATE */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import type {ContextRouterType} from '../../type/react-router-dom-v4';
import Game from '../../component/game/c-game';
import style from './style.scss';
// import Locale from '../../component/locale/c-locale';
import ttt from './i/ttt.png';

type PropsType = {
    ...$Exact<ContextRouterType>
};

// eslint-disable-next-line react/prefer-stateless-function
export default class Home extends Component<void, null> {
    props: PropsType;
    state: null;

    render(): Node {
        const view = this;
        const {props, state} = view;

        console.log(props, state);

        return (
            <div className={style.page}>
                <header className={style.header} key="header">
                    {/* <Locale stringKey="HEADER__TOP_TEXT"/>*/}
                    <img className={style.header_image} src={ttt} alt=""/>
                </header>
                <div className={style.content_wrapper}>
                    <Game key="game"/>
                </div>
            </div>
        );
    }
}
