import React from 'react';
import Base from './Base';

export default function Confirm(props) {
    let children;

    switch (props.data.confirmType) {
        case 'ack':
            children = (
                <section>
                    <h3>props.text</h3>
                    <button className="close" onClick={props.onClose}>X</button>
                    <button
                        onClick={props.onClose}
                        className="green-large"
                    >
                        OK
                    </button>
                </section>
            );
            break;

        case 'delete':
            children = (
                <section>
                    <h3>Please Confirm Your Deletion</h3>
                    <button className="close" onClick={props.onClose}>X</button>
                    <button
                        onClick={props.onClick.bind(null, true)}
                        className="green-large"
                    >
                        Delete Scenario
                    </button>
                    <button
                        onClick={props.onClose}
                        className="green-large"
                    >
                        Exit without Deleting
                    </button>
                </section>
            );
            break;

        case 'save':
            children = props.data.hardSave ?
                (
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
                    </section>
                ) :

                (
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
                )
    };

    return (
        <Base
            className={`base confirm ReactModal__Content__base`}
            onCloseModal={props.onClose}
        >
            {children}
        </Base>
    );
}

