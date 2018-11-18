import React from 'react';

export default function Percent(props) {
    if (Number.isNaN(Number(props.value))) {
        return <div> - </div>;
    }

    return <span className={props.className || ''}>{Number(props.value).toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 2})}</span>;
}

