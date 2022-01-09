
function promise (fn) {
    return new Promise(res => {
        fn(res);
    });
}

function delay (time = 50) {
    return promise((resolve) => {
        setTimeout(resolve, time);
    });
}

function registInterceptor ({event, eventName, done}) {
    let total = 0;
    let index = 0;
    event.onRegist((option) => {
        if (option.eventName === eventName) {
            total ++;
        }
    });
    event.onEmit((option) => {
        if (option.eventName === eventName) {
            index ++;
            if (index === total) {
                done();
            }
        }
    });
}

function toString (value) {
    if (typeof value === 'undefined') return 'undefined';
    if (value instanceof RegExp || value instanceof Date) return value.toString();
    if (value instanceof HTMLElement) return value.outerHTML;
    return typeof value === 'object' ? JSON.stringify(value) : value.toString();
}

module.exports = {
    delay, registInterceptor, promise, toString
};