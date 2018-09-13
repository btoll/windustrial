import React from 'react';
import PropTypes from 'prop-types';

const CurrencyAmount = (props) => {
    if (Number.isNaN(Number(props.value))) {
        return <div className="text-right mr-5"> - </div>;
    }
    return <div>{Number(props.value).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>;
}

CurrencyAmount.propTypes = {
    value: PropTypes.string
}

export default CurrencyAmount;

