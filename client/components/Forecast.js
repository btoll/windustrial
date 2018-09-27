import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { FaCaretUp, FaCaretRight, FaCaretLeft, FaCaretDown } from 'react-icons/lib/fa';

import { AUTH, SCENARIO_ENDPOINT_BASE } from './config';
import ForecastGroup from './ForecastGroup';
import ForecastHeader from '../components/ForecastHeader';

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

class Forecast extends React.Component {
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
                show: false,
                type: null
            },
            percentages: [],
            scenarios: [],
            selected: {}
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
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleExpandCollapse = this.toggleExpandCollapse.bind(this);

        this.createScenario = this.createScenario.bind(this);
        this.handleScenarioChange = this.handleScenarioChange.bind(this);
    }

    actionChange(e) {
        // Prompt to save or otherwise disallow since the source data has been updated/changed.
        if (this.state.dirty) {
            console.log('dirty');
        }
    }

    handlePercentageChange(row, rowNum, e) {
        const target = e.target;
        let percentages = this.state.percentages.concat();
        let col, value;

        if (target.dataset.col) {
            col = target.dataset.col;
            value = target.value;
        } else {
            // TODO: Error checking!
            [col, value] = JSON.parse(target.value);
        }

        // This will catch "0", "0.0", "" and NaN.
        if (!(value * 1)) {
            percentages = percentages.filter(p => p.Id !== row.Id);
        } else {
            let found = false;

            percentages = percentages.map(p => {
                if (p.Id === row.Id) {
                    found = true;
                    p.Value = value / 100;
                }
                return p;
            });

            if (!found) {
                percentages.push({
                    Id: row.Id,
                    ColumnName: col,
                    RowNumber: rowNum,
                    Value: value / 100
                });
            }
        }

        const req = Object.assign({}, this.state.selected);
        req.ScenarioForecastOptions = percentages;

        axios({
            method: 'put',
            url: `${SCENARIO_ENDPOINT_BASE}/${this.state.selected.Id}`,
            headers: {
                'AuthorizationToken': this.state.authToken
            },
            data: req
        })
        .then(res =>
            this.setState({
                forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
            })
        )
        .catch(console.log);

        this.setState({
            percentages: percentages,
            dirty: true
        });
    }

    createScenario(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        axios({
            method: 'post',
            url: `${SCENARIO_ENDPOINT_BASE}/${formData.get('scenarioName')}/${formData.get('scenarioDescription')}/${formData.get('scenarioMonthEnd')}`,
            headers: {
                'AuthorizationToken': this.state.authToken
            }
        })
        .then(res =>
            this.setState({
                forecastGroups: getForecastGroups(res.data.ScenarioForecasts)
            })
        )
        .catch(console.log);

        this.closeModal();
    }

    handleScenarioChange(e) {
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
                selected: (() => {
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
        const group = this.state.forecastGroups[groupName];
        const groupData = group.data;
        const groupRows = group.rows;

        return (
            <div style={{'marginBottom': '30px'}} key={groupName}>
                <h5
                    onClick={this.toggleExpandCollapse.bind(null, groupName)}
                    className={this.state.expanded[groupName] ? 'collapsed' : 'expanded'}
                    style={{'cursor': 'pointer'}}
                >{groupName || 'COGS'}</h5>

                {/* Render group rows. */}
                {
                    groupData.map((c, i) => (
                        <ForecastGroup
                            key={c.Id}
                            row={c}
                            rowNum={groupRows[i]}
                            handlePercentageChange={this.handlePercentageChange}
                            expanded={this.state.expanded[groupName]}
                        />
                    ))
                }
            </div>
        );
    }

    componentDidMount() {
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
        }).then(res =>
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

                    actionChange={this.actionChange}
                    closeModal={this.closeModal}
                    openModal={this.openModal}

                    createScenario={this.createScenario}
                    handleScenarioChange={this.handleScenarioChange}
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
                        Object.keys(this.state.selected).length ?
                            ['Gross Revenue', '', 'Sales, General, Admin Expenses', 'Non-Operating']
                            .map(this.renderGroup.bind(this))
                        : <div style={{'display': 'none'}}></div>
                    }
                </div>

                <input onClick={() => {}} type='button' className='actionButton' value='Save' />
            </div>
        )
    }
}

export default Forecast;

