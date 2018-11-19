import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

import { AUTH, SCENARIO_ENDPOINT_BASE } from './config';

import ForecastActions from '../components/ForecastActions';
import ForecastGroup from './ForecastGroup';
import ForecastNav from './ForecastNav';
import ForecastOptions from './modal/ForecastOptions';

import Confirm from './modal/Confirm';
import Spinner from './modal/Spinner';

const getForecastGroups = data => ({
    'Gross Revenue': {
        data: (data => {
            const filtered = data.filter(d => d.GroupName === 'Gross Revenue')
            return {
                toggled: filtered,
                nonToggled: filtered.slice(-1)
            };
        })(data)
    },
    'Non-Operating': {
        data: (data => {
            const filtered = data.filter(d => d.GroupName === 'Non-Operating')
            return {
                toggled: filtered,
                nonToggled: filtered.slice(-2)
            };
        })(data)
    },
    'Sales, General, Admin Expenses': {
        data: (data => {
            const filtered = data.filter(d => d.GroupName.includes('Admin Expenses'))
            return {
                toggled: filtered,
                nonToggled: filtered.slice(-2)
            };
        })(data)
    },
    // TODO: 'Owner Incentive' is grouped with COGS because it's GroupName is empty in the json response
    // ...should it be its own group?
    '': {
        data: (data => {
            const filtered = data.filter(d => !d.GroupName) // COGS
            return {
                toggled: filtered,
                nonToggled: filtered.slice(-2)
            };
        })(data)
    }
});

const resetScenario = {
    Id: 0,
    CreatedDateTime: '',
    Description: '',
    LOB: '',
    ModifiedDateTime: '',
    Notes: ''
};

export default class ForecastMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authToken: '',
            dirty: false,
            expanded: {
                'Gross Revenue': false,
                'Non-Operating': false,
                'Sales, General, Admin Expenses': false,
                '': false
            },
            forecastGroups: {
                'Gross Revenue': [],
                'Non-Operating': [],
                'Sales, General, Admin Expenses': [],
                '': [] // COGS
            },
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            percentages: [],
            scenarios: [],
            selectedScenario: {},

            scenarioForecasts: [],

            // Note these must be uppercased to match the json fields' case!
            Description: '',
            Notes: '',

            navID: 'scenarioPlanning'
        }

        this.styles = {
            headerRow: {
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '20px',
                marginTop: '10px'
            },
            subHeaderRow: {
                cursor: 'pointer',
                fontSize: '12px',

            },
            parentRowTotal: {
                marginBottom: '25px'
            },
            thickDivider: {
                display: 'block',
                borderWidth: '3px',
                width: '70%',
                marginTop: '0px',
                marginBottom: '15px'
            },
            thinDivider: {
                display: 'block',
                borderWidth: '1px',
                width: '70%',
                marginTop: '0px',
                marginBottom: '1px'
            }
        }

        this.confirm = this.confirm.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleExpandCollapse = this.toggleExpandCollapse.bind(this);

        this.changeScenario = this.changeScenario.bind(this);
        this.changeText = this.changeText.bind(this);
        this.createScenario = this.createScenario.bind(this);
        this.saveScenario = this.saveScenario.bind(this);
        this.updateForecastOptions = this.updateForecastOptions.bind(this);
        this.updateScenario = this.updateScenario.bind(this);

        this.navSelection = this.navSelection.bind(this);
        this.showDates = this.showDates.bind(this);

        // For aria, should hide underyling dom elements when modal is shown.
        // (Doesn't appear to be working.)
        ReactModal.setAppElement('#root');
    }

    closeModal(e) {
        this.setState({
            modal: {
                data: {},
                show: false
            }
        });
    }

    openModal(type, data, text, e) {
        this.setState({
            modal: {
                data,
                show: true,
                text,
                type
            }
        });
    }

    changeScenario(e) {
        // TODO: Should be better way to toggle spinner contents!
        this.closeModal();
        this.openModal('spinnerModal');

        // If button, the user would like to retrieve another scenario, simply "clear" the screen.
//        if (e.currentTarget.nodeName.toLowerCase() === 'form') {
//            e.preventDefault();
//
//            if (this.state.Description || this.state.Notes) {
//                this.openModal('confirmModal');
//            } else {
//                // TODO: What are `Revenue Center` and `Notes`?
//                this.setState({
//                    selectedScenario: resetScenario
//                });
//
//                this.closeModal();
//            }
//        } else {
            // Now get a specific scenario.
            axios({
                method: 'get',
                url: `${SCENARIO_ENDPOINT_BASE}/${e.target.value}`,
                headers: {
                    'AuthorizationToken': this.state.authToken
                }
            })
            .then(res => {
                const data = res.data;
                const blacklistedKeys = ['ScenarioForecasts', 'ScenarioForecastOptions', 'ScenarioOverrides'];

                this.setState({
                    selectedScenario: (() => {
                        const o = {};
                        for (const key of Object.keys(data)) {
                            if (!blacklistedKeys.includes(key)) {
                                o[key] = data[key];
                            }
                        }
                        return o;
                    })(),
                    forecastGroups: getForecastGroups(data.ScenarioForecasts)
                });

                this.closeModal();
            })
            .catch(err => {
                console.log(err);
                this.closeModal();
            });
//        }
    }

    changeText(e) {
        const selectedScenario = Object.assign({}, this.state.selectedScenario);
        selectedScenario[e.currentTarget.name] = e.currentTarget.value;

        this.setState({
            [e.currentTarget.name]: e.currentTarget.value,
            selectedScenario
        });
    }

    confirm(confirm, e) {
        if (confirm) {
            this.saveScenario();
        }

        this.setState({
            Description: '',
            Notes: '',
            selectedScenario: resetScenario
        });

        this.closeModal();
    }

    createScenario(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

//        if (this.state.Description || this.state.Notes) {
//            this.openModal('confirmModal', (function (e) {
//                this.createScenario(e);
//            }.bind(this, e)));
//        } else {
            // TODO: Should be better way to toggle spinner contents!
    //        this.closeModal();
            this.openModal('spinnerModal');

            axios({
                method: 'post',
                url: `${SCENARIO_ENDPOINT_BASE}/${formData.get('scenarioName')}/${formData.get('scenarioDescription')}/${formData.get('scenarioMonthEnd')}`,
                headers: {
                    'AuthorizationToken': this.state.authToken
                }
            })
            .then(res => {
                this.setState({
                    forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
                });

                // TODO: This isn't great, but will do for now (b/c it's making a call to get the entire list again).
                this.getAllScenarios();
            })
            .catch(err => {
                console.log(err);
                this.closeModal();
            });
//        }
    }

    getAllScenarios() {
        // First, get all scenarios.
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

    navSelection(e) {
        e.preventDefault();

        this.setState({
            navID: e.target.name
        });
    }

    renderGroup(groupName) {
        return (
            <div style={{'marginBottom': '30px'}} key={groupName}>
                <ForecastGroup
                    groupName={groupName}
                    group={this.state.forecastGroups[groupName]}
                    expanded={this.state.expanded[groupName]}
                    modal={this.state.modal}
                    onOpenModal={this.openModal}
                    onHeaderClick={this.toggleExpandCollapse}
                />
            </div>
        );
    }

    saveScenario() {
        this.openModal('spinnerModal', null, 'Please wait while we save your scenario');

        axios({
            method: 'put',
            url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
            headers: {
                'AuthorizationToken': this.state.authToken
            },
            data: Object.assign({}, {
                ScenarioForecasts: scenarioForecasts
            }, this.state.selectedScenario)
        })
        .then(res => {
            this.setState({
                forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
            });

            this.closeModal();
        })
        .catch(err => {
            console.log(err);
            this.closeModal();
        });
    }

    showDates() {
        return `${(this.state.selectedScenario.CurrentStartDate || "mm/dd/yy")} to ${this.state.selectedScenario.CurrentEndDate || "mm/dd/yy"}`;
    }

    toggleExpandCollapse(groupName) {
        this.setState(() =>
            this.state.expanded[groupName] = !this.state.expanded[groupName]
        );
    }

    updateForecastOptions(selectedForecastOption, e) {
        // TODO: Should be better way to toggle spinner contents!
        e.preventDefault();
        this.closeModal();
        this.openModal('spinnerModal');

        let found = false;
        const target = e.currentTarget;
        const scenarioForecasts = this.state.scenarioForecasts.map(scenarioForecast => {
            if (selectedForecastOption.ScenarioForecastId === scenarioForecast.ScenarioForecastOptions.ScenarioForecastId) {
                found = true

                return {
                    Id: selectedForecastOption.ScenarioForecastId,
                    ScenarioId: this.state.selectedScenario.Id,
                    ScenarioForecastOptions: [selectedForecastOption]
                };
            }

            return scenarioForecast;
        });

        if (!found) {
            scenarioForecasts.push({
                Id: selectedForecastOption.ScenarioForecastId,
                ScenarioId: this.state.selectedScenario.Id,
                ScenarioForecastOptions: [selectedForecastOption]
            });
        }

        axios({
            method: 'put',
            url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
            headers: {
                'AuthorizationToken': this.state.authToken
            },
            data: Object.assign({}, {
                ScenarioForecasts: scenarioForecasts
            }, this.state.selectedScenario)
        })
        .then(res => {
            const forecastGroups = getForecastGroups(res.data.ScenarioForecasts)

            this.setState({
//                forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
                forecastGroups
            });

            this.closeModal();
        })
        .catch(err => {
            console.log(err);
            this.closeModal();
        });
    }

    updateScenario(e) {
        e.preventDefault();

//        if (this.state.Description || this.state.Notes) {
//            this.openModal('confirmModal');
//        }

        // TODO: What are `Revenue Center` and `Notes`?
        if (e.currentTarget.name === 'retrieveAnother') {
            this.setState({
                selectedScenario: resetScenario
            });
        } else {
            // TODO: Should be better way to toggle spinner contents!
            this.closeModal();
            this.openModal('spinnerModal', null, 'Please wait while we save your scenario...');

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
                    forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
                })

                this.closeModal();
            })
            .catch(err => {
                console.log(err);
                this.closeModal();
            });
        }
    }

    render() {
        return (
            <>
                <section id="banner">
                    <h1>Business Forecasting Tool</h1>
                </section>

                <ForecastActions
                    modal={this.state.modal}
                    scenarios={this.state.scenarios}
                    selectedScenario={this.state.selectedScenario}
                    onChangeScenario={this.changeScenario}
                    onChangeText={this.changeText}
                    onCreateScenario={this.createScenario}
                    onUpdateScenario={this.updateScenario}
                />

                <ForecastNav
                    navID={this.state.navID}
                    onClick={this.navSelection}
                />

                <section id="groups">
                    <h1>{this.state.selectedScenario.Company || "Company Name"}</h1>
                    <div style={this.styles.headerRow} className="row">
                        <div></div>
                        <div>Past</div>
                        <div>Current</div>
                        <div className="small">Growth</div>
                        <div>Future</div>
                        <div className="small">Growth</div>
                    </div>
                    <div style={this.styles.subHeaderRow} className="row">
                        <div></div>
                        <div>{this.showDates()}</div>
                        <div>{this.showDates()}</div>
                        <div>Rate</div>
                        <div>{this.showDates()}</div>
                        <div>Rate</div>
                    </div>

                    {
                        !!this.state.selectedScenario.Id ?
                            ['Gross Revenue', '', 'Sales, General, Admin Expenses', 'Non-Operating']
                            .map(this.renderGroup.bind(this))
                        : <div style={{'display': 'none'}}></div>
                    }

                    {this.state.modal.show ?
                        this.state.modal.type === 'confirmModal' &&
                            <Confirm
                                show={this.state.modal.show}
                                onClick={this.confirm}
                                onClose={this.closeModal}
                            /> :
                        null
                    }

                    {this.state.modal.show ?
                        this.state.modal.type === 'forecastOptions' &&
                            <ForecastOptions
                                show={this.state.modal.show}
                                data={this.state.modal.data}
                                onClose={this.closeModal}
                                onSubmit={this.updateForecastOptions}
                            /> :
                        null
                    }

                    {this.state.modal.show ?
                        this.state.modal.type === 'spinnerModal' &&
                            <Spinner
                                show={this.state.modal.show}
                                text={this.state.modal.text}
                            /> :
                        null
                    }
                </section>
            </>
        )
    }

    componentDidMount() {
        this.openModal('spinnerModal');
        this.getAllScenarios();
    }
}

