const util = require('util');


class Logger {
  constructor(logger) {
    this.data = logger;
  }

  log(...contents) {
    this.print('LOG', contents);
  }

  info(...contents) {
    this.print('INFO', contents);
  }

  warn(...contents) {
    this.print('WARN', contents);
  }

  print(fun, ...contents) {
    if (this.data && this.data.streams) {
      for (const stream of this.data.streams) {
        stream.stream.write(this.format(fun, contents));
      }
    }
  }

  format(fun, format, ...contents) {
    return util.format.apply(this, [`[${new Date()}] [${fun}] ${format}\n`, ...contents]);
  }
}

module.exports = Logger;
