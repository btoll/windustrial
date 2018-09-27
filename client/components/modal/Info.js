import React from 'react';

function Info(props) {
    return (
        <form id="infoForm">
            <div>
                <label>Scenario Name</label>
                <input value={props.scenario.Name} />
            </div>
            <div>
                <label>Target Timeframe</label>
                <span>{props.scenario.Name}</span>
            </div>
            <div>
                <label>Date Created</label>
                <span>{props.scenario.CreatedDateTime}</span>
            </div>
            <div>
                <label>Line of Business</label>
                <span>{props.scenario.LOB}</span>
            </div>
            <div>
                <label>Revenue Center</label>
                <span>{props.scenario.Name}</span>
            </div>
            <div>
                <label>Scenario Builder</label>
                <span>{props.scenario.Name}</span>
            </div>
        </form>
    );
}

export default Info;

