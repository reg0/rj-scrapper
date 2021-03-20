

const LOG_LEVELS = {
  debug: 5,
  info: 4,
  log: 3,
  warn: 2,
  error: 1,
}

const DEFAULT_LOG_LEVEL = LOG_LEVELS.log;

let instance = 0;

export class BasicLogger {
  logLevel: number;
  firstTimestamp: number;
  prevTimestamp: number;
  instanceNo: number;

  constructor(public name: string) { 
    this.logLevel = process.env.LOG_LEVEL ? LOG_LEVELS[process.env.LOG_LEVEL] : DEFAULT_LOG_LEVEL;
    this.prevTimestamp = this.firstTimestamp = new Date().getTime();
    this.instanceNo = ++instance;
    this.debug(`>>> start`, 0);
  }

  private formatOutput(log: string, indentationLevel: number) {
    const t = new Date();
    const o =  `${
      t.toISOString()
    }\t${
      t.getTime() - this.prevTimestamp
    }ms\t${
      this.name
    } ${
      this.instanceNo
    }${
      ' '.repeat(20 - this.name.length)
    }\t${
      ' '.repeat(indentationLevel) + log
    }`;
    this.prevTimestamp = t.getTime();
    return o;
  }

  private doLog(level: string, log: string, indentationLevel: number) {
    if (this.logLevel < LOG_LEVELS[level]) {
      return ;
    }
    console[level](this.formatOutput(log, indentationLevel));
  }

  debug(log: string, indentationLevel: number = 1) {
    this.doLog('debug', log, indentationLevel);
  }

  info(log: string, indentationLevel: number = 1) {
    this.doLog('info', log, indentationLevel);
  }

  log(log: string, indentationLevel: number = 1) {
    this.doLog('log', log, indentationLevel);
  }

  warn(log: string, indentationLevel: number = 1) {
    this.doLog('warn', log, indentationLevel);
  }

  error(log: string, indentationLevel: number = 1) {
    this.doLog('error', log, indentationLevel);
  }

  finish() {
    this.debug(`<<< done in ${new Date().getTime() - this.firstTimestamp}ms`, 0);
  }

  async doAsyncStuffWithLogs<T>(fn: (log: this) => T): Promise<T> {
    try {
      return await fn(this);
    } catch (e) {
      this.error(`<<< finished with error in ${new Date().getTime() - this.firstTimestamp}ms: ${e}`, 0);
      throw e;
    }
  }

  doStuffWithLogs<T>(fn: (log: this) => T): T {
    try {
      return fn(this);
    } catch (e) {
      this.error(`<<< finished with error in ${new Date().getTime() - this.firstTimestamp}ms: ${e}`, 0);
      throw e;
    }
  }
}

export const withLogs = <T>(name: string, fn: (log: BasicLogger) => T) => new BasicLogger(name).doStuffWithLogs(fn);

export const withLogsAsync = <T>(name: string, fn: (log: BasicLogger) => T) => new BasicLogger(name).doAsyncStuffWithLogs(fn);
