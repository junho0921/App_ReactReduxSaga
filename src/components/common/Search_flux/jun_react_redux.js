
import React from 'react';

/*
* initConnect方法
* desc: 管理状态对象与关联react组的方法, 原理是通过新建一个代理react组件, 因为react组件没有对外触发更新的api, 所以通过, 而且, 需要内部自动重新渲染的方法
* params: 接收参数
* 1, 状态管理对象
* 2, 状态属性处理函数, 用于指定组件的props
* 3, 关联的组件
* 返回一个react组件
*
* */
const initConnect = (storeObj) => (getPropsMethod) => (Component) => {
  // 定义数据处理器, 返回数据作为props给子组件
  const renderChildProps = (props) => {
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
  function _Proxy_2 (props) {

    // function render () {
    //   const childProps = renderChildProps(newStore);
    //   this.setState(childProps);
    //
    //   return ....
    //
    // }
    // // 绑定事件: 在更新
    // storeObj.onNewStore = (newStore) => {
    //   const childProps = renderChildProps(newStore);
    //   this.setState(childProps);
    // };
  }
  // 代理类
  class _Proxy extends React.Component {
    constructor(props) {
      super(props);
      // 定时初始化的状态 = 传递给子级的属性, 因为这个代理组件全为子级组件服务, 所以, 以子级组件所需要的属性作为本身的状态属性
      this.state = renderChildProps(props);
      // 绑定事件: 在更新
      storeObj.onNewStore = (newStore) => {
        const childProps = renderChildProps(newStore);
        this.setState(childProps);
      };
    }
    componentWillReceiveProps(newProps){
      this.setState(
        renderChildProps(newProps)
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
  initConnect
};
