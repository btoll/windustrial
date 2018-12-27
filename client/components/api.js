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
        this.openModal('errorModal', {
            data: {
                error: 'Email and/or Password are not valid'
            }
        });
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
        this.openModal('errorModal', {
            data: {
                error: err.message,
                call: 'changeScenario'
            }
        });
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
        this.setState({
            selectedScenario: Object.assign({}, res.data),
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            actionableRows: [],
            selectedRetrievalRow: res.data.Id // Set this so scenario will be highlighted in `RetrieveScenario` modal.
        });

        // TODO: This isn't great, but will do for now (b/c it's making a call to get the entire list again).
        getAllScenarios.call(this);
    })
    .catch(err => {
        this.openModal('errorModal', {
            data: {
                error: e,
                call: 'createScenario'
            }
        });
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

        this.openModal('errorModal', {
            data: {
                error: e,
                call: 'getAllScenarios'
            }
        });
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
            companyName: res.data.CompanyName,
            LOBS: res.data.LOBS
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

        this.openModal('errorModal', {
            data: {
                error: e,
                call: 'getLOBS'
            }
        });
    });
}

async function saveScenario() {
    await axios({
        method: 'put',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        },
        data: Object.assign({}, this.state.selectedScenario, {
            StatusType: 'Active'
        })
    })
    .then(res => {
        this.setState({
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            // Let's always clear the "save" flags when saving!
            hardSave: false,
            softSave: false
        });

        // TODO: This isn't great, but will do for now (b/c it's making a call to get the entire list again).
        getAllScenarios.call(this);
    })
    .catch(err => {
        this.openModal('errorModal', {
            data: {
                error: err.message,
                call: 'saveScenario'
            }
        });
    });
}

function updateForecastOptions() {
    const selectedForecastOption = this.state.modal.data.row.ScenarioForecastOptions.concat()[0];
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
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            // Treat the WIP as a new scenario.
            selectedScenario: res.data
        });

        this.closeModal();
    })
    .catch(err => {
        this.openModal('errorModal', {
            data: {
                error: err.message,
                call: 'updateForecastOptions'
            }
        });
    });
}

async function updateScenario() {
    await axios({
        method: 'put',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        },
        data: Object.assign({}, this.state.selectedScenario, {
            ScenarioForecasts: [], // Not passing any `ScenarioForecasts` tells the server not to create a new record.
            StatusType: 'Active'
        })
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
        this.openModal('errorModal', {
            data: {
                error: err.message,
                call: 'updateScenario'
            }
        });
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

