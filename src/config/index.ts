// Use this on production
import configFileProduction from '../config/files/config.json';

// Using this due to CI error
import configFileTest from './config-test.json';
// import configFileProduction from './config.json';

let configFile: any;

if (process.env.NODE_ENV === 'test') {
    configFile = configFileTest;
}
if (process.env.NODE_ENV === 'production') {
    configFile = configFileProduction;
}
if (process.env.NODE_ENV === 'development') {
    configFile = configFileProduction;
}

export { configFile };
