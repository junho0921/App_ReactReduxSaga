/*基本库*/
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';// 为什么不可以是router-dom? 觉得不一定要关联react
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
/*reducers*/
import reducersRender from "./reducers/index";
/*routes*/
import routes from "./routes";

import createSagaMiddleware from 'redux-saga';
import rootSaga from "./saga/rank";

// 选择模式
// window.actionMode = 'sagaMode';
// 需要routerMiddleware中间件才能给store.disptach方法传递react-router-redux的action
import ReduxThunk from 'redux-thunk';
const hashRouterMiddleware = routerMiddleware(hashHistory);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducersRender,
  // 插入异步管理系统与路由系统, 提供修改状态的机会
  applyMiddleware(
    hashRouterMiddleware,
    ReduxThunk
    // (window.actionMode === 'sagaMode'?
    //   sagaMiddleware: // saga模式
    //   ReduxThunk      // redux的thunk模块,让redux可以异步处理数据的函数
    // )
  )
);
// 运行异步管理系统 todo 具体页面才使用
window.actionMode === 'sagaMode' && sagaMiddleware.run(rootSaga);

console.log('初始化, ', store);
console.log('初始化, ', sagaMiddleware);

const history = syncHistoryWithStore(hashHistory, store);
console.log('history, ', history);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('rC')
);
