import React from 'react';
import Base from './Base';

import Confirm from './Confirm';
import Error from './Error';
import ForecastOptions from './ForecastOptions';
import Message from './Message';
import Notes from './Notes';
import RetrieveScenario from './RetrieveScenario';
import Spinner from './Spinner';

export default function Modal(props) {
    switch (props.modal.type) {
        case 'confirm':
            return <Confirm
                data={props.modal.data}
                onClick={props.confirm}
                onClose={props.closeModal}
            />

        case 'error':
            return <Error
                data={props.modal.data}
                onClose={props.closeModal}
            />

        case 'forecastOptions':
            return <ForecastOptions
                data={props.modal.data}
                onSelectForecastOption={props.selectForecastOption}
                onClose={props.closeModal}
                onNavigate={props.navigateForecastOptions}
                onSubmit={props.updateForecastOptions}
            />

        case 'message':
            return <Message
                data={props.modal.data}
                onClose={props.closeModal}
            />

        case 'notes':
            return <Notes
                data={props.modal.data}
                onChangeText={props.changeText}
                onDone={props.closeModal}
            />

        case 'retrieveScenario':
            return <RetrieveScenario
                scenarios={props.scenarios}
                onChangeScenario={props.changeScenario}
                onSelectRetrievalRow={props.selectRetrievalRow}
                onClose={props.closeModal}
                selectedRetrievalRow={props.selectedRetrievalRow}
            />

        case 'spinner':
            return <Spinner
                text={props.modal.text}
            />

        default:
            return <div></div>
    }
}

