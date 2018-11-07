import React from 'react';

import ForecastOptions from './modal/ForecastOptions';
import Currency from './formatters/Currency';
import Percent from './formatters/Percent';

const prepareData = (props, e) => {
    props.onOpenModal('forecastOptions', props.row, e);
};

const ForecastGroup = props => {
    const row = props.row;
    // Matches 'Total Overhead' or 'Net Profit' or 'Gross Profit', etc.
    // https://blog.codinghorror.com/regular-expressions-now-you-have-two-problems/    :)
    const displayPercentages = !row.LineItem.match(/(?:total .*|(?:net|gross) profit)/i);

    return (
        <div key={row.Id} style={{'display': props.expanded ? 'flex' : 'none'}} className="row">
            <div className="col" style={{'fontWeight': displayPercentages ? 'normal' : 'bold'}}>{row.LineItem}</div>
            <div className="col"><Currency value={row.CurrentStartAmount + ''} /></div>
            <div className="col"><Currency value={row.CurrentEndAmount + ''} /></div>
            <div className="col"><Percent value={row.ForecastPercentChange + ''} /></div>
            <div className="col"><Currency value={row.ForecastAmount + ''} /></div>
            <div onMouseOver={prepareData.bind(null, props)} className="col"><Percent value={row.ForecastPercentChange + ''} /></div>
        </div>
    );
}

export default ForecastGroup;

