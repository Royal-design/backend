const logEvents = require("./logEvents");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

// initialize object
const myEmitter = new MyEmitter();

myEmitter.on("log", (msg, msg2) => logEvents(msg, msg2));

setTimeout(() => {
  myEmitter.emit("log", "Log Event emitted", "event 2 emitted ");
}, 2000);
