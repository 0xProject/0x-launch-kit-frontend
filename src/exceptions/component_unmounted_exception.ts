export class ComponentUnmountedException extends Error {
    constructor(componentName: string) {
        super(`${componentName} unmounted`);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
