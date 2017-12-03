
import React from 'react';

const createStore = (reducer) => {
  const storeObj = {};
  let store = reducer(undefined, {});
  storeObj.reducer = reducer;
  storeObj.store = store;
  // 定义工具
  const getState = () => ({Search: storeObj.store});
  const dispatch = (action) => {
    if(typeof action === 'function'){
      action(dispatch, getState);
    } else {
      // action直接对应着这里的reducer所以...
      const newStore = storeObj.reducer(storeObj.store, action);
      storeObj.store = newStore;
      storeObj.onNewStore && storeObj.onNewStore(newStore);
    }
  };
  storeObj.dispatch = dispatch;
  storeObj.getState = getState;
  return storeObj;
};

const initConnect = (storeObj) => (getPropsMethod) => (Component) => {
  class _Proxy extends React.Component {
    constructor(props) {
      super(props);
      // 定义数据处理器, 返回数据作为props给子组件
      this.renderChildProps = (props) => {
        const getProps = getPropsMethod(storeObj.getState(), props);
        // 返回传递给子级组件的数据
        return {
          // store工具
          dispatch: storeObj.dispatch,
          getState: storeObj.getState,
          // 原传递的属性
          ...props,
          // 修正后属性
          ...getProps
        };
      };
      // 定时初始化的状态 = 传递给子级的属性, 因为这个代理组件全为子级组件服务, 所以, 以子级组件所需要的属性作为本身的状态属性
      this.state = this.renderChildProps(props);
      // 绑定事件: 在更新
      storeObj.onNewStore = (newStore) => {
        // console.error('onNewStore');
        const childProps = this.renderChildProps(newStore);
        this.setState(childProps);
      };
    }
    componentWillReceiveProps(newProps){
      this.setState(
        this.renderChildProps(newProps)
    )
    }
    render(){
      console.log('---渲染代理 --- ', this.state);
      return (
        <Component {...this.state}/>
      );
    }
  }
  return _Proxy;
};

module.exports = {
  initConnect,
  createStore,
};
