const PROTOCOL = 'https://';
const HOST = 'corelyticsbftapi.azurewebsites.net';
const PORT = '443';

const SOCKET = `${PROTOCOL}${HOST}:${PORT}`;
const AUTH = `${SOCKET}/api/users/login`;
const ENDPOINT = 'api/scenario';
const SCENARIO_ENDPOINT_BASE = `${SOCKET}/${ENDPOINT}`;

export {
    AUTH,
    SCENARIO_ENDPOINT_BASE,
    SOCKET
};

