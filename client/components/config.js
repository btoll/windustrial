const protocol = 'http://';
const host = 'localhost';
const port = '3000';

const SOCKET = `${protocol}${host}:${port}`;
const LOGIN_URL = `${SOCKET}/login`;
const PRODUCTS_URL = `${SOCKET}/products`;
const RECEIPTS_URL = `${SOCKET}/receipts`;
const STORES_URL =  `${SOCKET}/stores`;

const PERCENTAGES = [3, 5, 7, 9];

function* incrementer() {
    let n = 100;

    while (true) {
        yield n++;
    }
};

const incr = (i =>
    () => i.next().value
)(incrementer());

//export {
//    LOGIN_URL,
//    PRODUCTS_URL,
//    RECEIPTS_URL,
//    STORES_URL,
//    incr
//};

export {
    PERCENTAGES
};

