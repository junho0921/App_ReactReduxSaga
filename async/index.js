/*基本库*/
import React from 'react';
import ReactDOM from 'react-dom';

import App from './Components/App/index';

// 选择模式
// 需要routerMiddleware中间件才能给store.disptach方法传递react-router-redux的action
ReactDOM.render(
    <App />,
  document.getElementById('rC')
);
