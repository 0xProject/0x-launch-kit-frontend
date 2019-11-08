import { Schema } from 'jsonschema';

export const configSchema: Schema = {
    id: '/configSchema',
    properties: {
        tokens: { type: 'array', items: { $ref: '/tokenMetaDataSchema' } },
        pairs: { type: 'array', items: { $ref: '/pairSchema' } },
    },
    required: ['tokens', 'pairs'],
    type: 'object',
};

export const configIEOSchema: Schema = {
    id: '/configIEOSchema',
    properties: {
        tokens: { type: 'array', items: { $ref: '/tokenMetaDataIEOSchema' } },
    },
    required: ['tokens'],
    type: 'object',
};

export const schemas: Schema[] = [
    {
        id: '/addressSchema',
        type: 'string',
        pattern: '^0x[0-9a-f]{40}$',
    },
    {
        id: '/wholeNumberSchema',
        anyOf: [
            {
                type: 'string',
                pattern: '^\\d+$',
            },
            {
                type: 'integer',
            },
        ],
    },
    {
        id: '/configPairSchema',
        properties: {
            minPrice: { $ref: '/wholeNumberSchema' },
            pricePrecision: { $ref: '/wholeNumberSchema' },
            minAmount: { $ref: '/wholeNumberSchema' },
            basePrecision: { $ref: '/wholeNumberSchema' },
            quotePrecision: { $ref: '/wholeNumberSchema' },
        },
        type: 'object',
    },

    {
        id: '/marketFilterSchema',
        properties: {
            text: { type: 'string' },
            valute: { type: 'string' },
        },
        required: ['text', 'value'],
        type: 'object',
    },
    {
        id: '/pairSchema',
        properties: {
            base: { type: 'string' },
            quote: { type: 'string' },
            config: { $ref: '/configPairSchema' },
        },
        required: ['base', 'quote'],
        type: 'object',
    },
    {
        id: '/tokenMetaDataSchema',
        properties: {
            symbol: { type: 'string' },
            name: { type: 'string' },
            icon: { type: 'string' },
            primaryColor: { type: 'string' },
            decimals: { $ref: '/wholeNumberSchema' },
            displayDecimals: { $ref: '/wholeNumberSchema' },
            minAmount: { $ref: '/wholeNumberSchema' },
            maxAmount: { $ref: '/wholeNumberSchema' },
            precision: { $ref: '/wholeNumberSchema' },
            description: { type: 'string' },
            website: { type: 'string' },
            verisafe_sticker: { type: 'string' },
        },
        required: ['decimals', 'symbol', 'name', 'addresses'],
        type: 'object',
    },
    {
        id: '/tokenMetaDataIEOSchema',
        properties: {
            symbol: { type: 'string' },
            name: { type: 'string' },
            icon: { type: 'string' },
            primaryColor: { type: 'string' },
            decimals: { $ref: '/wholeNumberSchema' },
            displayDecimals: { $ref: '/wholeNumberSchema' },
            minAmount: { $ref: '/wholeNumberSchema' },
            maxAmount: { $ref: '/wholeNumberSchema' },
            precision: { $ref: '/wholeNumberSchema' },
            description: { type: 'string' },
            website: { type: 'string' },
            verisafe_sticker: { type: 'string' },
            owners: { type: 'array' },
            social: { $ref: '/socialSchema' },
        },
        required: ['decimals', 'symbol', 'name', 'addresses'],
        type: 'object',
    },
    {
        id: '/socialSchema',
        properties: {
            facebook_url: { type: 'string' },
            reddit_url: { type: 'string' },
            twitter_url: { type: 'string' },
            telegram_url: { type: 'string' },
            discord_url: { type: 'string' },
            bitcointalk_url: { type: 'string' },
            youtube_url: { type: 'string' },
            medium_url: { type: 'string' },
        },
        type: 'object',
    },
    {
        id: '/configSchema',
        properties: {
            tokens: { type: 'array', items: { $ref: '/tokenMetaDataSchema' } },
            pairs: { type: 'array', items: { $ref: '/pairSchema' } },
            marketFilters: { type: 'array', items: { $ref: '/marketFilterSchema' } },
        },
        required: ['tokens', 'pairs'],
        type: 'object',
    },
];
