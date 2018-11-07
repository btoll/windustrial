import React from 'react';
import axios from 'axios';

import { AUTH, SCENARIO_ENDPOINT_BASE } from './config';
import ForecastGroup from './ForecastGroup';
import ForecastNav from '../components/ForecastNav';
import ForecastOptions from './modal/ForecastOptions';

const getForecastGroups = data => ({
    'Gross Revenue': {
        data: data.filter(d => d.GroupName === 'Gross Revenue'),
        rows: [7, 8, 9]
    },
    'Non-Operating': {
        data: data.filter(d => d.GroupName === 'Non-Operating'),
        rows: [45, 46]
    },
    'Sales, General, Admin Expenses': {
        data: data.filter(d => d.GroupName.includes('Sales')),
        rows: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
    },
    // TODO: 'Owner Incentive' is grouped with COGS because it's GroupName is empty in the json response
    // ...should it be its own group?
    '': {
        data: data.filter(d => !d.GroupName), // COGS
        rows: [12, 13, 14, 15, 16, 17]
    }
});

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
                type: null
            },
            percentages: [],
            scenarios: [],
            selectedScenario: {},

            scenarioForecasts: []
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

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleExpandCollapse = this.toggleExpandCollapse.bind(this);

        this.changeScenario = this.changeScenario.bind(this);
        this.createScenario = this.createScenario.bind(this);
        this.saveScenario = this.saveScenario.bind(this);
        this.updateForecastOptions = this.updateForecastOptions.bind(this);
        this.updateScenarioInfo = this.updateScenarioInfo.bind(this);
    }

    closeModal(e) {
        this.setState({
            modal: {
                data: {},
                show: false
            }
        });
    }

    openModal(type, data, e) {
        this.setState({
            modal: {
                data,
                show: true,
                type
            }
        });
    }

    changeScenario(e) {
        // TODO: Should be better way to toggle spinner contents!
        this.closeModal();
        this.openModal('spinnerModal');

        // If button, the user would like to retrieve another scenario, simply "clear" the screen.
        if (e.currentTarget.nodeName.toLowerCase() === 'form') {
            e.preventDefault();

            // TODO: What are `Revenue Center` and `Notes`?
            this.setState({
                selectedScenario: {
                    Id: 0,
                    CreatedDateTime: '',
                    Description: '',
                    LOB: '',
                    ModifiedDateTime: ''
                }
            });

            this.closeModal();
        } else {
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
        }
    }

    createScenario(e) {
        e.preventDefault();

        // TODO: Should be better way to toggle spinner contents!
        this.closeModal();
        this.openModal('spinnerModal');

        const formData = new FormData(e.target);

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

    renderGroup(groupName) {
        const group = this.state.forecastGroups[groupName];
        const groupData = group.data;
        const groupRows = group.rows;

        return (
            <div style={{'marginBottom': '30px'}} key={groupName}>
                <h3
                    onClick={this.toggleExpandCollapse.bind(null, groupName)}
                    className={this.state.expanded[groupName] ? 'collapsed' : 'expanded'}
                    style={{'cursor': 'pointer'}}
                >{groupName || 'COGS'}</h3>

                {/* Render group rows. */}
                {
                    groupData.map((c, i) => (
                        <ForecastGroup
                            key={c.Id}
                            row={c}
                            modal={this.state.modal}
                            onOpenModal={this.openModal}
                            expanded={this.state.expanded[groupName]}
                            /*scenarioForecasts={this.state.scenarioForecasts}*/
                        />
                    ))
                }
            </div>
        );
    }

    // TODO
    saveScenario() {
        this.openModal('spinnerModal');

        setTimeout(() => {
            this.closeModal();
        }, 2000);
    }
    // TODO

    updateForecastOptions(selectedForecastOption, e) {
        // TODO: Should be better way to toggle spinner contents!
        e.preventDefault();
        this.closeModal();
//        this.openModal('spinnerModal');

        let found = false;
        const target = e.currentTarget;
        const scenarioForecasts = this.state.scenarioForecasts.map(scenarioForecast => {
            if (selectedForecastOption.ScenarioForecastId === scenarioForecast.ScenarioForecastOptions.ScenarioForecastId) {
                found = true

                return {
                    ScenarioId: this.state.selectedScenario.Id,
                    ScenarioForecastOptions: [selectedForecastOption]
                };
            }

            return scenarioForecast;
        });

        if (!found) {
            scenarioForecasts.push({
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
            this.setState({
                forecastGroups: getForecastGroups(res.data.ScenarioForecasts),
                selections: selections
            });

            this.closeModal();
        })
        .catch(err => {
            console.log(err);
            this.closeModal();
        });

//        this.setState({
//            percentages: percentages,
//            dirty: true
//        });
    }

    toggleExpandCollapse(groupName) {
        this.setState(() =>
            this.state.expanded[groupName] = !this.state.expanded[groupName]
        );
    }

    updateScenarioInfo(e) {
        e.preventDefault();

        const req = Object.assign({}, this.state.selectedScenario);
        const formData = new FormData(e.target);
        req.Name = formData.get('scenarioName');

        // TODO: Should be better way to toggle spinner contents!
        this.closeModal();
        this.openModal('spinnerModal');

        axios({
            method: 'put',
            url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selectedScenario.Id}`,
            headers: {
                'AuthorizationToken': this.state.authToken
            },
            data: req
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

    render() {
        return (
            <>
                <ForecastNav
                    modal={this.state.modal}
                    scenarios={this.state.scenarios}
                    selectedScenario={this.state.selectedScenario}
                    onChangeScenario={this.changeScenario}
                    onCreateScenario={this.createScenario}
                />

                <section id="groups">
                    <h1>Company Name</h1>
                    <div style={this.styles.headerRow} className="row">
                        <div className="col"></div>
                        <div className="col">Past</div>
                        <div className="col">Current</div>
                        <div className="col"></div>
                        <div className="col">Future</div>
                        <div className="col"></div>
                    </div>
                    <div style={this.styles.subHeaderRow} className="row">
                        <div className="col"></div>
                        <div className="col">mm/dd/yy to mm/dd/yy</div>
                        <div className="col">mm/dd/yy to mm/dd/yy</div>
                        <div className="col">% +/-</div>
                        <div className="col">mm/dd/yy to mm/dd/yy</div>
                        <div className="col">% +/-</div>
                    </div>

                    {
                        !!this.state.selectedScenario.Id ?
                            ['Gross Revenue', '', 'Sales, General, Admin Expenses', 'Non-Operating']
                            .map(this.renderGroup.bind(this))
                        : <div style={{'display': 'none'}}></div>
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
                </section>
            </>
        )
    }

    componentDidMount() {
        this.openModal('spinnerModal');
        this.getAllScenarios();
    }
}

