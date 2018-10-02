// @flow

import React, {Component} from 'react';
import type {Node} from 'react';

// eslint-disable-next-line react/prefer-stateless-function
export default class SymbolNoDefine extends Component<null, void> {
    render(): Node {
        return (
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                stroke="#fff"
                fill="none"
                opacity="0.2"
                strokeWidth="10px"
                viewBox="0 0 128 128"
                strokeLinecap="round"
            >
                <path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"/>
                <path d="M16,16L112,112"/>
                <path d="M112,16L16,112"/>
            </svg>
        );
    }
}
