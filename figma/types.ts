
export interface FigmaObject {
    name: string;
    children: FigmaObject[];
    type: string;
}

export interface FigmaDocument {
    children: FigmaPage[];
}

export interface FigmaPage extends FigmaObject {
}

export interface FigmaResponse {
    document: FigmaDocument;
}

export interface FigmaFrame extends FigmaObject {
}

export interface FigmaGroup extends FigmaObject {
}

export interface Rgba {
    r: number;
    g: number;
    b: number;
    a: number;
}
export interface FigmaFills {
    blendMode: string;
    type: string;
    color: Rgba;
}

export interface FigmaStylizedObject extends FigmaObject {
    fills: FigmaFills[];
}

export interface StyleAttribute {
    type: string;
    value: string | number | null;
}

export interface StyleMetadata {
    [attribute: string]: StyleAttribute;
}
