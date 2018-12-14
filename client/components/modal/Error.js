import React from 'react';
import Base from './Base';

export default function Error(props) {
    return (
        <Base
            className={`base error ReactModal__Content__base`}
            onCloseModal={props.onClose}
            show={props.show}
        >
            <section>
                <button className="close" onClick={props.onClose}>X</button>
                <p>{props.text}</p>
                <button onClick={props.onClose}>OK< /button>
            </section>
        </Base>
    );
}

