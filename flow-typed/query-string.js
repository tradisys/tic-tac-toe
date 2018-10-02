// @flow

declare module 'query-string' {
    declare function parse(query: string): {+[key: string]: string};
}
