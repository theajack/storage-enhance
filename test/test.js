const {startTest} = require('easy-test-lib');
const lib = require('./lib');

module.exports = ({cases, onComplete, storage}) => {
    startTest({
        args: {storage, lib},
        cases,
        onTestComplete (result) { // 测试全部完成回调 可选
            let txtContent = '';
            const log = (text = '') => {
                console.log(text);
                txtContent += text + '\n';
            };
            log();
            log(`测试结果: ${result.passed ? '' : '不'}通过`);
            
            log(`测试用例数: ${result.results.length}`);
            log(`总耗时: ${result.time}ms`);
            log('----------------------------');
            log(`测试用例详细数据:`);
            log('----------------------------');
            result.results.forEach(item => {
                let str = `【${item.name}】: ${item.passed ? '' : '不'}通过(${item.time}ms); [输出结果]: ${lib.toString(item.result)};`;
                if (!item.passed) {
                    str += `期望结果: ${lib.toString(item.expect)}`;
                }
                log(str);
            });
            log('----------------------------');
    
            if (onComplete)
                onComplete(result, txtContent);
        }
    });
};


