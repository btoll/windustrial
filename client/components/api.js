import axios from 'axios';
import { AUTH, SCENARIO_ENDPOINT_BASE } from './config';

const formatDate = s =>
    s.replace(/(\d{4})-(\d{2})-(\d{2}).*/g, (matched, _1, _2, _3) => `${_2}/${_3}/${_1}`);

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
    .catch(err => {
        // It will fail either b/c of a network error, i.e. no connectivity
        // or an auth failure.
        const message = err.response ?
            'Email and/or Password are not valid' :
            err.message;

        this.setState({
            modal: {
                show: true,
                type: 'error',
                data: {
                    error: message
                }
            }
        });
    });
}

async function changeScenario() {
    await axios({
        method: 'get',
        url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedRetrievalRow}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    })
    .then(res => {
        const data = res.data;

        this.setState({
            actionableRows: [],
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            selectedScenario: Object.assign({}, data),
            forecastGroups: this.getForecastGroups(data.ScenarioForecasts),
            actionableRows: []
        });
    })
    .catch(err => {
        this.openModal('error', {
            data: {
                error: err.message,
                call: 'changeScenario'
            }
        });
    });
}

async function createScenario(scenarioName, scenarioDescription, scenarioMonthEnd, LOB, revenueCenter) {
    await axios({
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
        }
    })
    .then(async res => {
        this.setState({
            actionableRows: [],
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            scenarios: await getAllScenarios.call(this),
            selectedScenario: Object.assign({}, res.data),
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            actionableRows: [],
            uploadDate: formatDate(res.data.FutureForecastDates.EndDate), // Set the date in ForecastActions nav in New Scenario block (Scenario End Date).
            selectedRetrievalRow: res.data.Id // Set this so scenario will be highlighted in `RetrieveScenario` modal.
        });
    })
    .catch(err => {
        this.openModal('error', {
            data: {
                error: e,
                call: 'createScenario'
            }
        });
    });
}

async function deleteScenario(scenarioID) {
    await axios({
        method: 'delete',
        url: `${SCENARIO_ENDPOINT_BASE}/${scenarioID}`,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    })
    .then(async res => {
        this.setState({
            actionableRows: [],
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            scenarios: await getAllScenarios.call(this),
            selectedScenario: {
                Id: null
            },
            actionableRows: [],
            selectedRetrievalRow: '' // So nothing is highlighted in the modal grid when Retrieve a Scenario is clicked.
        });
    })
    .catch(err => {
        this.setState({
            modal: {
                show: true,
                type: 'error',
                data: {
                    error: err.message,
                    call: 'deleteScenario'
                }
            }
        });
    });
}

async function getAllScenarios() {
    return await axios({
        method: 'get',
        url: SCENARIO_ENDPOINT_BASE,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    }).then(res => {
        return res.data;
    })
    .catch(err => {
        return err;
    });
}

function getLOBS() {
    return axios({
        method: 'get',
        url: `${SCENARIO_ENDPOINT_BASE}/LOBS`,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    }).then(res => {
        return res.data;
    })
    .catch(err => {
        return err;
    });
}

function getReportDates() {
    return axios({
        method: 'get',
        url: `${SCENARIO_ENDPOINT_BASE}/ReportDates`,
        headers: {
            'AuthorizationToken': this.props.authToken
        }
    }).then(res => {
        return res.data;
    })
    .catch(err => {
        return err;
    });
}

async function init() {
    await axios.all([
        getAllScenarios.call(this),
        getLOBS.call(this),
        getReportDates.call(this)
    ])
    .then(axios.spread((scenarios, lobs, reportDates) => {
        this.setState({
            actionableRows: [],
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            companyName: lobs.CompanyName,
            LOBS: lobs.LOBS,
            reportDates,
            scenarios
        });
    }))
    .catch(err => {
        let e = err.message;

        // TODO:
        // I have a situation where getLOBS is failing when called from `init`, but the whole stack of calls
        // made by axios.all isn't immediately terminating to the .catch clause of axios.all.  Is this a bug?
//        if (
//            err.response && err.response.status === 401 ||
//            err.message == "Cannot read property 'map' of undefined"
//        ) {
            this.props.cookies.remove('authToken');
            e = 'Your session has timed out, please login again';

            this.setState({
                loggedIn: false
            });
//        }

        this.openModal('error', {
            data: {
                error: e,
                call: 'init'
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
    .then(async res => {
        this.setState({
            actionableRows: [],
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            scenarios: await getAllScenarios.call(this),
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            // Let's always clear the "save" flags when saving!
            hardSave: false,
            softSave: false
        });
    })
    .catch(err => {
        this.openModal('error', {
            data: {
                error: err.message,
                call: 'saveScenario'
            }
        });
    });
}

async function updateForecastOptions() {
    const selectedForecastOption = this.state.modal.data.row.ScenarioForecastOptions.concat()[0];
    const scenarioForecasts = this.state.selectedScenario.ScenarioForecasts.map(scenarioForecast => {
        const arr = scenarioForecast.ScenarioForecastOptions;

        if (arr.length && selectedForecastOption.ScenarioForecastId === scenarioForecast.ScenarioForecastOptions[0].ScenarioForecastId) {
            return Object.assign({}, scenarioForecast, { ScenarioForecastOptions: [selectedForecastOption] });
        }

        return scenarioForecast;
    });

    await axios({
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
            actionableRows: [],
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            hardSave: true,
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            // Treat the WIP as a new scenario.
            selectedScenario: res.data
        });
    })
    .catch(err => {
        this.openModal('error', {
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
            actionableRows: [],
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            forecastGroups: this.getForecastGroups(res.data.ScenarioForecasts),
            // Let's always clear the "save" flags when updating!
            hardSave: false,
            softSave: false
        })
    })
    .catch(err => {
        this.openModal('error', {
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
    deleteScenario,
    init,
    saveScenario,
    updateForecastOptions,
    updateScenario
};

