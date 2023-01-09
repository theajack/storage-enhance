
/*
 * @Author: chenzhongsheng
 * @Date: 2023-01-07 14:52:49
 * @Description: Coding something
 */
const fs = require('fs');
const path = require('path');
const start = require('./test');
const getAllCases = require('./get-cases');
// const storage = require('../public/node-dev.min');
const storage = require('../npm');


start({
    storage,
    cases: getAllCases(),
    onComplete: (result, txt) => {
        fs.writeFileSync(path.resolve('./', 'test/test-report.json'), JSON.stringify(result, null, 4), 'utf8');
        fs.writeFileSync(path.resolve('./', 'test/test-report.txt'), txt, 'utf8');
    }
});


