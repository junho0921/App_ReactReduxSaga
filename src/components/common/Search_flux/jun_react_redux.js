
import React from 'react';

/*
* initConnect方法
* desc:
*     管理状态对象与关联react组的方法,
*     原理是通过新建一个代理react组件. 为什么要新建一个代理组件?
*     1, 因为若关联react不一定是继承react.component的纯函数, 这样, 当状态更新时候, 就无法更新渲染组件
*     2, 而且react.component好像没有外部api触发该组件重新渲染.
* params: 接收参数
* 1, 状态管理对象
* 2, 状态属性处理函数, 用于指定组件的props
* 3, 关联的组件, 注意, 关键的组件必须是继承react.component的, 否则无法触发组件的重新渲染
* 返回一个react组件(代理组件)
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
  // 代理类
  class _Proxy extends React.Component {
    constructor(props) {
      super(props);
      // 定时初始化的状态 = 传递给子级的属性, 因为这个代理组件全为子级组件服务, 所以, 以子级组件所需要的属性作为本身的状态属性
      this.state = renderChildProps(props);
      // 绑定事件: 在更新
      var _this = this;
      storeObj.onNewStore = () => {
        const childProps = renderChildProps(_this.props);
        this.setState(childProps);
      };
    }
    componentWillReceiveProps(newProps){
      // 代理组件收到父级传递数据时
      this.setState(
        renderChildProps(newProps)
      )
    }
    render(){
      console.log('---渲染代理 --- ', this.state);
      return (<Component {...this.state}/>);
    }
  }
  return _Proxy;
};

module.exports = {
  initConnect
};
