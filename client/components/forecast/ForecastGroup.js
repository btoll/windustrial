import React from 'react';

import ForecastOptions from '../modal/ForecastOptions';
import Currency from '../formatters/Currency';
import Percent from '../formatters/Percent';

const prepareData = (onOpenModal, row, e) => {
    onOpenModal('forecastOptions', row, e);
};

// Some rows, like the totals, should not have the event bound to it.
// The `nonToggled` list contains these rows, so if the id of the row
// isn't in the list, don't bind it.
const shouldAttachEvent = (props, row) =>
    !props.group.data.nonToggled.filter(r => r.Id === row.Id).length;

// This can be expanded to switch on different strings, but for now just do the one we need.
const changeLineItem = s =>
    s === "Total Gross Revenue" ? "Total Revenue" : s;

const getCol6 = (props, row) => {
    const attachEvent = shouldAttachEvent(props, row);

    return attachEvent ?
        <div className="col6 highlight">
            <a href="#" onClick={prepareData.bind(null, props.onOpenModal, Object.assign({}, {
                data: {
                    row
                }
            }))}>
                <Percent value={row.ForecastPercentChange + ''} />
            </a>
        </div> :

        <div className="col6">
            <Percent value={row.ForecastPercentChange + ''} />
        </div>;
};

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
                    >{props.groupName}</h3>

            }
            {
                !props.expanded &&
                    props.group.data.nonToggled.map((row, i) => (
                        <div key={row.Id} className="row">
                            <div className="col1" style={{'fontWeight': 'bold'}}><span>{changeLineItem(row.LineItem)}</span></div>
                            <div className="col2"><Currency idx={i} value={row.CurrentStartAmount + ''} /></div>
                            <div className="col3"><Currency idx={i} value={row.CurrentEndAmount + ''} /></div>
                            <div className="col4"><Percent value={row.CurrentPercentChange + ''} /></div>
                            <div className="col5"><Currency idx={i} value={row.ForecastAmount + ''} /></div>
                            <div className="col6"><Percent value={row.ForecastPercentChange + ''} /></div>
                        </div>
                    ))
            }
            {
                props.expanded &&
                    <h3
                        onClick={props.onHeaderClick.bind(null, props.groupName)}
                        className="collapsed"
                    >{props.groupName}</h3>

            }
            {
                props.expanded &&
                    props.group.data.all.map((row, i) => (
                        <div key={row.Id} className="row">
                            <div className="col1" style={{'fontWeight': !row.LineItem.match(/(?:total .*|(?:net|gross) profit)/i) ? 'normal' : 'bold'}}><span>{changeLineItem(row.LineItem)}</span></div>
                            <div className="col2"><Currency idx={i} value={row.CurrentStartAmount + ''} /></div>
                            <div className="col3"><Currency idx={i} value={row.CurrentEndAmount + ''} /></div>
                            <div className="col4"><Percent value={row.CurrentPercentChange + ''} /></div>
                            <div className="col5"><Currency idx={i} value={row.ForecastAmount + ''} /></div>
                            {getCol6(props, row)}
                        </div>
                    ))
            }
        </>
    );
}

