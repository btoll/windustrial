import React from 'react';
import Base from './Base';

const toFixed = f =>
    Number.parseFloat(f * 100).toFixed(2)

export default function ForecastOptions(props) {
    const forecastOption = props.data.row.ScenarioForecastOptions.concat()[0];

    return (
        <Base
            className={`base forecastOptions ReactModal__Content__base`}
            onCloseModal={props.onClose}
        >
            <section id="forecastOptions">
                <h1>{props.data.row.LineItem}</h1>

                <button className="close" onClick={props.onClose}>X</button>
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
                            onChange={props.onSelectForecastOption}
                        />
                        <label>{toFixed(forecastOption.LongTermTrendPercentage)}% - current long-term growth rate (past 24 mo)</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value="ShortTermTrendOn"
                            checked={forecastOption.ShortTermTrendOn}
                            onChange={props.onSelectForecastOption}
                        />
                        <label>{toFixed(forecastOption.ShortTermTrendPercentage)}% - current short-term rate (past 6 mo)</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="forecastOption"
                            value="MidRateGrowthOn"
                            checked={forecastOption.MidRateGrowthOn}
                            onChange={props.onSelectForecastOption}
                        />
                        <label>{toFixed(forecastOption.MidRateGrowthPercentage)}% - mid-point between short and long-time growth</label>
                    </div>
                    <div>
                        <input
                            type="radio" name="forecastOption"
                            value="OverideOn"
                            checked={forecastOption.OverideOn}
                            onChange={props.onSelectForecastOption}
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
                                value={forecastOption.OveridePercentage*100}
                                onChange={props.onSelectForecastOption}
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
                            value={!props.data.dirty ? "Exit" : "Apply"}
                            className="green-large"
                        />
                    </div>
                    <div className="optionsNav">
                        <div onClick={props.onNavigate.bind(null, props.data.row)}>
                            <a href="#">previous</a>
                            <a href="#">next</a>
                        </div>
                    </div>
                </form>
            </section>
        </Base>
    );
}

