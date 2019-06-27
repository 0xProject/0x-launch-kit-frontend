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
        },
        required: ['decimals', 'symbol', 'name', 'addresses'],
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
