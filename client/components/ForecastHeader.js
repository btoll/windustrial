import React from 'react';
import ReactModal from 'react-modal';

import ForecastModal from './ForecastModal';

const styles = {
    container: {
        marginLeft: '10px',
        marginTop: '10px'
    },
    labelStyle: {
        color: 'grey'
    },
    textStyle: {
        fontWeight: 'bold',
        marginLeft: '50px'
    },
    headerText: {
        color: 'grey',
        fontSize: '24px'
    }
}

function InfoHeader(props) {
    return (
        <form id="infoForm">
            <div>
                <label>Scenario Name</label>
                <input value={props.scenario.name} />
            </div>
            <div>
                <label>Target Timeframe</label>
                <span>{props.scenario.name}</span>
            </div>
            <div>
                <label>Date Created</label>
                <span>{props.scenario.createdDateTime}</span>
            </div>
            <div>
                <label>Line of Business</label>
                <span>{props.scenario.LOB}</span>
            </div>
            <div>
                <label>Revenue Center</label>
                <span>{props.scenario.name}</span>
            </div>
            <div>
                <label>Scenario Builder</label>
                <span>{props.scenario.name}</span>
            </div>
        </form>
    );
}

function Actions(props) {
    return (
        <form id="actionsForm">
            <div>
                <button>Build a new scenario</button>
            </div>
            <div>
                <label>Retrieve a saved scenario</label>
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
                <button>Update saved scenario</button>
            </div>
            <div>
                Evaluate performance
            </div>
            <div>
                Build Overrides
            </div>
        </form>
    );
}

class ForecastHeader extends React.Component {
    constructor(props) {
        super(props);
        // For aria, should hide underyling dom elements when modal is shown.
        // (Doesn't appear to be working.)
        ReactModal.setAppElement('#root');
    }

    render() {
        return (
            <div style={styles.container}>
                <div style={styles.headerText}>Budget & Forecast</div>
                <hr />

                <p>
                    <span style={styles.labelStyle}>Scenario Name:</span>
                    <span style={styles.textStyle}>{this.props.selected.name}</span>
                    <button
                        onClick={this.props.openModal.bind(null, 'infoModal')}
                        style={styles.textStyle}
                    >info
                    </button>
                </p>

                <input onClick={this.props.openModal.bind(null, 'actionsModal')} type='button' className='actionButton' value='Actions' />

                {this.props.modal.show ?
                    <ForecastModal
                        className={`${this.props.modal.type} ReactModal__Content__base`}
                        onCloseModal={this.props.onCloseModal}
                        showModal={this.props.modal.show}
                    >
                        {this.props.modal.type === 'infoModal' ?
                            <div>
                                <button onClick={this.props.closeModal}>Close and Save</button>
                                <InfoHeader scenario={this.props.selected} />
                            </div>
                        :
                            <div>
                                <button onClick={this.props.closeModal}>Close</button>
                                <Actions
                                    scenarios={this.props.scenarios}
                                    onScenarioChange={this.props.handleScenarioChange}
                                    onActionChange={this.props.actionChange}
                                />
                            </div>

                        }
                    </ForecastModal>
                : null}
            </div>
        )
    };
};

export default ForecastHeader;

