import React, { Component } from 'react';
import { Line, Circle } from 'rc-progress';

export default class Loading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            percent: 25
        }
        this.increase = this.increase.bind(this);
    }
    componentDidMount() {
        this.increase();
    }
    componentWillUnmount() {
        clearTimeout(this.tm);
    }

    increase() {
        const percent = this.state.percent + 1;
        if (percent >= 100) {
            clearTimeout(this.tm);
            return;
        }
        this.setState({ percent });
        this.tm = setTimeout(this.increase, 10);
    }

    render() {
        return (
            <div className="pure-g" style={{ justifyContent: 'center' }}>

                <div className="pure-u-1-3" style={{ textAlign: 'center' }}>
                    Loading web3 ...
                <Circle strokeWidth="6" percent={this.state.percent} />
                </div>
            </div>
        )
    }
}
