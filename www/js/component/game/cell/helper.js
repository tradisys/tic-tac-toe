// @flow

import React, {Component} from 'react';
import type {Node} from 'react';
import type {SymbolType} from '../api';
import {symbolMap} from '../api';
import SymbolX from './symbol/symbol-x';
import SymbolO from './symbol/symbol-o';
import SymbolNoDefine from './symbol/symbol-no-define';

export function getImageComponent(imageName: SymbolType): Class<Component> {
    switch (imageName) {
        case symbolMap.tic:
            return SymbolX;
        case symbolMap.tac:
            return SymbolO;
        case symbolMap.noDefine:
            return SymbolNoDefine;
        default:
            console.error('can not get image for imageName:', imageName);
    }

    return SymbolNoDefine;
}
