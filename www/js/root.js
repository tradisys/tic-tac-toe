// @flow
/* global window */

import React from 'react';
import {render} from 'react-dom';
import App from './component/app/c-app';

render(<App/>, window.document.querySelector('.js-app-wrapper'));
