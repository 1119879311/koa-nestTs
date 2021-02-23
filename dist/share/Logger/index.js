"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uitl_1 = require("../../uitl");
const loggerRoot = `Logs/`;
const addColors = {
    debug: (str) => `\x1B[34m${str}\x1B[0m`,
    error: (str) => `\x1B[31m${str}\x1B[0m`,
    info: (str) => `\x1B[32m${str}\x1B[0m`,
    warn: (str) => `\x1B[33m${str}\x1B[0m`,
    verbose: (str) => `\x1B[30m${str}\x1B[0m`,
    silly: (str) => `\x1B[30m${str}\x1B[0m`,
};
const leveConfig = () => { return { filename: "", write: false }; };
const defautLeve = () => {
    return {
        debug: leveConfig(),
        error: leveConfig(),
        info: leveConfig(),
        warn: leveConfig()
    };
};
class Logger {
    static setting(option) {
        this.config = Object.assign({}, defautLeve(), option);
        mkdirSync(loggerRoot);
    }
    static info(str) {
        this.write(this.getInfo(str, 'info'), 'info');
    }
    static warn(str) {
        this.write(this.getInfo(str, 'warn'), 'warn');
    }
    static error(str) {
        this.write(this.getInfo(str, 'error'), 'error');
    }
    static debug(str) {
        this.write(this.getInfo(str, 'debug'), 'debug');
    }
    static getInfo(str, leve) {
        const log = addColors[leve](`[${new Date().toLocaleString()}] [${leve}]: ${str}`);
        console[leve](log);
        return log;
    }
    static write(str, levev) {
        try {
            if (this.config[levev].write) {
                let loggerDir = this.config[levev];
                loggerDir = loggerDir ? `${loggerRoot}${loggerDir}` : `${loggerRoot}${levev}-${uitl_1.dateFormat({ patter: 'YYYY-MM-DD' })}.log`;
                fs.appendFileSync(loggerDir, str + '\n', 'utf8');
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
Logger.config = defautLeve();
exports.Logger = Logger;
async function mkdirSync(dirname) {
    try {
        if (fs.existsSync(dirname)) {
            return true;
        }
        else {
            if (await mkdirSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
