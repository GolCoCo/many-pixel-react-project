const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
const reIsPlainProp = /^\w*$/;

const charCodeOfDot = '.'.charCodeAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropName = RegExp(
    // Match anything that isn't a dot or bracket.
    '[^.[\\]]+' +
        '|' +
        // Or match property names within brackets.
        '\\[(?:' +
        // Match a non-string expression.
        '([^"\'][^[]*)' +
        '|' +
        // Or match strings (supports escaping characters).
        '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
        ')\\]' +
        '|' +
        // Or match "" as the space between consecutive dots or empty brackets.
        '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
    'g'
);

const MAX_MEMOIZE_SIZE = 500;
const INFINITY = 1 / 0;

const toString = Object.prototype.toString;

export function memoize(func, resolver) {
    if (typeof func !== 'function' || (resolver != null && typeof resolver !== 'function')) {
        throw new TypeError('Expected a function');
    }
    const memoized = function(...args) {
        const key = resolver ? resolver.apply(this, args) : args[0];
        const cache = memoized.cache;

        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
    };
    memoized.cache = new (memoize.Cache || Map)();
    return memoized;
}

memoize.Cache = Map;

export function memoizeCapped(func) {
    const result = memoize(func, key => {
        const { cache } = result;
        if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
        }
        return key;
    });

    return result;
}

export const stringToPath = memoizeCapped(string => {
    const result = [];
    if (string.charCodeAt(0) === charCodeOfDot) {
        result.push('');
    }
    string.replace(rePropName, (match, expression, quote, subString) => {
        let key = match;
        if (quote) {
            key = subString.replace(reEscapeChar, '$1');
        } else if (expression) {
            key = expression.trim();
        }
        result.push(key);
    });
    return result;
});

export function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }
    return toString.call(value);
}

export function isSymbol(value) {
    const type = typeof value;
    // eslint-disable-next-line
    return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]');
}

export function isKey(value, obj) {
    if (Array.isArray(value)) {
        return false;
    }
    const type = typeof value;
    if (type === 'number' || type === 'boolean' || value == null || isSymbol(value)) {
        return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || (obj != null && value in Object(obj));
}

export function toKey(value) {
    if (typeof value === 'string' || isSymbol(value)) {
        return value;
    }
    const result = `${value}`;
    // eslint-disable-next-line
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

export function castPath(value, obj) {
    if (Array.isArray(value)) {
        return value;
    }
    return isKey(value, obj) ? [value] : stringToPath(value);
}

export function get(obj, path) {
    path = castPath(path, obj);

    let index = 0;
    const length = path.length;

    while (obj != null && index < length) {
        obj = obj[toKey(path[index++])];
    }
    // eslint-disable-next-line
    return index && index == length ? obj : undefined;
}
