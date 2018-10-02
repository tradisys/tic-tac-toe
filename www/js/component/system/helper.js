// @flow

/* global window */

import style from './style.css';

export function setIsGlobalScrollEnable(isEnable: boolean) {
    const {body} = window.document;
    const {classList} = body;

    if (isEnable) {
        classList.remove(style.no_scroll_y);
    } else {
        classList.add(style.no_scroll_y);
    }
}
