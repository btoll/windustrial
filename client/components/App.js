import React, { Component } from 'react';
import axios from 'axios';

import SectionHeader from '../components/SectionHeader';
import SectionDetails from '../components/SectionDetails';

const getForecastGroups = data => ({
    'Gross Revenue': data.filter(d => d.GroupName === 'Gross Revenue'),
    'Non-Operating': data.filter(d => d.GroupName === 'Non-Operating'),
    'Sales, General, Admin Expenses': data.filter(d => !!~d.GroupName.indexOf('Sales')),
    '': data.filter(d => !d.GroupName) // COGS
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scenario: {},
            forecast: {
                'Gross Revenue': [],
                'Non-Operating': [],
                'Sales, General, Admin Expenses': [],
                '': [] // COGS
            }
        };

        this.handleChange = this.handleChange.bind(this);
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
        }
    }

    componentWillMount() {
        axios.get('http://localhost:3001/api/scenario/42')
        .then(res => {
            const data = res.data;
            const forecasts = res.data.ScenarioForecasts;

            this.setState({
                scenario: {
                    id: data.Id,
                    name: data.Name,
                    description: data.Description,
                    monthEnd: data.CurrentEndDate
                },
                forecast: getForecastGroups(forecasts)
            });
        })
        .catch(console.log);
    }

    render() {
        return (
            <div>
                <div>
                    <SectionHeader
                        text={
                            {
                                scenarioName: this.state.scenario.name,
                                targetTimeframe: 'CY 2018',
                                dateCreated: 'Feb-18',
                                lineOfBusiness: 'Combined',
                                revenueCenter: 'n/a'
                            }
                        }
                    />
                    <SectionDetails
                        scenario={this.state.scenario}
                        forecast={this.state.forecast}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
}

export default App;

