import React from 'react';

import ForecastOptions from './modal/ForecastOptions';
import Currency from './formatters/Currency';
import Percent from './formatters/Percent';

const prepareData = (onOpenModal, row, e) => {
    onOpenModal('forecastOptions', row, e);
};

const attachEvent = (props, row) =>
    !props.group.data.nonToggled.filter(r => r.Id === row.Id).length

export default function ForecastGroup(props) {
    // Matches 'Total Overhead' or 'Net Profit' or 'Gross Profit', etc.
    // https://blog.codinghorror.com/regular-expressions-now-you-have-two-problems/    :)
    return (
        <>
            {
                !props.expanded &&
                    <h3
                        onClick={props.onHeaderClick.bind(null, props.groupName)}
                        className="expanded"
                        style={{'cursor': 'pointer'}}
                    >{props.groupName || 'COGS'}</h3>

            }
            {
                !props.expanded &&
                    props.group.data.nonToggled.map((row, i) => (
                        <div key={row.Id} className="row">
                            <div style={{'fontWeight': 'bold'}}>{row.LineItem}</div>
                            <div><Currency value={row.CurrentStartAmount + ''} /></div>
                            <div><Currency value={row.CurrentEndAmount + ''} /></div>
                            <div><Percent value={row.ForecastPercentChange + ''} /></div>
                            <div><Currency value={row.ForecastAmount + ''} /></div>
                            <div><Percent value={row.ForecastPercentChange + ''} /></div>
                        </div>
                    ))
            }
            {
                props.expanded &&
                    <h3
                        onClick={props.onHeaderClick.bind(null, props.groupName)}
                        className="collapsed"
                        style={{'cursor': 'pointer'}}
                    >{props.groupName || 'COGS'}</h3>

            }
            {
                props.expanded &&
                    props.group.data.toggled.map((row, i) => (
                        <div key={row.Id} style={{'display': props.expanded ? 'flex' : 'none'}} className="row">
                            <div style={{'fontWeight': !row.LineItem.match(/(?:total .*|(?:net|gross) profit)/i) ? 'normal' : 'bold'}}>{row.LineItem}</div>
                            <div><Currency value={row.CurrentStartAmount + ''} /></div>
                            <div><Currency value={row.CurrentEndAmount + ''} /></div>
                            <div><Percent value={row.ForecastPercentChange + ''} /></div>
                            <div><Currency value={row.ForecastAmount + ''} /></div>
                            <div onMouseOver={attachEvent(props, row) ? prepareData.bind(null, props.onOpenModal, row) : () => {}}><Percent value={row.ForecastPercentChange + ''} /></div>
                        </div>
                    ))
            }
        </>
    );
}

