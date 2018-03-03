import React from 'react';

function getComponent (ComponentName, callback) {
    console.log('inputChangeHandler', ComponentName);
    switch (ComponentName){
        case '1':
            require.ensure(['../Singer/index.js'], function () {
                callback(require('../Singer/index.js'))
            });
            break;
        case '2':
            require.ensure(['../Dancer/index.js'], function () {
                callback(require('../Dancer/index.js'))
            });
            break;
        default:
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

        this.loadChild = (e) => {
            const _this = this;
            if (e.target instanceof HTMLInputElement) {
                console.log('loadChild', e.target);
                getComponent(e.target.value, function (Component) {
                    _this.setState({
						Child: Component
					});
                })
            }
        };


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
