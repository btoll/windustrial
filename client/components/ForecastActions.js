import React from 'react';

//
//                <h2>Update Scenario</h2>
//                <p>This uploads current financial data to the selected scenario</p>
//                <form>
//                    <div>
//                        <input
//                            type="submit"
//                            value="Upload Current Financial Data"
//                        />
//                    </div>
//                </form>
//
export default class ForecastActions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isSelected = !!this.props.selectedScenario.Id;

        return (
            <section id="actions">
                <h2>View Scenario</h2>
                <form>
                    <div>
                        <label>{isSelected ? 'Selected' : 'Retrieve'} scenario</label>
                        <select
                            disabled={isSelected}
                            onChange={this.props.onChangeScenario}
                            value={this.props.selectedScenario.Id}
                        >
                            <option value="0">Select scenario</option>
                            {
                                this.props.scenarios.map(scenario => (
                                    <option key={scenario.Id} value={scenario.Id}>{scenario.Name}, {scenario.Description}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <label onClick={isSelected ? this.props.onShowNotes : () => {}} className="collapsed">Description</label>
                        <textarea
                            name="Description"
                            disabled={!isSelected}
                            value={this.props.selectedScenario.Description}
                            onChange={this.props.onChangeText}
                        ></textarea>
                    </div>
                    <div>
                        <label>Date created</label>
                        <input
                            disabled={true}
                            value={this.props.selectedScenario.CreatedDateTime}
                        />
                    </div>
                    <div>
                        <label>Date last modified</label>
                        <input
                            disabled={true}
                            value={this.props.selectedScenario.ModifiedDateTime}
                        />
                    </div>
                    <div>
                        <label>Line of business</label>
                        <input
                            disabled={true}
                            value={this.props.selectedScenario.LOB}
                        />
                    </div>
                    <div>
                        <label>Revenue center</label>
                        <input
                            disabled={true}
                            value={this.props.selectedScenario.RevenueCenter}
                        />
                    </div>
                    <div>
                        <label onClick={isSelected ? this.props.onShowNotes : () => {}} className="collapsed">Notes</label>
                        <textarea
                            name="Notes"
                            disabled={!isSelected}
                            value={this.props.selectedScenario.Notes}
                            onChange={this.props.onChangeText}
                        ></textarea>
                    </div>
                    <div>
                        <input
                            type="submit"
                            name="save"
                            disabled={!isSelected}
                            onClick={this.props.onUpdateScenario}
                            value="Save"
                        />
                        <input
                            type="submit"
                            name="retrieveAnother"
                            disabled={!isSelected}
                            onClick={this.props.onUpdateScenario}
                            value="Retrieve Another"
                        />
                    </div>
                </form>

                <h2>New Scenario</h2>
                <form onSubmit={this.props.onCreateScenario}>
                    <div>
                        <input
                            placeholder="<enter scenario name>"
                            name="scenarioName"
                        />
                    </div>
                    <div>
                        <input
                            placeholder="<enter description - optional>"
                            name="scenarioDescription"
                        />
                    </div>
                    <div>
                        <input
                            placeholder="<scenario end date - YYYYMMDD>"
                            name="scenarioMonthEnd"
                        />
                    </div>
                    <div>
                        <select>
                            <option value="0">Select LOB</option>
                            {
                                ['Commercial Lines', 'Gross', 'Other'].map((name, i) => (
                                    <option key={i} value={name}>{name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <select
                            disabled={isSelected}
                            onChange={this.props.onChangeScenario}
                            value={this.props.selectedScenario.Id}
                        >
                            <option value="0">Select scenario</option>
                            {
                                this.props.scenarios.map(scenario => (
                                    <option key={scenario.Id} value={scenario.Id}>{scenario.Name}, {scenario.Description}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <input
                            type="submit"
                            value="Upload Current Financial Data"
                        />
                    </div>
                </form>
            </section>
        );
    }
};

