// @flow
/* global window */

/* eslint consistent-this: ["error", "queue"] */

type CallBackType = () => Promise<void> | void;
import {isFunction} from './is';

function requestIdleCallbackPolyfill(callback: () => {}) {
    window.requestAnimationFrame(() => {
        window.setTimeout(callback, 0);
    });
}

window.requestIdleCallback = window.requestIdleCallback || requestIdleCallbackPolyfill;

export default class Queue {
    list: Array<CallBackType>;
    isInProgress: boolean;

    constructor() {
        const queue = this;

        queue.list = [];
        queue.isInProgress = false;
    }

    push(func: CallBackType) {
        const queue = this;

        queue.list.push(func);

        if (queue.isInProgress) {
            return;
        }

        queue.run();
    }

    run() {
        const queue = this;

        if (queue.list.length === 0) {
            queue.isInProgress = false;
            return;
        }

        queue.isInProgress = true;
        const first = queue.list.shift();
        const result = first();

        if (result && isFunction(result.then)) {
            result.then((): void => queue.runCallBack()).catch(() => {
                console.error('error with run callback');
                queue.runCallBack();
            });
            return;
        }

        queue.runCallBack();
    }

    runCallBack() {
        // window.setTimeout(() => this.run(), 0);
        const queue = this;

        window.requestAnimationFrame(() => {
            window.requestIdleCallback(() => {
                queue.run();
            });
        });
    }
}
