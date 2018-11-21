import React from 'react';
import Base from './Base';

export default function Notes(props) {
    return (
        <Base
            className={`base notes ReactModal__Content__base`}
            onCloseModal={() => {}}
            show={props.show}
        >
            <section>
                <h3>{props.data.name || "Notes"}</h3>
                <textarea name={props.data.name} cols="54" rows="10" onChange={props.onChangeText} value={props.data.text}></textarea>
                <button onClick={props.onDone}>Done</button>
            </section>
        </Base>
    );
}

