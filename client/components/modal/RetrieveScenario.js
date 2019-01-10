import React from 'react';
import Base from './Base';

const formatDate = s =>
    s.replace(/(\d{4})-(\d{2})-(\d{2}).*/g, (matched, _1, _2, _3) => `${_2}/${_3}/${_1.slice(-2)}`);

export default function RetrieveScenario(props) {
    return (
        <Base
            className={`base retrieveScenario ReactModal__Content__base`}
            onCloseModal={props.onClose}
        >
            <section>
                <h1>Select a Scenario</h1>
                <button className="close" onClick={props.onClose}>X</button>

                <table onClick={props.onSelectRetrievalRow} onDoubleClick={props.onChangeScenario}>
                    <thead>
                        <tr>
                            <th style={{textAlign: "left", width: "60%"}}>Scenario Name</th>
                            <th style={{textAlign: "left", width: "20%"}}>LOB</th>
                            <th style={{textAlign: "left", width: "20%"}}>Creation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.scenarios.map((scenario, i) => (
                                <tr
                                    key={scenario.Id}
                                    id={scenario.Id}
                                    className={scenario.Id === props.selectedRetrievalRow ?
                                        'retrieve-scenario-row selectedRetrievalRow' :
                                        'retrieve-scenario-row'
                                    }
                                >
                                    <td>{scenario.Name}</td>
                                    <td>{scenario.LOB}</td>
                                    <td>{formatDate(scenario.CreationDate)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <button
                    type="submit"
                    className="green-large"
                    disabled={!props.selectedRetrievalRow}
                    onClick={props.onChangeScenario}
                >
                    Retrieve Scenario
                </button>
            </section>
        </Base>
    );
}

