
// 业务
import {createStore} from './jun_redux';
import {initConnect} from './jun_react_redux';

import reducer from '../Search/reducer';
const storeObj = createStore(reducer);
const connect = initConnect(storeObj);

module.exports = {connect};