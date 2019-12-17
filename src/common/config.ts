import { Validator } from 'jsonschema';

import { configFile, configFileIEO, configTemplateFile, configTipBot, configTipBotWhitelistAddresses } from '../config';
import { AssetBot, ConfigFile, ConfigFileIEO, ConfigFileTipBot, CurrencyPairMetaData } from '../util/types';

import { configIEOSchema, configSchema, schemas } from './configSchema';
import { TokenMetaData } from './tokens_meta_data';

export class Config {
    private static _instance: Config;
    private readonly _validator: Validator;
    private _config: ConfigFile;
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

    public _setConfig(config: ConfigFile): void {
        this._validator.validate(configFile, configSchema, { throwError: true });
        this._config = config;
    }
}

export class ConfigTemplate {
    private static _instance: ConfigTemplate;
    private readonly _validator: Validator;
    private _config: ConfigFile;
    public static getInstance(): ConfigTemplate {
        if (!ConfigTemplate._instance) {
            ConfigTemplate._instance = new ConfigTemplate();
        }
        return ConfigTemplate._instance;
    }

    public static getConfig(): ConfigFile {
        return this.getInstance()._config;
    }

    constructor() {
        this._validator = new Validator();
        for (const schema of schemas) {
            this._validator.addSchema(schema, schema.id);
        }
        this._validator.validate(configTemplateFile, configSchema, { throwError: true });
        this._config = configTemplateFile;
    }

    public _setConfig(config: ConfigFile): void {
        this._validator.validate(configTemplateFile, configSchema, { throwError: true });
        this._config = configTemplateFile;
    }

    public setPairs(pairs: CurrencyPairMetaData[]): void {
        this._config.pairs = pairs;
    }
    public setTokens(tokens: TokenMetaData[]): void {
        this._config.tokens = tokens;
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
