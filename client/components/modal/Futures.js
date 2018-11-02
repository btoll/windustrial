import React from 'react';
import Base from './Base';

export default function Futures(props) {
    return (
        <Base
            className={`base futures ReactModal__Content__base`}
            onCloseModal={() => {}}
            show={props.show}
        >
            <section id="futures">
                <h1>{props.data.LineItem}</h1>

                <button onClick={props.onClose}>X</button>
                <p>
                    Select an annual growth rate for this account
                    <span>(these are the current growth rates for this account)</span>
                </p>

                <form>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value=".03"
                            onClick={props.onClickRadio}
                        />
                        <label>xx.x% - current long-term growth rate (past 24 mo)</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value=".05"
                            onClick={props.onClickRadio}
                        />
                        <label>xx.x% - current short-term rate (past 6 mo)</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value=".07"
                            onClick={props.onClickRadio}
                        />
                        <label>xx.x% - mid-point between short and long-time growth</label>
                    </div>
                    <div>
                        <input
                            type="radio" name="forecastOption"
                            value="- enter a preferred percentage"
                            onClick={props.onClickRadio}
                        />
                        <label>- enter a preferred percentage</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            disabled={true}
                            name="forecastOption"
                            value="use an override table for this account"
                        />
                        <label>use an override table for this account</label>
                    </div>
                    <div>
                        <input
                            type="submit"
                            /*disabled={true}*/
                            value="Go"
                        />
                    </div>
                </form>
            </section>
        </Base>
    );
}

