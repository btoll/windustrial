const PROTOCOL = 'http://';
const HOST = 'localhost';
const PORT = '3001';

const SOCKET = `${PROTOCOL}${HOST}:${PORT}`;
const ENDPOINT = 'api/scenario';
const SCENARIO_ENDPOINT_BASE = `${SOCKET}/${ENDPOINT}`;

//const PERCENTAGES = [3, 5, 7, 9];
const PERCENTAGES = [
    {col: 'L', val: 3},
    {col: 'O', val: 5},
    {col: 'R', val: 7}
];

function* incrementer() {
    let n = 100;

    while (true) {
        yield n++;
    }
};

const incr = (i =>
    () => i.next().value
)(incrementer());

export {
    PERCENTAGES,
    SCENARIO_ENDPOINT_BASE,
    SOCKET
};

