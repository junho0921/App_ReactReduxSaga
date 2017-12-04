
import React from 'react';

/*
* 创建状态存储器
* 1, 接收数据处理方法reducer
* 2, 提供api
* 2-1, 获取存储状态数据getState
* 2-2, 触发状态储存器更新方法dispatch
* */
const createStore = (reducer) => {
  const storeObj = {};
  storeObj.store = reducer(undefined, {});
  // 定义工具
  const getState = () => ({Search: storeObj.store});
  const dispatch = (action) => {
    if(typeof action === 'function'){
      action(dispatch, getState);
    } else {
      // action直接对应着这里的reducer所以...
      const newStore = reducer(storeObj.store, action);
      storeObj.store = newStore;
      storeObj.onNewStore && storeObj.onNewStore(newStore);
    }
  };
  storeObj.dispatch = dispatch;
  storeObj.getState = getState;
  return storeObj;
};

module.exports = {
  createStore
};
