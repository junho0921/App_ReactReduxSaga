


const store = {};

const
  getState = () => store,
  dispatch = (action) => {
    if(typeof action === 'function'){
      action(dispatch, getState);
    } else {
      const newStateContent = reducer(_this.state, action);
      if(newStateContent){_this.setState(newStateContent);}
    }
  };

const trigger = () => {
  return connect();
};

const initStore = (reducer) => {

};


// 链接方法
const connect = (getPropsMethod) => (component) => (props) => {

  var getProps = getPropsMethod(store, props);

  var _props = {
    ...getProps,
    dispatch,
    getState,
  };

  return component(_props);
};

module.exports = {
  connect,
  getState,
};

