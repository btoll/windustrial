import React from 'react';
import ReactModal from 'react-modal';

export default function Base(props) {
    return (
        <ReactModal
            ariaHideApp={true}
            className={props.className}
            closeTimeoutMS={150}
            contentLabel=''
            isOpen={true}
            onRequestClose={props.onCloseModal} // For closing using ESC key.
            shouldCloseOnEsc={true}
        >
            {props.children}
        </ReactModal>
    );
}

