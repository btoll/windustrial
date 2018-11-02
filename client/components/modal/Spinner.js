import React from 'react';
import Base from './Base';

export default function Spinner(props) {
    return (
        <Base
            className={`base spinner ReactModal__Content__base`}
            onCloseModal={() => {}}
            show={props.show}
        >
            <section>
                <p>Please wait while we fetch the latest data...</p>
                <img src="/images/spinner.gif" alt="Spinner..." />
            </section>
        </Base>
    );
}

