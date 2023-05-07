import fs from 'fs';
import { dateFormat, mkdirSync } from '../util';
const loggerRoot = `Logs/`;

const addColors = {
  debug: (str: string) => `\x1B[34m${str}\x1B[0m`,
  error: (str: string) => `\x1B[31m${str}\x1B[0m`,
  info: (str: string) => `\x1B[32m${str}\x1B[0m`,
  warn: (str: string) => `\x1B[33m${str}\x1B[0m`,
  verbose: (str: string) => `\x1B[30m${str}\x1B[0m`,
  silly: (str: string) => `\x1B[30m${str}\x1B[0m`,
};
interface IlogLever {
  filename?: string;
  write?: boolean;
}
type enumLeve = 'debug' | 'error' | 'info' | 'warn';
type ILoggerSetting = Record<enumLeve, IlogLever>;
const leveConfig = () => {
  return { filename: '', write: false };
};
const defautLeve = () => {
  return {
    debug: leveConfig(),
    error: leveConfig(),
    info: leveConfig(),
    warn: leveConfig(),
  };
};
export class Logger {
  private static config: ILoggerSetting = defautLeve();
  static setting(option: ILoggerSetting) {
    this.config = Object.assign({}, defautLeve(), option);
    mkdirSync(loggerRoot);
  }
  static info(str: string) {
    this.write(this.getInfo(str, 'info'), 'info');
  }
  static warn(str: string) {
    this.write(this.getInfo(str, 'warn'), 'warn');
  }
  static error(str: string) {
    this.write(this.getInfo(str, 'error'), 'error');
  }
  static debug(str: string) {
    this.write(this.getInfo(str, 'debug'), 'debug');
  }
  private static getInfo(str: string, leve: enumLeve) {
    const log = addColors[leve](`[${new Date().toLocaleString()}] [${leve}]: ${str}`);
    console[leve](log);
    return log;
  }
  static write(str: string, levev: enumLeve) {
    try {
      if (this.config[levev].write) {
        let loggerDir = this.config[levev] as string;
        loggerDir = loggerDir
          ? `${loggerRoot}${loggerDir}`
          : `${loggerRoot}${levev}-${dateFormat({ patter: 'YYYY-MM-DD' })}.log`;
        fs.appendFileSync(loggerDir, str + '\n', 'utf8');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
