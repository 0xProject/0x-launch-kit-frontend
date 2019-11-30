import { Validator } from 'jsonschema';

import { configFile, configFileIEO, configTipBot, configTipBotWhitelistAddresses } from '../config';
import { AssetBot, ConfigFile, ConfigFileIEO, ConfigFileTipBot } from '../util/types';

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
    private readonly _configBot: ConfigFileTipBot;
    public static getInstance(): ConfigIEO {
        if (!ConfigIEO._instance) {
            ConfigIEO._instance = new ConfigIEO();
        }
        return ConfigIEO._instance;
    }

    public static getConfig(): ConfigFileIEO {
        return this.getInstance()._config;
    }
    public static getConfigBot(): ConfigFileTipBot {
        return this.getInstance()._configBot;
    }

    constructor() {
        this._validator = new Validator();
        for (const schema of schemas) {
            this._validator.addSchema(schema, schema.id);
        }
        this._validator.validate(configFileIEO, configIEOSchema, { throwError: true });
        this._config = configFileIEO;

        const tokens: AssetBot[] = [];
        for (const [key, value] of Object.entries(configTipBot.tokens)) {
            const asset = value as Partial<AssetBot>;
            const tokenConfigs = (configTipBotWhitelistAddresses.tokens as any)[key];
            if (tokenConfigs) {
                asset.whitelistAddresses = tokenConfigs.whitelistAddresses;
                asset.feePercentage = String(tokenConfigs.feePercentage);
            } else {
                asset.whitelistAddresses = configTipBotWhitelistAddresses.defaultWhitelistAddresses;
                asset.feePercentage = String(configTipBotWhitelistAddresses.defaultFeePercentage);
            }

            tokens.push(asset as AssetBot);
        }

        this._configBot = { tokens };
    }
}
