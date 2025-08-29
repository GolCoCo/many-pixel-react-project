/**
 * @param {string} name
 * @param {any} value
 */
export function dispatchFieldChangeCallback(name, value) {
    return (
        /**
         * @type {Record<string, any>}
         */
        current
    ) => {
        if (current[name] !== value) {
            return {
                ...current,
                [name]: value,
            };
        }

        return current;
    };
}
