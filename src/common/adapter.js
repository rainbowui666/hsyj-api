const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
const fileSession = require('think-session-file');
const mysql = require('think-model-mysql');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
// const redisCache = require('think-cache-redis');
// const redisSession = require('think-session-redis');
const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
}; 
/* exports.cache = {
  type: 'redis',
  common: {
      timeout: 24 * 3600 * 1000 // millisecond
  },
  redis: {
      handle: redisCache,
      port: 6379,
      host: '10.66.180.63',
      password: 'zhikao@790790'
  }
}; */

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'shculture',
    prefix: 'culture_',
    encoding: 'utf8',
    host: '212.64.18.12',
    port: '3306',
    user: 'root',
    password: 'HSYJ@163.com',
    dateStrings: true
  }
};

/**
 * session adapter config
 * @type {Object}
 */
 exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs'
      // keys: ['werwer', 'werwer'],
      // signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
};

/* exports.session = {
  type: 'redis',
  common: {
      cookie: {
          name: 'thinkjs',
          path: '/',  
          httpOnly: true,
          sameSite: false,
          signed: false,
          overwrite: false
      }
  },
  redis: {
      handle: redisSession,
      port: 6379,
      host: '10.66.180.63',
      password: 'zhikao@790790',
      maxAge: 3600 * 1000, 
      autoUpdate: false,
  }
}; */

/**
 * view adapter config
 * @type {Object}
 */
 exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};