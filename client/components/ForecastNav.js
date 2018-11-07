import React from 'react';
import ReactModal from 'react-modal';

import Spinner from './modal/Spinner';

export default class ForecastHeader extends React.Component {
    constructor(props) {
        super(props);

        // For aria, should hide underyling dom elements when modal is shown.
        // (Doesn't appear to be working.)
        ReactModal.setAppElement('#root');
    }

    render() {
        const isSelected = !!this.props.selectedScenario.Id;

        return (
            <nav>
                <h2>View Scenario</h2>
                <form onSubmit={this.props.onChangeScenario}>
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
                        <label>Description</label>
                        <textarea
                            disabled={!isSelected}
                            value={this.props.selectedScenario.Description}
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
                            value=""
                        />
                    </div>
                    <div>
                        <label>Notes</label>
                        <textarea
                            disabled={!isSelected}
                        ></textarea>
                    </div>
                    <div>
                        <input
                            type="submit"
                            disabled={!isSelected}
                            value="Save"
                        />
                        <input
                            type="submit"
                            disabled={!isSelected}
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
                        </select>
                    </div>
                    <div>
                        <select>
                            <option value="0">Select scenario</option>
                        </select>
                    </div>
                    <div>
                        <input
                            type="submit"
                            value="Upload Current Financial Data"
                        />
                    </div>
                </form>

                <h2>Update Scenario</h2>
                <p>This uploads current financial data to the selected scenario</p>
                <form>
                    <div>
                        <input
                            type="submit"
                            value="Upload Current Financial Data"
                        />
                    </div>
                </form>

                {this.props.modal.show ?
                    this.props.modal.type === 'spinnerModal' && <Spinner show={this.props.modal.show} /> :
                    null
                }
            </nav>
        );
    }
};

