export function getStrings(data) {
    return Array.isArray(data) ? data.filter(v => v && typeof v === 'string') : [];
}

export function parseDesignerOptions(
    /**
     * @type {{id: string}[]}
     */
    designers
) {
    /**
     * @type {{ [id: string]: { value: string, data: { id: string } } }}
     */
    const idToDataMap = {};

    /**
     * @type {{ [value: string]: string }}
     */
    const valueToIdMap = {};

    /**
     * @type {{ value: string, data: { id: string } }[]}
     */
    const newArray = [];

    designers.forEach(currentData => {
        if (!currentData?.id) return;

        const { id } = currentData;

        const value = [currentData.firstname || '', currentData.lastname?.[0] || '', id].join('__SEP__');

        valueToIdMap[value] = id;

        const newItem = {
            data: currentData,
            value,
        };

        idToDataMap[id] = newItem;

        newArray.push(newItem);
    });

    const result = {
        array: newArray,
        idToDataMap,
        valueToIdMap,
    };

    return result;
}

export function mapDesignerIdsToValues(
    /**
     * @type {string[]}
     */
    designerIds,

    /**
     * @type {ReturnType<typeof parseDesignerOptions>['idToDataMap']}
     */
    idToDataMap
) {
    /**
     * @type {string[]}
     */
    const newValues = [];

    designerIds.forEach(id => {
        const designer = idToDataMap[id];

        if (designer) newValues.push(designer.value);
    });

    return newValues;
}

export function mapValuesToDesignerIds(
    /**
     * @type {string[]}
     */
    values,
    /**
     * @type {ReturnType<typeof parseDesignerOptions>['valueToIdMap']}
     */
    valueToIdMap
) {
    /**
     * @type {string[]}
     */
    const ids = [];

    values.forEach(value => {
        const id = valueToIdMap[value];

        if (id) ids.push(id);
    });

    return ids;
}
