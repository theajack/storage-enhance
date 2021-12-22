const start = require('./test');
const storage = require('../src/index').default;
// const storage = require('../public/node-dev.min'); // 使用build好的文件

const caseFiles = [
    'set-get'
];

const cases = [];

caseFiles.forEach(name => {
    const item = require(`./cases/${name}`);
    if (item instanceof Array) {
        cases.push(...item);
    } else {
        cases.push(item);
    }
});

start({
    storage,
    cases,
});