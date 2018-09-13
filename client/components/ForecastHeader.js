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
        <form id="infoHeader">
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
        <select onChange={props.onActionChange} id="actionsList">
            <option>Select an action</option>
            <option>Build a new scenario</option>
            <option>Retrive a saved scenario</option>
            <option>Update saved scenario</option>
            <option>Evaluate performance</option>
            <option>Build Overrides</option>
        </select>
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
                    <span style={styles.textStyle}>{this.props.scenario.name}</span>
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
                                <InfoHeader scenario={this.props.scenario} />
                            </div>
                        :
                            <div>
                                <button onClick={this.props.closeModal}>Close</button>
                                <Actions onActionChange={this.props.actionChange} />
                            </div>

                        }
                    </ForecastModal>
                : null}
            </div>
        )
    };
};

export default ForecastHeader;

