const EventEmitter = require('events');

var isTrue = true

class WithLog extends EventEmitter {
    execute(taskFunc) {
        console.log('Before executing');
        this.emit('begin');
        isTrue && this.emit('end');
        taskFunc();
        isTrue && console.log('After executing');
    }
}
//
// const withLog = new WithLog();
//
// withLog.on('begin', () => {
//     isTrue = false
//     console.log('About to execute')
// });
// withLog.on('end', () => console.log('Done with execute'));
// withLog.execute(() => {
//     isTrue = true
//     console.log('*** Executing task ***')
// });