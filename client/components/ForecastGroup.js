import React from 'react';
import classNames from 'classnames';
import Currency from './formatters/Currency';
import Percent from './formatters/Percent';
import { PERCENTAGES } from './config';

class Percentage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custom: null,
            selected: null
        }
    }

    render() {
        return (
            <div>
                <select onChange={this.props.handleChange.bind(null, this.props.scenario, this.props.row)}>
                    <option>Choose a percentage</option>
                    {PERCENTAGES.map(n =>
                        <option key={n} value={n/100}>{n}</option>
                    )}
                </select>
                <input
                    className="Percentage-custom"
                    type="text"
                    onChange={this.props.handleChange.bind(null, this.props.scenario, this.props.row)}
                />
            </div>
        );
    }
}

const ForecastGroup = props => {
    const pastClass1 = classNames({
        'col': true,
        'col-sm-1': true,
        'pull-left': true,
        'text-right': true,
        'd-none': props.pastVisible
    });
    const pastClass2 = classNames({
        'col': true,
        'col-sm-2': true,
        'pull-left': true,
        'text-right': true,
        'd-none': props.pastVisible
    });

    return (
        <div key={props.row.Id} style={{'display': props.expanded ? 'flex' : 'none'}} className="row">
            <div className="col col-sm-2">{props.row.LineItem}</div>
            <div className={pastClass2}><Currency value={props.row.CurrentStartAmount + ''} /></div>
            <div className="col col-sm-2 pull-left text-right"><Currency value={props.row.CurrentEndAmount + ''} /></div>
            <div className={pastClass1}><Percent value={props.row.ForecastPercentChange + ''} /></div>
            <div className="col col-sm-2 pull-left text-right"><Currency value={props.row.ForecastAmount + ''} /></div>
            <div className="col col-sm-1 pull-left text-right"><Percent value={props.row.ForecastPercentChange + ''} /></div>
            <Percentage
                handleChange={props.handleChange}
                scenario={props.scenario}
                row={props.row}
            />
        </div>
    );
}

export default ForecastGroup;

