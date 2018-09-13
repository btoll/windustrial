import React from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { FaCaretUp, FaCaretRight, FaCaretLeft, FaCaretDown } from 'react-icons/lib/fa';

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
                'Gross Revenue': false,
                'COGS Total': false,
                'Gross Margin': false,
                'Sales, General & Admin': false,
                'Profit': false,
                'Non Operating': false
            },
            pastVisible: true,

            scenario: {},
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
            parentRow: {
                fontWeight: 'bold',
                cursor: 'pointer'
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
        this.handleChange = this.handleChange.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    actionChange(e) {
        // Prompt to save or otherwise disallow since the source data has been updated/changed.
        if (this.state.dirty) {
            console.log('dirty');
        }
    }

    handleChange(scenario, row, e) {
        if (e.target.value * 1) {
            axios.post(`http://localhost:3001/api/scenario/${scenario.name}/${scenario.description}/${scenario.monthEnd}`, {
                rowId: row.Id,
                percent: e.target.value
            })
            .then(res => {
                this.setState({
                    forecast: getForecastGroups(res.data.ScenarioForecasts)
                });
            })
            .catch(console.log);

            this.setState({dirty: true});
        }
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

    renderGroup(groupName) {
        return (
            <div>
                <div style={this.styles.parentRow} className='row'>
                    <div className='col col-sm-2'>{groupName || 'COGS'}</div>
                </div>
                <div>
                    {this.renderGroupRows(groupName)}
                </div>
            </div>
        );
    }

    renderGroupRows(groupName) {
        const group = this.state.forecast[groupName];
        return group.map((c, index) => {
            return <div key={index}>
                <ForecastGroup
                    key={c.Id}
                    row={c}
                    scenario={this.state.scenario}
                    handleChange={this.handleChange}
                 />
            </div>;
        })
    }

    componentWillMount() {
        axios.get('http://localhost:3001/api/scenario/42')
        .then(res => {
            const data = res.data;
            const forecasts = res.data.ScenarioForecasts;

            this.setState({
                scenario: {
                    id: data.Id,
                    createdDateTime: data.CreateDateTime,
                    description: data.Description,
                    LOB: data.LOB,
                    monthEnd: data.CurrentEndDate,
                    name: data.Name
                },
                forecast: getForecastGroups(forecasts)
            });
        })
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
                    scenario={this.state.scenario}

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
                    {this.renderGroup('Gross Revenue')}
                    {this.renderGroup('')}
                    {this.renderGroup('Sales, General, Admin Expenses')}
                    {this.renderGroup('Non-Operating')}
                </div>

                <input onClick={() => {}} type='button' className='actionButton' value='Save' />
            </div>
        )
    }
}

export default Forecast;

