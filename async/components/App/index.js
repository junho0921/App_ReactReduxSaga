import React from 'react';
import './index.css';

// 组件的异步加载必须是以完整相对路径的方式在这里注册
const componentList = {
    '1': (callback) => {
        require.ensure(['../Singer/index.js'], function () {
            callback(require('../Singer/index.js'));
        });
    },
    '2': (callback) => {
        require.ensure(['../Dancer/index.js'], function () {
            callback(require('../Dancer/index.js'));
        });
    },
};

function getComponent (ComponentName, callback) {
    console.log('inputChangeHandler', ComponentName);
    if(componentList[ComponentName]){
        componentList[ComponentName](callback);
    }else{
        callback(null);
        console.log('nothing');
    }
}

/*创建组件*/
class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            Child: null
        };
        console.log('App constructor', this.state);

        const _this = this;

        this.onInput = (e) => {
            if (e.target instanceof HTMLInputElement) {
                console.log('loadChild', e.target);
                var name = e.target.value;
                this.loadChild(name)
            }
        };

        this.loadChild = (name) => {
            if(name){
                // 若有组件名称，加载组件
                getComponent(name, function (Component) {
                    _this.setState({
                        ChildName: name,
                        Child: Component
                    });
                })
            }else{
                // 若没有组件名称表示清理App组件显示
                _this.setState({
                    ChildName: null,
                    Child: null
                });
            }
        };
        RoomService.subscribe('c', function (name) {
            console.log('receive data = ', name);
            _this.loadChild(name);
        });
        // 外部获取App的展示状态
        window.getAppState = () => {
            return Object.assign({}, _this.state);
        };
        // 外部获取App的可以展示的组件
        window.getAppComponent = (id) => {
            return !!componentList[id];
        };
    }
    componentWillMount(){
        console.log('App componentWillMount', this.state);
    }
    componentDidMount(){
        console.log('App componentDidMount', this.state);
    }
    componentWillUpdate(){
        console.log('App componentWillUpdate', this.state);
    }
    render() {
        console.log('init App', this.state);

        const Child = this.state.Child;

        console.warn('Child', Child);

        return (
            <div>
                <input type="text" onChange={this.onInput} placeholder='to input'/>
                {Child ? <Child /> : '加载中'}
            </div>
        );
    }
}

export default App;
