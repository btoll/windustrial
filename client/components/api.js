import axios from 'axios';
import { AUTH, SCENARIO_ENDPOINT_BASE } from './config';

function auth(email, password, cookies) {
    axios({
        method: 'post',
        url: AUTH,
        auth: {
            username: email,
            password
        }
    })
    .then(res => {
        const authToken = res.headers.authorizationtoken;

        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));

        cookies.set('authToken', authToken, {
            expires: d,
            path: '/'
        });

        this.setState({
            authToken: authToken
        });
    })
    .catch(() => {
        this.openModal('errorModal', 'Email and/or Password are not valid');
    });
}

function changeScenario() {
    axios({
        method: 'get',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedRetrievalRow}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    })
    .then(res => {
        const data = res.data;

        this.setState({
            selectedScenario: Object.assign({}, data),
            forecastGroups: this.getForecastGroups(data.ScenarioForecasts),
            actionableRows: []
        });

        this.closeModal();
    })
    .catch(err => {
        this.openModal('errorModal', err.message);
    });
}

function poll() {
    axios({
        method: 'post',
        url: SCENARIO_ENDPOINT_BASE,
        headers: {
            'AuthorizationToken': this.props.authToken
        },
        data: {
            Id: null,
            Name: "",
            Description: "",
            LOB: "",
            MonthEnd: "2018-03-01"
        },
        timeout: 5000
    })
    .then(res => {
        this.setState({
            selectedScenario: Object.assign({}, res.data),
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            actionableRows: [],
            selectedRetrievalRow: res.data.Id // Set this so scenario will be highlighted in `RetrieveScenario` modal.
        });

        // TODO: This isn't great, but will do for now (b/c it's making a call to get the entire list again).
        getAllScenarios();
    })
    .catch(err => {
        this.openModal('errorModal', err.message);
        /*
        if (err.code === 'ECONNABORTED') {
            poll.call(this);
        }
        */
    });
}

function createScenario(scenarioName, scenarioDescription, scenarioMonthEnd, LOB, revenueCenter) {
    axios({
        method: 'post',
        url: SCENARIO_ENDPOINT_BASE,
        headers: {
            'AuthorizationToken': this.props.authToken
        },
        data: {
            Id: revenueCenter || null,
            Name: scenarioName,
            Description: scenarioDescription,
            LOB,
            MonthEnd: scenarioMonthEnd
        },
//        timeout: 3000
    })
    .then(res => {
//        poll.call(this, res.data.Id);
        this.setState({
            selectedScenario: Object.assign({}, res.data),
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            actionableRows: [],
            selectedRetrievalRow: res.data.Id // Set this so scenario will be highlighted in `RetrieveScenario` modal.
        });

        // TODO: This isn't great, but will do for now (b/c it's making a call to get the entire list again).
        this.getAllScenarios();
    })
    .catch(err => {
//        if (err.code === 'ECONNABORTED') {
//            poll.call(this);
//        }
        this.openModal('errorModal', err.message);
    });
}

function getLOBS() {
    axios({
        method: 'get',
        url: `${SCENARIO_ENDPOINT_BASE}/LOBS`,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    }).then(res => {
        this.setState({
            LOBS: res.data
        });

        this.closeModal();
    })
    .catch(err => {
        let e = err.message;

        // 401 Unauthorized
        if (err.response.status === 401) {
            this.props.cookies.remove('authToken');
            e = 'Your session has timed out, please login again';

            this.setState({
                loggedIn: false
            });
        }

        this.openModal('errorModal', e);
    });
}

function getAllScenarios() {
    axios({
        method: 'get',
        url: SCENARIO_ENDPOINT_BASE,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    }).then(res => {
        this.setState({
            scenarios: res.data
        });

        this.closeModal();
    })
    .catch(err => {
        let e = err.message;

        // 401 Unauthorized
        if (err.response.status === 401) {
            this.props.cookies.remove('authToken');
            e = 'Your session has timed out, please login again';

            this.setState({
                loggedIn: false
            });
        }

        this.openModal('errorModal', e);
    });
}

function saveScenario(shouldReset, defaultScenario) {
    axios({
        method: 'put',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        },
        data: Object.assign({}, this.state.selectedScenario)
    })
    .then(res => {
        let state = {
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            // Let's always clear the "save" flags when saving!
            hardSave: false,
            softSave: false
        }

        if (shouldReset) {
            state = Object.assign({}, state, defaultScenario);
        }

        this.setState(state);
        this.closeModal();
    })
    .catch(err => {
        this.openModal('errorModal', err.message);
    });
}

function updateForecastOptions() {
    const selectedForecastOption = this.state.modal.data.ScenarioForecastOptions.concat()[0];
    const scenarioForecasts = this.state.selectedScenario.ScenarioForecasts.map(scenarioForecast => {
        const arr = scenarioForecast.ScenarioForecastOptions;

        if (arr.length && selectedForecastOption.ScenarioForecastId === scenarioForecast.ScenarioForecastOptions[0].ScenarioForecastId) {
            return Object.assign({}, scenarioForecast, { ScenarioForecastOptions: [selectedForecastOption] });
        }

        return scenarioForecast;
    });

    axios({
        method: 'put',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        },
        data: Object.assign({}, this.state.selectedScenario, {
            ScenarioForecasts: scenarioForecasts // <--- Note the cases are different!!!
        })
    })
    .then(res => {
        this.setState({
            hardSave: true,
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts)
        });

        this.closeModal();
    })
    .catch(err => {
        this.openModal('errorModal', err.message);
    });
}

async function updateScenario() {
    await axios({
        method: 'put',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        },
        data: Object.assign({}, this.state.selectedScenario)
    })
    .then(res => {
        this.setState({
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            // Let's always clear the "save" flags when updating!
            hardSave: false,
            softSave: false
        })

        this.closeModal();
    })
    .catch(err => {
        this.openModal('errorModal', err.message);
    });
}

// TODO: saveScenario and updateScenario do the same thing, doh!!
export {
    auth,
    changeScenario,
    createScenario,
    getAllScenarios,
    getLOBS,
    saveScenario,
    updateForecastOptions,
    updateScenario
};

