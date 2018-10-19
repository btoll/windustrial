const PROTOCOL = 'https://';
const HOST = 'corelyticsbftapi.azurewebsites.net';
const PORT = '443';

const SOCKET = `${PROTOCOL}${HOST}:${PORT}`;
const AUTH = `${SOCKET}/api/users/login`;
const ENDPOINT = 'api/scenario';
const SCENARIO_ENDPOINT_BASE = `${SOCKET}/${ENDPOINT}`;

//const PERCENTAGES = [3, 5, 7, 9];
const PERCENTAGES = [
    {col: 'L', val: 3},
    {col: 'O', val: 5},
    {col: 'R', val: 7}
];

/*
function* incrementer() {
    let n = 100;

    while (true) {
        yield n++;
    }
};

const incr = (i =>
    () => i.next().value
)(incrementer());
*/

export {
    AUTH,
    PERCENTAGES,
    SCENARIO_ENDPOINT_BASE,
    SOCKET
};

