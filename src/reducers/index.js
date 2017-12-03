
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Rank from './Rank/index';
import Singer from './Singer/index';
import Search from '../components/common/Search/reducer';

// 将现有的reduces加上路由的reducer
const rootReducer = combineReducers({
  // 添加各个页面的reducer
  Rank,
  Singer,
  Search,
  routing: routerReducer
});

export default rootReducer;
