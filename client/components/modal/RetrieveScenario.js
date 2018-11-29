import React from 'react';
import Base from './Base';

export default function RetrieveScenario(props) {
    return (
        <Base
            className={`base retrieveScenario ReactModal__Content__base`}
            onCloseModal={props.onClose}
            show={props.show}
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
                                    <td>{scenario.MonthEndDate}</td>
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

