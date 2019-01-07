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
    const app = props.app;
    const state = app.state;
    const modal = state.modal;

    switch (modal.type) {
        case 'confirmModal':
            return <Confirm
                data={modal.data}
                show={modal.show}
                onClick={app.confirm}
                onClose={app.closeModal}
            />

        case 'errorModal':
            return <Error
                data={modal.data}
                show={modal.show}
                onClose={app.closeModal}
            />

        case 'forecastOptions':
            return <ForecastOptions
                show={modal.show}
                data={modal.data}
                onSelectForecastOption={app.selectForecastOption}
                onClose={app.closeModal}
                onNavigate={app.navigateForecastOptions}
                onSubmit={app.updateForecastOptions}
            />

        case 'messageModal':
            return <Message
                data={modal.data}
                show={modal.show}
                onClose={app.closeModal}
            />

        case 'notesModal':
            return <Notes
                data={modal.data}
                show={modal.show}
                onChangeText={app.changeText}
                onDone={app.closeModal}
            />

        case 'retrieveScenarioModal':
            return <RetrieveScenario
                scenarios={state.scenarios}
                show={modal.show}
                onChangeScenario={app.changeScenario}
                onSelectRetrievalRow={app.selectRetrievalRow}
                onClose={app.closeModal}
                selectedRetrievalRow={state.selectedRetrievalRow}
            />

        case 'spinnerModal':
            return <Spinner
                show={modal.show}
                text={modal.text}
            />
    }
}

