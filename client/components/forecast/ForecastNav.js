import React from 'react';

export default function ForecastNav(props) {
    return (
        <nav id={props.navID}>
            <ul onClick={props.onClick}>
                <li><a name="scenarioPlanning" href="#">Scenario Planning</a></li>
                <li><a name="lobAnalysis" href="#">LOB Analysis</a></li>
                <li><a name="operatingMetrics" href="#">Operating Metrics</a></li>
                <li><a name="admin" href="#">Admin</a></li>
                <li><a name="logout" href="#">Logout</a></li>
            </ul>
        </nav>
    );
}

