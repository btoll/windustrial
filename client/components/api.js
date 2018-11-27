import axios from 'axios';
import { AUTH, SCENARIO_ENDPOINT_BASE } from './config';

function changeScenario(id) {
    axios({
        method: 'get',
        url: `${SCENARIO_ENDPOINT_BASE}/${id}`,
        headers: {
            'AuthorizationToken': this.state.authToken
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
        console.log(err);
        this.closeModal();
    });
}

function createScenario(scenarioName, scenarioDescription, scenarioMonthEnd) {
    axios({
        method: 'post',
        url: `${SCENARIO_ENDPOINT_BASE}/${scenarioName}/${scenarioDescription}/${scenarioMonthEnd}`,
        headers: {
            'AuthorizationToken': this.state.authToken
        }
    })
    .then(res => {
        this.setState({
            selectedScenario: Object.assign({}, res.data),
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            actionableRows: []
        });

        // TODO: This isn't great, but will do for now (b/c it's making a call to get the entire list again).
        this.getAllScenarios();
    })
    .catch(err => {
        console.log(err);
        this.closeModal();
    });
}

function getAllScenarios() {
    axios({
        method: 'post',
        url: AUTH,
        auth: {
            username: 'general@demo.com',
            password: '4Testing$'
        }
    })
    .then(res => {
        const authToken = res.headers.authorizationtoken;

        this.setState({
            authToken: authToken
        });

        return axios({
            method: 'get',
            url: SCENARIO_ENDPOINT_BASE,
            headers: {
                'AuthorizationToken': authToken
            }
        })
    }).then(res => {
        this.setState({
            scenarios: res.data
        });

        this.closeModal();
    })
    .catch(err => {
        console.log(err);
        this.closeModal();
    });
}

function saveScenario(shouldReset, defaultScenario) {
    axios({
        method: 'put',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
        headers: {
            'AuthorizationToken': this.state.authToken
        },
        data: Object.assign({}, this.state.selectedScenario)
    })
    .then(res => {
        let state = {
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts)
        }

        if (shouldReset) {
            state = Object.assign({}, state, defaultScenario);
        }

        this.setState(state);
        this.closeModal();
    })
    .catch(err => {
        console.log(err);
        this.closeModal();
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
            'AuthorizationToken': this.state.authToken
        },
        data: Object.assign({}, this.state.selectedScenario, {
            ScenarioForecasts: scenarioForecasts // <--- Note the cases are different!!!
        })
    })
    .then(res => {
        this.setState({
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts)
        });

        this.closeModal();
    })
    .catch(err => {
        console.log(err);
        this.closeModal();
    });
}

function updateScenario() {
    axios({
        method: 'put',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
        headers: {
            'AuthorizationToken': this.state.authToken
        },
        data: Object.assign({}, this.state.selectedScenario)
    })
    .then(res => {
        this.setState({
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts)
        })

        this.closeModal();
    })
    .catch(err => {
        console.log(err);
        this.closeModal();
    });
}

export {
    changeScenario,
    createScenario,
    getAllScenarios,
    saveScenario,
    updateForecastOptions,
    updateScenario
};

