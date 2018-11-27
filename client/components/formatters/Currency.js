import React from 'react';

export default function Currency(props) {
    if (Number.isNaN(Number(props.value))) {
        return <div> - </div>;
    }

    const isDecimal = props.style === 'decimal';
    let d = props.value;

    if (isDecimal) {
        d >>= 0;
    }

    return <span>{
        (
            props.idx === 0 || isDecimal ?
                '$' :
            ''
        ) + Number(Math.ceil(d)).toLocaleString('en-US', { style: 'decimal', currency: 'USD', minimumFractionDigits: 0 })
    }</span>;
}

