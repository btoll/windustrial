import React from 'react';
import ReactModal from 'react-modal';

import ForecastModal from './ForecastModal';
import Actions from './modal/Actions';
import Info from './modal/Info';

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
                    <span style={styles.textStyle}>{this.props.selected.Name}</span>
                    <button
                        onClick={this.props.openModal.bind(null, 'infoModal')}
                        disabled={!Object.keys(this.props.selected).length}
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
                                <button onClick={this.props.closeModal}>Update and Close</button>
                                <Info scenario={this.props.selected} />
                            </div>
                        :
                            <div>
                                <button onClick={this.props.closeModal}>Close</button>
                                <Actions
                                    scenarios={this.props.scenarios}
                                    onCreateScenario={this.props.createScenario}
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

