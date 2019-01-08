import React from 'react';

export default function ForecastActions(props) {
    const isSelected = !!props.selectedScenario.Id;

    return (
        <section id="actions">
            <h2>View Scenario</h2>
            <form>
                <div>
                    <label>Scenario Name</label>
                    <input
                        disabled={true}
                        value={props.selectedScenario.Name}
                    />
                </div>
                <div>
                    <label onClick={isSelected ? props.onShowNotes : () => {}} className="collapsed">Description</label>
                    <textarea
                        name="Description"
                        disabled={!isSelected}
                        value={props.selectedScenario.Description}
                        onChange={props.onChangeText}
                    ></textarea>
                </div>
                <div>
                    <label>Date created</label>
                    <input
                        disabled={true}
                        value={props.selectedScenario.CreatedDateTime}
                    />
                </div>
                <div>
                    <label>Date last modified</label>
                    <input
                        disabled={true}
                        value={props.selectedScenario.ModifiedDateTime}
                    />
                </div>
                <div>
                    <label>Line of business</label>
                    <input
                        disabled={true}
                        value={props.selectedScenario.LOB}
                    />
                </div>
                <div>
                    <label>Revenue center</label>
                    <input
                        disabled={true}
                        value={props.selectedScenario.RevenueCenter}
                    />
                </div>
                <div>
                    <label onClick={isSelected ? props.onShowNotes : () => {}} className="collapsed">Notes</label>
                    <textarea
                        name="Notes"
                        disabled={!isSelected}
                        value={props.selectedScenario.Notes ? props.selectedScenario.Notes : ''}
                        onChange={props.onChangeText}
                    ></textarea>
                </div>
                <div>
                    <input
                        type="submit"
                        name="save"
                        disabled={!isSelected}
                        onClick={props.onUpdateScenario}
                        value="Save"
                        style={!isSelected ? {"backgroundColor": "#ccc"} : {}}
                        className="green-small"
                    />
                    <input
                        type="submit"
                        name="retrieveAnother"
                        onClick={props.onRetrieveScenario}
                        value="Retrieve a Scenario"
                        className="green-small"
                    />
                </div>
            </form>

            <h2>New Scenario</h2>
            <form onSubmit={props.onMaybeCreateScenario}>
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
                    <select onChange={props.onChangeUploadDate} value={props.uploadDate} name="scenarioMonthEnd">
                        <option value="">Select Scenario End Date</option>
                        {
                            props.reportDates.map((name, i) => (
                                <option key={i} value={name}>{name}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <select name="LOB">
                        <option value="">Select LOB</option>
                        {
                            props.LOBS.map((name, i) => (
                                <option key={i} value={name}>{name}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <select name="revenueCenter">
                        <option value="">Select Revenue Center</option>
                        {
                            props.scenarios.map(scenario => (
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

