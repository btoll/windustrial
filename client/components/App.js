import React from 'react';
import Forecast from '../components/Forecast';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Forecast />
            </div>
        )
    }
}

export default App;

