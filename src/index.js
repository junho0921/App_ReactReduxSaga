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
window.actionMode = 'sagaMode';
// 需要routerMiddleware中间件才能给store.disptach方法传递react-router-redux的action
import ReduxThunk from 'redux-thunk';
const hashRouterMiddleware = routerMiddleware(hashHistory);
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducersRender,
  // 插入异步管理系统与路由系统, 提供修改状态的机会
  applyMiddleware(
    hashRouterMiddleware,
    (window.actionMode === 'sagaMode'? sagaMiddleware: ReduxThunk)
  )
);
// 运行异步管理系统
window.actionMode === 'sagaMode' && sagaMiddleware.run(rootSaga);

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('rC')
);
