import React from 'react';

class Info extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scenarioName: props.scenario.Name
        };

        this.onChangeScenarioName = this.onChangeScenarioName.bind(this);
    }

    onChangeScenarioName(e) {
        this.setState({
            scenarioName: e.target.value
        });
    }

    render() {
        return (
            <form id="infoForm" onSubmit={this.props.onUpdateScenarioInfo}>
                <div>
                    <label>Scenario Name</label>
                    <input name="scenarioName" onChange={this.onChangeScenarioName} value={this.state.scenarioName} />
                </div>
                <div>
                    <label>Target Timeframe</label>
                    <span>{this.props.scenario.Name}</span>
                </div>
                <div>
                    <label>Date Created</label>
                    <span>{this.props.scenario.CreatedDateTime}</span>
                </div>
                <div>
                    <label>Line of Business</label>
                    <span>{this.props.scenario.LOB}</span>
                </div>
                <div>
                    <label>Revenue Center</label>
                    <span>{this.props.scenario.Name}</span>
                </div>
                <div>
                    <label>Scenario Builder</label>
                    <span>{this.props.scenario.Name}</span>
                </div>
                <div>
                    <label style={{'visibility': 'hidden'}}></label>
                    <input type="submit" value="Update" />
                </div>
            </form>
        );
    }
}

export default Info;

