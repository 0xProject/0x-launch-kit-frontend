export const lerp = (v0: number, v1: number, t: number): number => {
    return v0 * (1 - t) + v1 * t;
};
