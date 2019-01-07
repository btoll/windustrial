import React from 'react';
import ReactModal from 'react-modal';

import ForecastActions from './ForecastActions';
import ForecastGroup from './ForecastGroup';
import ForecastNav from './ForecastNav';

import Login from '../Login';
import Modal from '../modal/Modal';
import * as api from '../api';

const formatDate = s =>
    s.replace(/(\d{4})-(\d{2})-(\d{2}).*/g, (matched, _1, _2, _3) => `${_2}/${_3}/${_1.slice(-2)}`);

/*
 * data.all       - Used by expand/collaps functionaliy.
 * data.untoggled - Used by expand/collaps functionaliy.
 * data.toggled   - Used by `ForecastOptions` modal nav functionality.
 */
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

const defaultScenario = {
    action: {}, // Remove the handlers.
    actionableRows: [],
    expanded: {
        'Gross Revenue': false,
        'Non-Operating': false,
        'Sales,General,Admin Expenses': false,
        'COGS': false
    },
    hardSave: false,
    softSave: false,
    selectedScenario: {
        Id: 0,
        CreatedDateTime: '',
        Description: '',
        LOB: '',
        ModifiedDateTime: '',
        Name: '',
        Notes: ''
    }
};

export default class ForecastMain extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: true,

            expanded: {
                'Gross Revenue': false,
                'Non-Operating': false,
                'Sales,General,Admin Expenses': false,
                'COGS': false
            },
            forecastGroups: {
                'Gross Revenue': [],
                'Non-Operating': [],
                'Sales,General,Admin Expenses': [],
                'COGS': []
            },
            modal: {
                data: {},
                show: false,
                text: '',
                type: null
            },
            percentages: [],
            scenarios: [],
            companyName: '',
            LOBS: [],
            selectedScenario: {},
            selectedRetrievalRow: '',

            softSave: false, // Will popup a Confirm modal when retrieving another scenario or saving when `true`.
                             // Triggered when Description or Notes is changed (see `changeText` handler).

            hardSave: false, // Will popup a Confirm modal when saving when value is `true`.
                             // Triggered when a Forecast Option is changed (see `api.updateForecastOptions` function).

            action: {}, // Holds the `confirm` handlers (both Yes and No).

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

            }
        }

        this.confirm = this.confirm.bind(this);

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleExpandCollapse = this.toggleExpandCollapse.bind(this);

        this.changeScenario = this.changeScenario.bind(this);
        this.changeText = this.changeText.bind(this);
        this.deleteScenario = this.deleteScenario.bind(this);
        this.maybeCreateScenario = this.maybeCreateScenario.bind(this);
        this.resetScenario = this.resetScenario.bind(this);
        this.retrieveScenario = this.retrieveScenario.bind(this);
        this.saveScenario = this.saveScenario.bind(this);
        this.selectRetrievalRow = this.selectRetrievalRow.bind(this);
        this.updateScenario = this.updateScenario.bind(this);

        this.navigateForecastOptions = this.navigateForecastOptions.bind(this);
        this.updateForecastOptions = this.updateForecastOptions.bind(this);

        this.navSelection = this.navSelection.bind(this);
        this.selectForecastOption = this.selectForecastOption.bind(this);
        this.showDate = this.showDate.bind(this);
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

    openModal(type, modalData, e) {
        if (e) {
            e.preventDefault();
        // Duck typing!
        } else if (modalData && modalData.preventDefault) {
            modalData.preventDefault();
        }

        const [data, text] = (typeof modalData !== 'object') ?
            [null, modalData] :
            [modalData.data, modalData.text];

        this.setState({
            modal: {
                data,
                show: true,
                text,
                type
            }
        });
    }

    changeText(e) {
        const selectedScenario = Object.assign({}, this.state.selectedScenario);
        selectedScenario[e.currentTarget.name] = e.currentTarget.value;

        this.setState({
            selectedScenario,
            softSave: true,
            modal: Object.assign({}, this.state.modal, {
                data: {
                    name: e.currentTarget.name,
                    text: e.currentTarget.value
                }
            })
        });
    }

    async changeScenario(e) {
        // TODO: Should be better way to toggle spinner contents!
        this.closeModal();
        this.openModal('spinnerModal');
        await api.changeScenario.call(this);
        this.closeModal();
    }

    confirm(confirm, e) {
        const action = this.state.action;

        if (confirm) {
            if (action.yes) {
                action.yes();
            }
        } else {
            if (action.no) {
                action.no();
            }
        }
    }

    async createScenario(formData) {
        const scenarioName = formData.get('scenarioName');
        const scenarioDescription = formData.get('scenarioDescription');
        const LOB = formData.get('LOB');
        const revenueCenter = formData.get('revenueCenter');
        const scenarioMonthEnd =
            // Format MM/DD/YY to YYYYMMDD.
            formData.get('scenarioMonthEnd')
            .replace(/^(\d{2})\/(\d{2})\/(\d{2})$/, (matched, month, day, year) => (
                `20${year}-${month}-${day}`
            ));
        // TODO: Error checking for `scenarioMonthEnd` date!

        if (!scenarioName || !scenarioDescription || !scenarioMonthEnd || !LOB) {
            this.openModal('messageModal', {
                data: {
                    message: 'The following cannot be blank:',
                    fields: [
                        'Scenario Name',
                        'Scenario Description',
                        'Scenario End Date',
                        'LOB'
                    ]
                }
            });
        } else {
            // TODO: Should be better way to toggle spinner contents!
            this.closeModal();
            this.openModal('spinnerModal');
            await api.createScenario.call(this, scenarioName, scenarioDescription, scenarioMonthEnd, LOB, revenueCenter);
            this.closeModal();
        }
    }

    deleteScenario(scenarioID) {
        this.setState({
            action: {
                yes: async () => {
                    this.openModal('spinnerModal', 'Please wait while we delete your scenario');
                    await api.deleteScenario.call(this, scenarioID);
                    this.closeModal();
                }
            }
        });

        this.openModal('confirmModal', {
            data: {
                confirmType: 'delete'
            }
        });
    }

    getForecastGroups(data) {
        return {
            'COGS': {
                data: (data => {
                    const filtered = data.filter(d => d.GroupName === 'COGS')
                    return {
                        all: filtered,
                        toggled: filtered.slice(0, -2),
                        nonToggled: filtered.slice(-2)
                    };
                })(data)
            },
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
                        toggled: filtered.slice(0, -1),
                        nonToggled: filtered.slice(-1)
                    };
                })(data)
            },
            'Sales,General,Admin Expenses': {
                data: (data => {
                    const filtered = data.filter(d => d.GroupName.includes('Admin Expenses'))
                    return {
                        all: filtered,
                        toggled: filtered.slice(0, -2),
                        nonToggled: filtered.slice(-2)
                    };
                })(data)
            }
        };
    }

    // Used this pattern before at Sencha, continue?
    maybeCreateScenario(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        if (this.state.softSave || this.state.hardSave) {
            // TODO: Maybe put this elsewhere so it's not created every time this function is called.
            const cb = this.createScenario.bind(this, formData);
            this.setState({
                action: {
                    no: cb,
                    yes: async () => {
                        this.closeModal();
                        this.openModal('spinnerModal', 'Please wait while we save your scenario');

                        if (this.state.hardSave) {
                            await api.createScenario.call(this);
                        } else {
                            await api.updateScenario.call(this);
                        }

                        this.closeModal();
                        cb();
                    }
                }
            });

            this.openModal('confirmModal', {
                data: {
                    confirmType: 'save',
                    hardSave: this.state.hardSave,
                    softSave: this.state.softSave
                }
            });
        } else {
            this.createScenario(formData);
        }
    }

    navSelection(e) {
        e.preventDefault();

        const name = e.target.name;

        if (name) {
            if (name === 'logout') {
                this.props.cookies.remove('authToken');
            }

            this.setState({
                loggedIn: name !== 'logout',
                navID: name
            });
        }
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

                ['Gross Revenue', 'COGS', 'Sales,General,Admin Expenses', 'Non-Operating'].forEach(groupName => {
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
                    modal: Object.assign({}, this.state.modal, {
                        data: {
                            row
                        }
                    }),
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

    retrieveScenario(e) {
        e.preventDefault();

        if (this.state.softSave || this.state.hardSave) {
            // TODO: Maybe put this elsewhere so it's not created every time this function is called.
            const cb = this.openModal.bind(this, 'retrieveScenarioModal');
            this.setState({
                action: {
                    no: cb,
                    yes: async () => {
                        this.closeModal();
                        this.openModal('spinnerModal', 'Please wait while we save your scenario');

                        if (this.state.hardSave) {
                            await api.saveScenario.call(this);
                        } else {
                            await api.updateScenario.call(this);
                        }

                        this.closeModal();
                        cb();
                    }
                }
            });

            this.openModal('confirmModal', {
                data: {
                    confirmType: 'save',
                    hardSave: this.state.hardSave,
                    softSave: this.state.softSave
                }
            });
        } else {
            this.openModal('retrieveScenarioModal');
        }
    }

    saveScenario(shouldReset) {
        if (this.state.hardSave) {
            this.setState({
                action: {
                    yes: () => {
                        this.openModal('spinnerModal', 'Please wait while we save your scenario');
                        api.saveScenario.call(this, shouldReset, defaultScenario);
                    }
                }
            });

            this.openModal('confirmModal', {
                data: {
                    confirmType: 'save',
                    hardSave: this.state.hardSave
                }
            });
        } else {
            this.openModal('spinnerModal', 'Please wait while we save your scenario');
            api.saveScenario.call(this, shouldReset, defaultScenario);
        }
    }

    selectForecastOption(e) {
        const target = e.currentTarget;
        const isCustom = target.type === 'number';
        const statefulRow = this.state.modal.data.row;

        // If the input is type="radio", then we need to mixin the `growthPermutation`.
        const selectedForecastOption = Object.assign({}, statefulRow.ScenarioForecastOptions.concat()[0], !isCustom ? growthPermutations[target.value] : {});

        if (isCustom) {
            selectedForecastOption.OveridePercentage = target.value / 100;
        }

        const row = Object.assign({}, statefulRow, { ScenarioForecastOptions: [selectedForecastOption] });

        this.setState({
            modal: Object.assign({}, this.state.modal, {
                data: {
                    row,
                    dirty: true
                }
            })
        });
    }

    selectRetrievalRow(e) {
        const target = e.target;

        if (
            target.parentNode &&
            target.parentNode.nodeName.toLowerCase() === 'tr' &&
            target.parentNode.classList.contains('retrieve-scenario-row')
        ) {
            this.setState({
                selectedRetrievalRow: target.parentNode.id
            });
        }
    }

    showDate(field) {
        return `${this.state.selectedScenario[field] && formatDate(this.state.selectedScenario[field]) || "mm/dd/yy"}`;
    }

    showNotes(e) {
        const target = e.currentTarget;

        this.openModal('notesModal', {
            data: {
                name: target.innerHTML,
                text: this.state.selectedScenario[target.innerHTML]
            }
        });
    }

    toggleExpandCollapse(groupName) {
        this.setState(() =>
            this.state.expanded[groupName] = !this.state.expanded[groupName]
        );
    }

    async updateForecastOptions(e) {
        e.preventDefault();

        if (e.currentTarget.querySelector('input[type=submit').value === 'Exit') {
            this.closeModal();
        } else {
            // TODO: Should be better way to toggle spinner contents!
            this.closeModal();
            this.openModal('spinnerModal');
            await api.updateForecastOptions.call(this);
            this.closeModal();
        }
    }

    async updateScenario(e) {
        e.preventDefault();

        if (this.state.hardSave) {
            this.setState({
                action: {
                    yes: async () => {
                        this.openModal('spinnerModal', 'Please wait while we save your scenario');
                        await api.saveScenario.call(this);
                        this.closeModal();
                    },
                    no: this.closeModal.bind(this)
                }
            });

            this.openModal('confirmModal', {
                data: {
                    confirmType: 'save',
                    hardSave: this.state.hardSave
                }
            });
        } else {
            this.closeModal();
            this.openModal('spinnerModal', 'Please wait while we save your scenario...');
            await api.updateScenario.call(this);
            this.closeModal();
        }
    }

    render() {
        return this.props.authToken && this.state.loggedIn ? (
            <>
                <section id="banner">
                    <h1>Business Forecasting Tool</h1>
                </section>

                <ForecastActions
                    modal={this.state.modal}
                    scenarios={this.state.scenarios}
                    LOBS={this.state.LOBS}
                    selectedScenario={this.state.selectedScenario}
                    onChangeText={this.changeText}
                    onMaybeCreateScenario={this.maybeCreateScenario}
                    onRetrieveScenario={this.retrieveScenario}
                    onOpenModal={this.openModal}
                    onUpdateScenario={this.updateScenario}
                    onShowNotes={this.showNotes}
                />

                <ForecastNav
                    navID={this.state.navID}
                    onClick={this.navSelection}
                />

                <section id="groups">
                    <h1>{this.state.companyName || "Company Name"}</h1>
                    <div style={this.styles.headerRow} className="header row">
                        <div className="col1"></div>
                        <div className="col2">Past</div>
                        <div className="col3">Current</div>
                        <div className="col4"></div>
                        <div className="col5">Future</div>
                        <div className="col6"></div>
                    </div>
                    <div style={this.styles.subHeaderRow} className="header row">
                        <div className="col1"></div>
                        <div className="col2">{this.showDate('CurrentStartDate')} to<br />{this.showDate('CurrentEndDate')}</div>
                        <div className="col3">{this.showDate('CurrentStartDate')} to<br />{this.showDate('CurrentEndDate')}</div>
                        <div className="col4">Growth<br />Rate</div>
                        <div className="col5">{this.showDate('CurrentStartDate')} to<br />{this.showDate('CurrentEndDate')}</div>
                        <div className="col6">Growth<br />Rate</div>
                    </div>

                    {
                        !!this.state.selectedScenario.Id ?
                            ['Gross Revenue', 'COGS', 'Sales,General,Admin Expenses', 'Non-Operating']
                            .map(this.renderGroup.bind(this))
                        : <div style={{'display': 'none'}}></div>
                    }

                    {
                        this.state.modal.show &&
                            <Modal app={this} />
                    }

                    {
                        !!this.state.selectedScenario.Id &&
                            <button
                                className="green-large"
                                onClick={this.deleteScenario.bind(this, this.state.selectedScenario.Id)}
                            >
                                Delete Scenario
                            </button>
                    }
                </section>
            </>
        ) :
            <Login authToken={this.props.authToken} />
    }

    async componentDidMount() {
        this.openModal('spinnerModal');
        await api.getAllScenarios.call(this);
        await api.getLOBS.call(this);
        this.closeModal();
    }
}

