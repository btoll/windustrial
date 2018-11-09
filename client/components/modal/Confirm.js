import React from 'react';
import Base from './Base';

export default function Confirm(props) {
    return (
        <Base
            className={`base confirm ReactModal__Content__base`}
            onCloseModal={() => {}}
            show={props.show}
        >
            <section>
                <div>
                    <p>You have <b>unsaved changes</b>.</p>
                    <p>Would you like to <b>save</b> before proceeding?</p>
                </div>
                <div>
                    <button onClick={props.onClick.bind(null, true)}>Yes</button>
                    <button onClick={props.onClick.bind(null, false)}>No</button>
                </div>
            </section>
        </Base>
    );
}

