// @flow

import React, {Component} from 'react';
import type {Node} from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class SymbolX extends Component<null, void> {
    render(): Node {
        return (
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                stroke="#555"
                strokeWidth="10px"
                viewBox="0 0 128 128"
                strokeLinecap="round"
            >
                <path d="M16,16L112,112"/>
                <path d="M112,16L16,112"/>
            </svg>
        );
    }
}
