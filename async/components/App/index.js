import React from 'react';
import './index.css';

function getComponent (ComponentName, callback) {
    console.log('inputChangeHandler', ComponentName);
    switch (ComponentName){
        case '1':
            require.ensure(['../Singer/index.js'], function () {
                callback(require('../Singer/index.js'));
            });
            break;
        case '2':
            require.ensure(['../Dancer/index.js'], function () {
                callback(require('../Dancer/index.js'));
            });
            break;
        default:
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
        this.loadChild = (e) => {
            if (e.target instanceof HTMLInputElement) {
                console.log('loadChild', e.target);
                getComponent(e.target.value, function (Component) {
                    _this.setState({
                        ChildName: e.target.value,
                        Child: Component.default
                    });
                })
            }
        };
        RoomService.subscribe('c', function (name) {
            console.log('receive data = ', name);
            getComponent(name, function (Component) {
                _this.setState({
                    ChildName: name,
                    Child: Component
                });
            });
        });
        window.getAppState = () => {
            return Object.assign({}, _this.state);
        }
    }
    componentWillMount(){
        console.log('componentWillMount', this.state);
    }
    componentDidMount(){
        console.log('componentDidMount', this.state);
    }
    componentWillUpdate(){
        console.log('componentWillUpdate', this.state);
    }
    render() {
        console.log('init App', this.state);

        const Child = this.state.Child;

        console.warn('Child', Child);

        return (
            <div>
                <input type="text" onChange={this.loadChild} placeholder='to input'/>
                {Child ? <Child /> : '加载中'}
            </div>
        );
    }
}

export default App;
