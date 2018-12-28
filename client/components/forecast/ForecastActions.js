import React from 'react';

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
                        <label>Scenario Name</label>
                        <input
                            disabled={true}
                            value={this.props.selectedScenario.Name}
                        />
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
                            value={this.props.selectedScenario.Notes ? this.props.selectedScenario.Notes : ''}
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
                            style={!isSelected ? {"backgroundColor": "#ccc"} : {}}
                            className="green-small"
                        />
                        <input
                            type="submit"
                            name="retrieveAnother"
                            onClick={this.props.onRetrieveScenario}
                            value="Retrieve a Scenario"
                            className="green-small"
                        />
                    </div>
                </form>

                <h2>New Scenario</h2>
                <form onSubmit={this.props.onMaybeCreateScenario}>
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
                            placeholder="<scenario end date - mm/dd/yy>"
                            name="scenarioMonthEnd"
                        />
                    </div>
                    <div>
                        <select name="LOB">
                            <option value="">Select LOB</option>
                            {
                                this.props.LOBS.map((name, i) => (
                                    <option key={i} value={name}>{name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <select name="revenueCenter">
                            <option value="">Select Revenue Center</option>
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
                            className="green-small"
                        />
                    </div>
                </form>
            </section>
        );
    }
};

