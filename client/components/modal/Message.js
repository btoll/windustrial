import React from 'react';
import Base from './Base';

export default function Message(props) {
    return (
        <Base
            className={`base message ReactModal__Content__base`}
            onCloseModal={() => {}}
            show={props.show}
        >
            <section>
                <h3>{props.data.message}</h3>
                <ul>
                    {
                        props.data.fields.map(item => <li key={item}>{item}</li>)
                    }
                </ul>
                <div>
                    <button onClick={props.onClose}>OK</button>
                </div>
            </section>
        </Base>
    );
}

