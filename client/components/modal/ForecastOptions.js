import React from 'react';
import Base from './Base';

const toFixed = f =>
    Number.parseFloat(f * 100).toFixed(2)

const growthPermutations = {
    LongTermTrendOn: {
        LongTermTrendOn: true,
        ShortTermTrendOn: false,
        MidRateGrowthOn: false,
        OverideOn: false,
        OveridePercentage: null
    },
    MidRateGrowthOn: {
        LongTermTrendOn: false,
        ShortTermTrendOn: false,
        MidRateGrowthOn: true,
        OverideOn: false,
        OveridePercentage: null
    },
    ShortTermTrendOn: {
        LongTermTrendOn: false,
        ShortTermTrendOn: true,
        MidRateGrowthOn: false,
        OverideOn: false,
        OveridePercentage: null
    },
    OverideOn: {
        LongTermTrendOn: false,
        ShortTermTrendOn: false,
        MidRateGrowthOn: false,
        OverideOn: true,
        OveridePercentage: null
    }
};

export default class ForecastOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedForecastOption: props.data.ScenarioForecastOptions.concat()[0],
        };

        this.customPercentage = this.customPercentage.bind(this);
        this.selectGrowth = this.selectGrowth.bind(this);
    }

    customPercentage(e) {
        const selectedForecastOption = Object.assign({}, this.state.selectedForecastOption);
        selectedForecastOption.OveridePercentage = e.target.value / 100;

        this.setState({
            selectedForecastOption
        });
    }

    selectGrowth(e) {
        const target = e.currentTarget;
        let selectedForecastOption = Object.assign({}, this.state.selectedForecastOption, growthPermutations[target.value]);

        this.setState({
            selectedForecastOption
        });
    }

    render() {
        const forecastOption = this.state.selectedForecastOption;

        return (
            <Base
                className={`base forecastOptions ReactModal__Content__base`}
                onCloseModal={() => {}}
                show={this.props.show}
            >
                <section id="forecastOptions">
                    <h1>{this.props.data.LineItem}</h1>

                    <button onClick={this.props.onClose}>X</button>
                    <p>
                        Select an annual growth rate for this account
                        <span>(these are the current growth rates for this account)</span>
                    </p>

                    <form onSubmit={this.props.onSubmit.bind(null, this.state.selectedForecastOption)}>
                        <div>
                            <input
                                type="radio"
                                name="forecastOption"
                                value="LongTermTrendOn"
                                checked={forecastOption.LongTermTrendOn}
                                onChange={this.selectGrowth}
                            />
                            <label>{toFixed(this.state.selectedForecastOption.LongTermTrendPercentage)}% - current long-term growth rate (past 24 mo)</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="forecastOption"
                                value="ShortTermTrendOn"
                                checked={forecastOption.ShortTermTrendOn}
                                onChange={this.selectGrowth}
                            />
                            <label>{toFixed(this.state.selectedForecastOption.ShortTermTrendPercentage)}% - current short-term rate (past 6 mo)</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="forecastOption"
                                value="MidRateGrowthOn"
                                checked={forecastOption.MidRateGrowthOn}
                                onChange={this.selectGrowth}
                            />
                            <label>{toFixed(this.state.selectedForecastOption.MidRateGrowthPercentage)}% - mid-point between short and long-time growth</label>
                        </div>
                        <div>
                            <input
                                type="radio" name="forecastOption"
                                value="OverideOn"
                                checked={forecastOption.OverideOn}
                                onChange={this.selectGrowth}
                            />
                            <label>
                                <input
                                    disabled={forecastOption.OverideOn ? false : true }
                                    placeholder="12.34"
                                    style={{
                                        border: '1px solid black',
                                        marginRight: '4px',
                                        width: '60px'
                                    }}
                                    type="number"
                                    step="0.01"
                                    value={toFixed(forecastOption.OveridePercentage)}
                                    onChange={this.customPercentage}
                                />
                                 - enter a preferred percentage
                            </label>
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
}

