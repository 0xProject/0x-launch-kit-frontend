import { any } from "prop-types";

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
export interface FigmaColors {
    blendMode: string;
    type: string;
    color: Rgba;
}

export interface FigmaStylizedObject extends FigmaObject {
    fills: FigmaColors[];
    cornerRadius?: number;
    strokeWeight?: number;
    strokes: FigmaColors[];
    effects?: Effect[];
    style?: any;
}

export interface StyleAttribute {
    type: string;
    value: string | object | number | null;
}

export interface StyleMetadata {
    [attribute: string]: StyleAttribute;
}

export interface Effect {
    type: string;
}

export interface DropshadowEffect extends Effect {
    color: Rgba;
    offset: any;
    radius: number;
}
