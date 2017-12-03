
// 业务
import {
  initConnect,
  createStore,
} from './jun_redux';

import reducer from '../Search/reducer';
const storeObj = createStore(reducer);
const connect = initConnect(storeObj);

module.exports = {connect};