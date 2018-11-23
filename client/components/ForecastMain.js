import React from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

import { AUTH, SCENARIO_ENDPOINT_BASE } from './config';

import ForecastActions from '../components/ForecastActions';
import ForecastGroup from './ForecastGroup';
import ForecastNav from './ForecastNav';
import ForecastOptions from './modal/ForecastOptions';

import Confirm from './modal/Confirm';
import Message from './modal/Message';
import Notes from './modal/Notes';
import Spinner from './modal/Spinner';

/*
 * data.all       - Used by expand/collaps functionaliy.
 * data.untoggled - Used by expand/collaps functionaliy.
 * data.toggled   - Used by `ForecastOptions` modal nav functionality.
 */
const getForecastGroups = data => {
    return {
    'Gross Revenue': {
        data: (data => {
            const filtered = data.filter(d => d.GroupName === 'Gross Revenue')
            return {
                all: filtered,
                toggled: filtered.slice(0, -1),
                nonToggled: filtered.slice(-1)
            };
        })(data)
    },
    'Non-Operating': {
        data: (data => {
            const filtered = data.filter(d => d.GroupName === 'Non-Operating')
            return {
                all: filtered,
                toggled: filtered.slice(0, -2),
                nonToggled: filtered.slice(-2)
            };
        })(data)
    },
    'Sales, General, Admin Expenses': {
        data: (data => {
            const filtered = data.filter(d => d.GroupName.includes('Admin Expenses'))
            return {
                all: filtered,
                toggled: filtered.slice(0, -2),
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
                all: filtered,
                toggled: filtered.slice(0, -2),
                nonToggled: filtered.slice(-2)
            };
        })(data)
    }
}};

const growthPermutations = {
    LongTermTrendOn: {
        LongTermTrendOn: true,
        ShortTermTrendOn: false,
        MidRateGrowthOn: false,
        OverideOn: false,
        OveridePercentage: null
    },
    MidRateGrowthOn: {
        LongTermTrendOn: false,
        ShortTermTrendOn: false,
        MidRateGrowthOn: true,
        OverideOn: false,
        OveridePercentage: null
    },
    ShortTermTrendOn: {
        LongTermTrendOn: false,
        ShortTermTrendOn: true,
        MidRateGrowthOn: false,
        OverideOn: false,
        OveridePercentage: null
    },
    OverideOn: {
        LongTermTrendOn: false,
        ShortTermTrendOn: false,
        MidRateGrowthOn: false,
        OverideOn: true,
        OveridePercentage: null
    }
};

// Yes, both Description and Notes are in the outer and inner objects (for now)!
const defaultScenario = {
    actionableRows: [],
    Description: '',
    Notes: '',
    selectedScenario: {
        Id: 0,
        CreatedDateTime: '',
        Description: '',
        LOB: '',
        ModifiedDateTime: '',
        Notes: ''
    }
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

            // Note these must be uppercased to match the json fields' case!
            Description: '',
            Notes: '',

            navID: 'scenarioPlanning',
            actionableRows: [] // This is lazy-loaded and used for navigating when the `ForecastOptions` modal is up.
                               // These are the rows that will trigger the popup (the total rows do not).
                               // See `navigateForecastOptions` function.
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
        this.resetScenario = this.resetScenario.bind(this);
        this.saveScenario = this.saveScenario.bind(this);
        this.updateScenario = this.updateScenario.bind(this);

        this.navigateForecastOptions = this.navigateForecastOptions.bind(this);
        this.updateForecastOptions = this.updateForecastOptions.bind(this);

        this.navSelection = this.navSelection.bind(this);
        this.selectGrowth = this.selectGrowth.bind(this);
        this.showDates = this.showDates.bind(this);
        this.showNotes = this.showNotes.bind(this);

        // For aria, should hide underyling dom elements when modal is shown.
        // (Doesn't appear to be working.)
        ReactModal.setAppElement('#root');
    }

    closeModal(e) {
        this.setState({
            // For now, reset this b/c we need to re-create the `actionableRows` state every time the ForecastOptions
            // modal is opened, else the `navigateForecastOptions` callback will be passed a row object that isn't
            // in the `actionableRows` list and the navigation is then FUBAR'd.
            // I THINK it's because we're not mutating state anywhere, and b/c of this the row objects in the lists
            // will not continue to be the same object in between different operations.
            actionableRows: [],
            //
            //
            modal: {
                data: {},
                show: false
            }
        });
    }

    openModal(type, data, modalText, e) {
        this.setState({
            modal: {
                data,
                show: true,
                modalText,
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
//                this.setState(defaultScenario);
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

                this.setState({
                    selectedScenario: Object.assign({}, data),
                    forecastGroups: getForecastGroups(data.ScenarioForecasts),
                    actionableRows: []
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
            selectedScenario,
            modal: Object.assign({}, this.state.modal, {
                data: {
                    name: e.currentTarget.name,
                    text: e.currentTarget.value
                }
            })
        });
    }

    confirm(confirm, e) {
        if (confirm) {
            this.saveScenario(true);
        } else {
            this.resetScenario();
        }
    }

    createScenario(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const scenarioName = formData.get('scenarioName');
        const scenarioDescription = formData.get('scenarioDescription');
        const scenarioMonthEnd = formData.get('scenarioMonthEnd');

        if (!scenarioName || !scenarioDescription || !scenarioMonthEnd) {
            this.openModal('messageModal', {
                message: 'The following cannot be blank:',
                fields: [
                    'Scenario Name',
                    'Scenario Description',
                    'Scenario End Date'
                ]
            });
        } else {
            // TODO: Should be better way to toggle spinner contents!
            this.closeModal();
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
                    forecastGroups: getForecastGroups(res.data.ScenarioForecasts),
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

    // The event is bound to the parent div, so do nothing if the `target` isn't an anchor tag.
    navigateForecastOptions(currentRow, e) {
        e.preventDefault();

        const target = e.target;

        if (target.nodeName.toLowerCase() === 'a') {
            let a = this.state.actionableRows.concat();

            if (!a.length) {
                const forecastGroups = this.state.forecastGroups;
                a = [];

                ['Gross Revenue', '', 'Sales, General, Admin Expenses', 'Non-Operating'].forEach(groupName => {
                    a = a.concat(forecastGroups[groupName].data.toggled);
                });

                // Note that the currentRow isn't the same object (yet) in the `actionableRows` list that was constructed
                // from the forecastGroups.  It will be on subsequent navigations, but initially when the list is seeded
                // we have to search through it manually and overwrite the `currentRow` that is passed to the event handler.
                currentRow = a.filter(item => item.Id === currentRow.Id)[0];
            }

            const indexOf = a.indexOf(currentRow);
            let row;

            if (target.text.toLowerCase() === 'previous') {
                if (indexOf === 0) {
                    window.alert('You are at the first item, there is no previous item!');
                } else {
                    row = a[indexOf - 1];
                }
            } else {
                if (indexOf === a.length - 1) {
                    window.alert('You are at the last item, there is no next item!');
                } else {
                    row = a[indexOf + 1];
                }
            }

            if (row) {
                this.setState({
                    actionableRows: a, // It doesn't hurt to set this again, even if it was previously set by a ForecastOptions nav action.
                    modal: Object.assign({}, this.state.modal, { data: row }),
                    expanded: Object.assign({}, this.state.expanded, { [row.GroupName]: true }) // Automatically expand groups as user
                                                                                                // navigages through them.
                });
            }
        }
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

    resetScenario() {
        this.setState(defaultScenario);
        this.closeModal();
    }

    saveScenario(shouldReset) {
        this.openModal('spinnerModal', null, 'Please wait while we save your scenario');

//        const foo = Object.assign({}, this.state.selectedScenario);
//        console.log(JSON.stringify(foo));

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
                forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
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

    selectGrowth(e) {
        const target = e.currentTarget;
        const isCustom = target.type === 'number';

        // If the input is type="radio", then we need to mixin the `growthPermutation`.
        const selectedForecastOption = Object.assign({}, this.state.modal.data.ScenarioForecastOptions.concat()[0], !isCustom ? growthPermutations[target.value] : {});

        if (isCustom) {
            selectedForecastOption.OveridePercentage = target.value / 100;
        }

        const row = Object.assign({}, this.state.modal.data, { ScenarioForecastOptions: [selectedForecastOption] });

        this.setState({
            modal: Object.assign({}, this.state.modal, { data: row })
        });
    }

    showDates() {
        return `${(this.state.selectedScenario.CurrentStartDate || "mm/dd/yy")} to ${this.state.selectedScenario.CurrentEndDate || "mm/dd/yy"}`;
    }

    showNotes(e) {
        const target = e.currentTarget;

        this.openModal('notesModal', {
            name: target.innerHTML,
            text: this.state.selectedScenario[target.innerHTML]
        });
    }

    toggleExpandCollapse(groupName) {
        this.setState(() =>
            this.state.expanded[groupName] = !this.state.expanded[groupName]
        );
    }

    updateForecastOptions(e) {
        // TODO: Should be better way to toggle spinner contents!
        e.preventDefault();
        this.closeModal();
        this.openModal('spinnerModal');

        const selectedForecastOption = this.state.modal.data.ScenarioForecastOptions.concat()[0];
        const scenarioForecasts = this.state.selectedScenario.ScenarioForecasts.map(scenarioForecast => {
            const arr = scenarioForecast.ScenarioForecastOptions;

            if (arr.length && selectedForecastOption.ScenarioForecastId === scenarioForecast.ScenarioForecastOptions[0].ScenarioForecastId) {
                return Object.assign({}, scenarioForecast, { ScenarioForecastOptions: [selectedForecastOption] });
            }

            return scenarioForecast;
        });

//        const foo = Object.assign({}, this.state.selectedScenario, {
//            ScenarioForecasts: scenarioForecasts // <--- Note the cases are different!!!
//        });
//        console.log(JSON.stringify(foo));

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
                forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
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

        // TODO: What are `Revenue Center` and `Notes`?
        if (e.currentTarget.name === 'retrieveAnother') {
            if (this.state.Description || this.state.Notes) {
                this.openModal('confirmModal');
            } else {
                this.setState(defaultScenario);
            }
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
                    onShowNotes={this.showNotes}
                />

                <ForecastNav
                    navID={this.state.navID}
                    onClick={this.navSelection}
                />

                <section id="groups">
                    <h1>{this.state.selectedScenario.CompanyName || "Company Name"}</h1>
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
                                row={this.state.modal.data}
                                onSelectGrowth={this.selectGrowth}
                                onClose={this.closeModal}
                                onNavigate={this.navigateForecastOptions}
                                onSubmit={this.updateForecastOptions}
                            /> :
                        null
                    }

                    {this.state.modal.show ?
                        this.state.modal.type === 'messageModal' &&
                            <Message
                                data={this.state.modal.data}
                                show={this.state.modal.show}
                                onClose={this.closeModal}
                            /> :
                        null
                    }

                    {this.state.modal.show ?
                        this.state.modal.type === 'notesModal' &&
                            <Notes
                                data={this.state.modal.data}
                                show={this.state.modal.show}
                                onChangeText={this.changeText}
                                onDone={this.closeModal}
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

