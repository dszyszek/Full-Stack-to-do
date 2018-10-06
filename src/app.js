console.log('app is working');

import React from 'react';
import ReactDOM from 'react-dom';

const el = <h1>CONNECTED</h1> //React.createElement('h1', {}, 'CkjbhkONNECTED')

class Comp extends React.Component {
    state = {
        options: [1,2,3,4]
    }

    clickF = () => {
        this.setState((prev) => {
            return {
                options: prev.options.concat([5,6,7])
            }
        })
    }

    render() {
        return(
            <div>
                <h1>NLDNFLAND</h1>
                <button onClick={this.clickF}>Click</button>
                {this.state.options.map((x) => (<p>{x}</p>))}
            </div>
        );
    }
}

ReactDOM.render(<Comp />, document.querySelector('#app'));