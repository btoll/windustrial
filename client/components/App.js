import React from 'react';
import ForecastMain from '../components/ForecastMain';

//const listener = e => (
//    // Most browsers.
//    event.preventDefault(),
//
//    // Chrome/Chromium based browsers still need this one.
//    event.returnValue = "\o/"
//);

class App extends React.Component {
    constructor(props) {
        super(props);
    }

//    componentDidMount() {
//        // https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
//        window.addEventListener('beforeunload', listener);
//    }
//
//    componentWillUnmount() {
//        window.removeEventListener('beforeunload', listener);
//    }

    render() {
        return (
            <ForecastMain />
        )
    }
}

export default App;

