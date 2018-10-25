import React from 'react';
import classNames from 'classnames';
import Currency from './formatters/Currency';
import Percent from './formatters/Percent';
import { PERCENTAGES } from './config';

class Percentage extends React.Component {
    constructor(props) {
        super(props);

        this.onSelected = this.onSelected.bind(this);

//        if (props.selections[props.row.LineItem]) {
//            debugger;
//        }
    }

    onSelected(e) {
        this.props.handlePercentageChange(e, this.props.row, this.props.rowNum)
    }

    render() {
        return (
            <div>
                <select id={this.props.row.LineItem} value={this.props.selections[this.props.row.LineItem]} onChange={this.onSelected}>
                    <option key="0" value="0">Choose a percentage</option>
                    {PERCENTAGES.map(o =>
                        <option key={o.val} value={o.col} col={o.col}>{o.val}</option>
                    )}
                </select>
                <input
                    className="Percentage-custom"
                    type="text"
                    data-col="U"
                    value={this.props.selections[this.props.row.LineItem]}
                />
                <input
                    type="button"
                    onClick={this.onSelected}
                    value="Send"
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

    // Matches 'Total Overhead' or 'Net Profit' or 'Gross Profit', etc.
    // https://blog.codinghorror.com/regular-expressions-now-you-have-two-problems/    :)
    const displayPercentages = !props.row.LineItem.match(/(?:total .*|(?:net|gross) profit)/i);

    return (
        <div key={props.row.Id} style={{'display': props.expanded ? 'flex' : 'none'}} className="row">
            <div className="col col-sm-2" style={{'fontWeight': displayPercentages ? 'normal' : 'bold'}}>{props.row.LineItem}</div>
            <div className={pastClass2}><Currency value={props.row.CurrentStartAmount + ''} /></div>
            <div className="col col-sm-2 pull-left text-right"><Currency value={props.row.CurrentEndAmount + ''} /></div>
            <div className={pastClass1}><Percent value={props.row.ForecastPercentChange + ''} /></div>
            <div className="col col-sm-2 pull-left text-right"><Currency value={props.row.ForecastAmount + ''} /></div>
            <div className="col col-sm-1 pull-left text-right"><Percent value={props.row.ForecastPercentChange + ''} /></div>
            {
                displayPercentages ?
                    <Percentage
                        handlePercentageChange={props.handlePercentageChange}
                        row={props.row}
                        rowNum={props.rowNum}
                        selections={props.selections}
                    />
                : <div style={{'display': 'none'}}></div>
            }
        </div>
    );
}

export default ForecastGroup;

