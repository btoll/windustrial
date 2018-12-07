import React from 'react';
import Base from './Base';

export default function Confirm(props) {
    return (
        <Base
            className={`base confirm ReactModal__Content__base`}
            onCloseModal={props.onClose}
            show={props.show}
        >
            { props.hardSave ?
                <section>
                    <h3>Confirm New Scenario Being Saved</h3>
                    <button className="close" onClick={props.onClose}>X</button>
                    <button
                        onClick={props.onClick.bind(null, true)}
                        className="green-large"
                    >
                        Save Scenario
                    </button>
                    <button
                        onClick={props.onClick.bind(null, false)}
                        className="green-large"
                    >
                        Exit without Save
                    </button>
                    <p className="small-text">Note: When an existing scenario is retrieved and the numbers are changed, the revised scenario is saved as a new scenario and the original scenario is preserved.  Scenario names can be duplicated if the LOB and/or the Creation Date are unique.  If any of the information needs to be changed, exit this pop-up and make changes in the boxes on the left side of the screen.</p>
                </section> :

                <section>
                    <h3>Changes have been made to the scenario being displayed.  Do you want to save your changes?</h3>

                    <button
                        onClick={props.onClick.bind(null, true)}
                        className="green-large"
                    >
                        Yes, Save This Scenario
                    </button>

                    <button
                        onClick={props.onClick.bind(null, false)}
                        className="green-large"
                    >
                        No, Do Not Save
                    </button>
                </section>
            }
        </Base>
    );
}

