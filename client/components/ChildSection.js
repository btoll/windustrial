import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CurrencyAmount from './CurrencyAmount';
import PercentAmount from './PercentAmount';

class Percentage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            custom: null,
            selected: null
        }
    }

    render () {
        return (
            <div>
                <select onChange={this.props.handleChange.bind(null, this.props.scenario, this.props.row)}>
                    <option>Choose a percentage</option>
                    <option>3</option>
                    <option>5</option>
                    <option>7</option>
                    <option>9</option>
                </select>
                <input
                    className="Percentage-custom"
                    type="text"
                    onChange={this.props.handleChange.bind(null, this.props.scenario, this.props.row)}
                />
            </div>
        );
    }
}

const ChildSection = props => {
    const styles = {
        childRow: {
            fontSize: '16px'
        }
    }

    const renderRow = () => {
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

//        if (props.visible && props.visible === true) {
            return <div style={styles.childRow} key={props.row.Id} className="row">
                <div className="col col-sm-2">{props.row.LineItem}</div>
                <div className={pastClass2}><CurrencyAmount value={props.row.CurrentStartAmount + ''} /></div>
                <div className="col col-sm-2 pull-left text-right"><CurrencyAmount value={props.row.CurrentEndAmount + ''} /></div>
                <div className={pastClass1}><PercentAmount value={props.row.ForecastPercentChange + ''} /></div>
                <div className="col col-sm-2 pull-left text-right"><CurrencyAmount value={props.row.ForecastAmount + ''} /></div>
                <div className="col col-sm-1 pull-left text-right"><PercentAmount value={props.row.ForecastPercentChange + ''} /></div>
                <Percentage
                    handleChange={props.handleChange}
                    scenario={props.scenario}
                    row={props.row}
                />
            </div>;
//        }
//        return <div></div>
    }

    return (
        <div>{renderRow()}</div>
    )
}

ChildSection.propTypes = {
    row: PropTypes.object.isRequired,
//    visible: PropTypes.bool.isRequired,
//    pastVisible: PropTypes.bool.isRequired
}

export default ChildSection;

