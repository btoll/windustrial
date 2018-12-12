import React from 'react';
import ForecastMain from '../components/forecast/ForecastMain';
import Login from '../components/Login';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Login />
        )
    }
}

export default App;

