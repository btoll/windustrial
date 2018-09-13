import React from 'react';
import PropTypes from 'prop-types';
import { FaToggleOn } from 'react-icons/lib/fa';

const SectionHeader = props => {
    const styles = {
        container: {
            marginLeft: '10px',
            marginTop: '10px'
        },
        labelStyle: {
            color: 'grey'
        },
        textStyle: {
            fontWeight: 'bold',
            marginLeft: '50px'
        },
        headerText: {
            color: 'grey',
            fontSize: '24px'
        }
    }
    return (
        <div style={styles.container}>
            <div style={styles.headerText}>Budget & Forecast</div>
            <hr />
            <table>
                <tbody>
                    <tr>
                        <td><div style={styles.labelStyle}>Scenario Name:</div></td>
                        <td><div style={styles.textStyle}>{props.text.scenarioName}</div></td>
                    </tr>
                    <tr>
                        <td><div style={styles.labelStyle}>Target Timeframe:</div></td>
                        <td><div style={styles.textStyle}>{props.text.targetTimeframe}</div></td>
                    </tr>
                    <tr>
                        <td><div style={styles.labelStyle}>Date Created:</div></td>
                        <td><div style={styles.textStyle}>{props.text.dateCreated}</div></td>
                    </tr>
                    <tr>
                        <td><div style={styles.labelStyle}>Line of Business:</div></td>
                        <td><div style={styles.textStyle}>{props.text.lineOfBusiness}</div></td>
                    </tr>
                    <tr>
                        <td><div style={styles.labelStyle}>Revenue Center:</div></td>
                        <td><div style={styles.textStyle}>{props.text.revenueCenter}</div></td>
                    </tr>
                    <tr>
                        <td><div style={styles.labelStyle}>Scenario Builder:</div></td>
                        <td><div style={styles.textStyle}><FaToggleOn size={25} /></div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
};

SectionHeader.propTypes = {
    text: PropTypes.object.isRequired
}

export default SectionHeader;

