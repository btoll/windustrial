import React from 'react';
import PropTypes from 'prop-types';

const PercentAmount = props => {
    if (Number.isNaN(Number(props.value))) {
        return <div className="mr-3"> - </div>;
    }

    return <div>{Number(props.value).toLocaleString(undefined, {style: 'percent', minimumFractionDigits:0})}</div>;
}

PercentAmount.propTypes = {
    value: PropTypes.string
}

export default PercentAmount;

