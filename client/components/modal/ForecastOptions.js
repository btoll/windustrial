import React from 'react';
import Base from './Base';

const toFixed = f =>
    Number.parseFloat(f * 100).toFixed(2)

export default function ForecastOptions (props) {
    const forecastOption = props.row.ScenarioForecastOptions.concat()[0];

    return (
        <Base
            className={`base forecastOptions ReactModal__Content__base`}
            onCloseModal={props.onClose}
            show={props.show}
        >
            <section id="forecastOptions">
                <h1>{props.row.LineItem}</h1>

                <button onClick={props.onClose}>X</button>
                <p>
                    Select an annual growth rate for this account
                    <span>(these are the current growth rates for this account)</span>
                </p>

                <form onSubmit={props.onSubmit}>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value="LongTermTrendOn"
                            checked={forecastOption.LongTermTrendOn}
                            onChange={props.onSelectGrowth}
                        />
                        <label>{toFixed(forecastOption.LongTermTrendPercentage)}% - current long-term growth rate (past 24 mo)</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value="ShortTermTrendOn"
                            checked={forecastOption.ShortTermTrendOn}
                            onChange={props.onSelectGrowth}
                        />
                        <label>{toFixed(forecastOption.ShortTermTrendPercentage)}% - current short-term rate (past 6 mo)</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value="MidRateGrowthOn"
                            checked={forecastOption.MidRateGrowthOn}
                            onChange={props.onSelectGrowth}
                        />
                        <label>{toFixed(forecastOption.MidRateGrowthPercentage)}% - mid-point between short and long-time growth</label>
                    </div>
                    <div>
                        <input
                            type="radio" name="forecastOption"
                            value="OverideOn"
                            checked={forecastOption.OverideOn}
                            onChange={props.onSelectGrowth}
                        />
                        <label>
                            <input
                                disabled={forecastOption.OverideOn ? false : true }
                                placeholder="12.34"
                                style={{
                                    border: "1px solid #000",
                                    marginRight: "4px",
                                    width: "60px"
                                }}
                                type="number"
                                step="0.01"
                                value={toFixed(forecastOption.OveridePercentage)}
                                onChange={props.onSelectGrowth}
                            />
                             - enter a preferred percentage
                        </label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            disabled={true}
                            name="forecastOption"
                        />
                        <label>use an override table for this account</label>
                    </div>
                    <div>
                        <input
                            type="submit"
                            value="Go"
                        />
                    </div>
                    <div className="optionsNav">
                        <div onClick={props.onNavigate.bind(null, props.row)}>
                            <a href="#">previous</a>
                            <a href="#">next</a>
                        </div>
                    </div>
                </form>
            </section>
        </Base>
    );
}

