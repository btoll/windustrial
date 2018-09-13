import React from 'react';
import ReactModal from 'react-modal';

function ForecastModal(props) {
    return (
        <ReactModal
            ariaHideApp={true}
            className={props.className}
            closeTimeoutMS={150}
            contentLabel='Forecast Header Information'
            isOpen={props.showModal}
            onRequestClose={props.onCloseModal} // For closing using ESC key.
            shouldCloseOnEsc={true}
        >
            {props.children}
        </ReactModal>
    );
}

export default ForecastModal;

