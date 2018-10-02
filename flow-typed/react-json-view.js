// @flow

// eslint-disable-next-line id-match
import React, {React$Component} from 'react';

declare module 'react-json-view' {
    // eslint-disable-next-line flowtype/no-weak-types, id-match
    declare export default class JsonView extends React$Component<any> {}
}
