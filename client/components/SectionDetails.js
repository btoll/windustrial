import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FaCaretUp, FaCaretRight, FaCaretLeft, FaCaretDown } from 'react-icons/lib/fa';
import _ from 'lodash';

import ChildSection from './ChildSection';
import CurrencyAmount from './CurrencyAmount';
import PercentAmount from './PercentAmount';

class SectionDetails extends Component {
//    static propTypes = {
//        forecast: PropTypes.object.isRequired
//    }

    constructor(props) {
        super(props);

        this.state = {
            expanded: {
                'Gross Revenue': false,
                'COGS Total': false,
                'Gross Margin': false,
                'Sales, General & Admin': false,
                'Profit': false,
                'Non Operating': false
            },
            pastVisible: true
        }

        this.styles = {
            headerRow: {
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '20px',
                marginTop: '10px'
            },
            subHeaderRow: {
                cursor: 'pointer',
                fontSize: '12px',

            },
            parentRow: {
                fontWeight: 'bold',
                cursor: 'pointer'
            },
            parentRowTotal: {
                marginBottom: '25px'
            },
            thickDivider: {
                display: 'block',
                borderWidth: '3px',
                width: '70%',
                marginTop: '0px',
                marginBottom: '15px'
            },
            thinDivider: {
                display: 'block',
                borderWidth: '1px',
                width: '70%',
                marginTop: '0px',
                marginBottom: '1px'
            }
        }
    }

    renderGroup(groupName) {
        const pastClass1 = classNames({
            'col': true,
            'col-sm-1': true,
            'pull-left': true,
            'text-right': true,
            'd-none': this.state.pastVisible
        });

        const pastClass2 = classNames({
            'col': true,
            'col-sm-2': true,
            'pull-left': true,
            'text-right': true,
            'd-none': this.state.pastVisible
        });

        return (
            <div>
                <div style={this.styles.parentRow} className='row'>
                    <div className='col col-sm-2'>{groupName || 'COGS'}</div>
                </div>
                <div>
                    {this.renderChildren(groupName)}
                </div>
            </div>
        );
    }

    renderChildren(groupName) {
        const group = this.props.forecast[groupName];
        return group.map((c, index) => {
            return <div key={index}>
                <ChildSection
                    key={c.Id}
                    row={c}
                    scenario={this.props.scenario}
                    handleChange={this.props.onChange}
                 />
            </div>;
        })
    }

    render() {
        const pastClass1 = classNames({
            'col': true,
            'col-sm-1': true,
            'pull-left': true,
            'text-right': true
        });
        const pastClass2 = classNames({
            'col': true,
            'col-sm-2': true,
            'pull-left': true,
            'text-right': true
        });
        return (
            <div className='container-fluid'>
                <div style={this.styles.headerRow} className='row'>
                    <div className='col col-sm-2'></div>
                    <div className={pastClass2}>Past</div>
                    <div className='col col-sm-2 pull-left text-right'>Current</div>
                    <div className={pastClass1}></div>
                    <div className='col col-sm-2 pull-left text-right'>Future</div>
                    <div className='col col-sm-1 pull-left text-right'></div>
                </div>
                <div style={this.styles.subHeaderRow} className='row'>
                    <div className='col col-sm-2'></div>
                    <div className={pastClass2}></div>
                    <div className='col col-sm-2 pull-left text-right'></div>
                    <div className={pastClass1}>% +/-</div>
                    <div className='col col-sm-2 pull-left text-right'></div>
                    <div className='col col-sm-1 pull-left text-right'>% +/-</div>
                </div>

                {this.renderGroup('Gross Revenue')}
                {this.renderGroup('')}
                {this.renderGroup('Sales, General, Admin Expenses')}
                {this.renderGroup('Non-Operating')}
            </div>
        )
    }
}

export default SectionDetails;

