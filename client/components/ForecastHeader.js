import React from 'react';
import ReactModal from 'react-modal';

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
                        onClick={this.props.onOpenModal}
                        style={styles.textStyle}
                    >info
                    </button>
                </p>

                <ReactModal
                    isOpen={this.props.showModal}
                    contentLabel='Forecast Header Information'
                    shouldCloseOnEsc={true}
                    ariaHideApp={true}
                    closeTimeoutMS={150}
                    onRequestClose={this.props.onCloseModal} // For closing using ESC key.
                >
                    <button onClick={this.props.onCloseModal}>Close and Save</button>
                    <InfoHeader scenario={this.props.scenario} />
                </ReactModal>
            </div>
        )
    };
};

export default ForecastHeader;

