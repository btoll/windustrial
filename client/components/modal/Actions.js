import React from 'react';

function Actions(props) {
    return (
        <div id="actions">
            <div>
                <h5>Build a new scenario</h5>
                <form onSubmit={props.onCreateScenario}>
                    <div>
                        <label>Scenario Name</label>
                        <input type="text" name="scenarioName" />
                    </div>
                    <div>
                        <label>Scenario Description</label>
                        <input type="text" name="scenarioDescription" />
                    </div>
                    <div>
                        <label>Scenario Month End</label>
                        <input type="text" name="scenarioMonthEnd" />
                    </div>
                    <div>
                        <label></label>
                        <input type="submit" value="Create" />
                    </div>
                </form>
            </div>
            <div>
                <h5>Retrieve a saved scenario</h5>
                <select onChange={props.onScenarioChange}>
                    <option value="0">Choose a scenario</option>
                    {
                        props.scenarios.map(scenario => (
                            <option key={scenario.Id} value={scenario.Id}>{scenario.Name}, {scenario.Description}</option>
                        ))
                    }
                </select>
            </div>
            <div>
                <h5>Update saved scenario</h5>
                <button>Update saved scenario</button>
            </div>
            <div>
                <h5>Evaluate performance</h5>
            </div>
            <div>
                <h5>Build Overrides</h5>
            </div>
        </div>
    );
}

export default Actions;

