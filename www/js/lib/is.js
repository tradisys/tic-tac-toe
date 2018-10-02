// @flow

export function isNull(value: mixed): boolean %checks {
    return value === null;
}

export function isNotNull(value: mixed): boolean %checks {
    return value !== null;
}

export function isUndefined(value: mixed): boolean %checks {
    return typeof value === 'undefined';
}

export function isNotUndefined(value: mixed): boolean %checks {
    return typeof value !== 'undefined';
}

export function isBoolean(value: mixed): boolean %checks {
    return typeof value === 'boolean';
}

export function isNotBoolean(value: mixed): boolean %checks {
    return typeof value !== 'boolean';
}

export function isNumber(value: mixed): boolean %checks {
    return typeof value === 'number';
}

export function isNotNumber(value: mixed): boolean %checks {
    return typeof value !== 'number';
}

export function isString(value: mixed): boolean %checks {
    return typeof value === 'string';
}

export function isNotString(value: mixed): boolean %checks {
    return typeof value !== 'string';
}

export function isFunction(value: mixed): boolean %checks {
    return typeof value === 'function';
}

export function isNotFunction(value: mixed): boolean %checks {
    return typeof value !== 'function';
}
