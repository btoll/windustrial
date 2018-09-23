import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { FaCaretUp, FaCaretRight, FaCaretLeft, FaCaretDown } from 'react-icons/lib/fa';

import { SCENARIO_ENDPOINT_BASE } from './config';
import ForecastGroup from './ForecastGroup';
import ForecastHeader from '../components/ForecastHeader';

const getForecastGroups = data => ({
    'Gross Revenue': data.filter(d => d.GroupName === 'Gross Revenue'),
    'Non-Operating': data.filter(d => d.GroupName === 'Non-Operating'),
    'Sales, General, Admin Expenses': data.filter(d => !!~d.GroupName.indexOf('Sales')),
    '': data.filter(d => !d.GroupName) // COGS
});

class Forecast extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: {
//                'Gross Revenue': false,
//                'COGS Total': false,
//                'Gross Margin': false,
//                'Sales, General & Admin': false,
//                'Profit': false,
//                'Non Operating': false
                'Gross Revenue': false,
                'Non-Operating': false,
                'Sales, General, Admin Expenses': false,
                '': false
            },
            pastVisible: true,

            overrides: {
                percentage: {}
            },

            selected: {},
            scenarios: [],
            forecast: {
                'Gross Revenue': [],
                'Non-Operating': [],
                'Sales, General, Admin Expenses': [],
                '': [] // COGS
            },
            modal: {
                show: false,
                type: null
            },
            dirty: false
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

        this.actionChange = this.actionChange.bind(this);
        this.handlePercentageChange = this.handlePercentageChange.bind(this);
        this.handleScenarioChange = this.handleScenarioChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleExpandCollapse = this.toggleExpandCollapse.bind(this);
    }

    actionChange(e) {
        // Prompt to save or otherwise disallow since the source data has been updated/changed.
        if (this.state.dirty) {
            console.log('dirty');
        }
    }

    handlePercentageChange(scenario, row, e) {
        const overrides = Object.assign({}, this.state.overrides);

        // This will catch "0", "0.0", "" and NaN.
        if (!(e.target.value * 1)) {
            delete overrides.percentage[row.Id];
        } else {
            overrides.percentage[row.Id] = e.target.value / 100;
        }

        axios.post(`${SCENARIO_ENDPOINT_BASE}/${scenario.id}`, {
            overrides: overrides
        })
        .then(res => {
            this.setState({
                forecast: getForecastGroups(res.data.ScenarioForecasts)
            });
        })
        .catch(console.log);

        this.setState({
            overrides: overrides,
            dirty: true
        });
    }

    handleScenarioChange(e) {
        // Now get a specific scenario.
        axios.get(`${SCENARIO_ENDPOINT_BASE}/${e.target.value}`)
        .then(res => {
            const data = res.data;
            const forecasts = res.data.ScenarioForecasts;

            this.setState({
                selected: {
                    id: data.Id,
                    createdDateTime: data.CreateDateTime,
                    description: data.Description,
                    LOB: data.LOB,
                    monthEnd: data.CurrentEndDate,
                    name: data.Name
                },
                forecast: getForecastGroups(forecasts)
            });

            this.closeModal();
        })
        .catch(console.log);
    }

    openModal(type, e) {
        this.setState({
            modal: {
                show: true,
                type
            }
        });
    }

    closeModal(e) {
        this.setState({
            modal: {
                show: false
            }
        });
    }

    toggleExpandCollapse(groupName) {
        this.setState(() =>
            this.state.expanded[groupName] = !this.state.expanded[groupName]
        );
    }

    renderGroup(groupName) {
        return (
            <div key={groupName}>
                <h5
                    onClick={this.toggleExpandCollapse.bind(null, groupName)}
                    className={this.state.expanded[groupName] ? 'collapsed' : 'expanded'}
                    style={{'cursor': 'pointer'}}
                >{groupName || 'COGS'}</h5>

                {/* Render group rows. */}
                {
                    this.state.forecast[groupName].map(c => (
                        <ForecastGroup
                            key={c.Id}
                            row={c}
                            scenario={this.state.selected}
                            handlePercentageChange={this.handlePercentageChange}
                            expanded={this.state.expanded[groupName]}
                        />
                    ))
                }
            </div>
        );
    }

    componentWillMount() {
        // First, get all scenarios.
        axios.get(`${SCENARIO_ENDPOINT_BASE}`)
        .then(res =>
            this.setState({
                scenarios: res.data
            })
        )
        .catch(console.log);
    }

    render() {
        const pastClass1 = classNames({
            'col': true,
            'col-sm-1': true,
            'pull-left': true,
            'text-right': true
        });
        const pastClass2 = classNames({
            'col': true,
            'col-sm-2': true,
            'pull-left': true,
            'text-right': true
        });
        return (
            <div>
                <ForecastHeader
                    modal={this.state.modal}
                    scenarios={this.state.scenarios}
                    selected={this.state.selected}

                    handleScenarioChange={this.handleScenarioChange}
                    actionChange={this.actionChange}
                    closeModal={this.closeModal}
                    openModal={this.openModal}
                />

                <div className='container-fluid'>
                    <div style={this.styles.headerRow} className='row'>
                        <div className='col col-sm-2'></div>
                        <div className={pastClass2}>Past</div>
                        <div className='col col-sm-2 pull-left text-right'>Current</div>
                        <div className={pastClass1}></div>
                        <div className='col col-sm-2 pull-left text-right'>Future</div>
                        <div className='col col-sm-1 pull-left text-right'></div>
                    </div>
                    <div style={this.styles.subHeaderRow} className='row'>
                        <div className='col col-sm-2'></div>
                        <div className={pastClass2}></div>
                        <div className='col col-sm-2 pull-left text-right'></div>
                        <div className={pastClass1}>% +/-</div>
                        <div className='col col-sm-2 pull-left text-right'></div>
                        <div className='col col-sm-1 pull-left text-right'>% +/-</div>
                    </div>
                    {
                        ['Gross Revenue', '', 'Sales, General, Admin Expenses', 'Non-Operating']
                        .map(this.renderGroup.bind(this))
                    }
                </div>

                <input onClick={() => {}} type='button' className='actionButton' value='Save' />
            </div>
        )
    }
}

export default Forecast;

