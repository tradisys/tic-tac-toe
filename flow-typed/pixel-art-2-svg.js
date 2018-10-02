// @flow

declare module 'pixel-art-2-svg' {
    declare module.exports: (pathToImage: string) => Promise<string | null>;
}
