import React from 'react';

export default function CurrencyAmount(props) {
    if (Number.isNaN(Number(props.value))) {
        return <div className="text-right mr-5"> - </div>;
    }

    return <span>{Number(props.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>;
}

