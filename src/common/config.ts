import { Validator } from 'jsonschema';

import { configFile, configFileIEO } from '../config';
import { ConfigFile, ConfigFileIEO } from '../util/types';

import { configIEOSchema, configSchema, schemas } from './configSchema';

export class Config {
    private static _instance: Config;
    private readonly _validator: Validator;
    private readonly _config: ConfigFile;
    public static getInstance(): Config {
        if (!Config._instance) {
            Config._instance = new Config();
        }
        return Config._instance;
    }

    public static getConfig(): ConfigFile {
        return this.getInstance()._config;
    }

    constructor() {
        this._validator = new Validator();
        for (const schema of schemas) {
            this._validator.addSchema(schema, schema.id);
        }
        this._validator.validate(configFile, configSchema, { throwError: true });
        this._config = configFile;
    }
}

export class ConfigIEO {
    private static _instance: ConfigIEO;
    private readonly _validator: Validator;
    private readonly _config: ConfigFileIEO;
    public static getInstance(): ConfigIEO {
        if (!ConfigIEO._instance) {
            ConfigIEO._instance = new ConfigIEO();
        }
        return ConfigIEO._instance;
    }

    public static getConfig(): ConfigFileIEO {
        return this.getInstance()._config;
    }
    constructor() {
        this._validator = new Validator();
        for (const schema of schemas) {
            this._validator.addSchema(schema, schema.id);
        }
        this._validator.validate(configFileIEO, configIEOSchema, { throwError: true });
        this._config = configFileIEO;
    }
}
