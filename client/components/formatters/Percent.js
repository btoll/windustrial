import React from 'react';

export default function PercentAmount(props) {
    if (Number.isNaN(Number(props.value))) {
        return <div className="mr-3"> - </div>;
    }

    return <span>{Number(props.value).toLocaleString(undefined, {style: 'percent', minimumFractionDigits:0})}</span>;
}

