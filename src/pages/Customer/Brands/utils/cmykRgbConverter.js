/**
 * Original source
 *
 * https://gist.github.com/felipesabino/5066336
 */
export const cmykToRgb = (c, m, y, k) => {
    const percentC = c / 100;
    const percentM = m / 100;
    const percentY = y / 100;
    const percentK = k / 100;
    const r = 1 - Math.min(1, percentC * (1 - percentK) + percentK);
    const g = 1 - Math.min(1, percentM * (1 - percentK) + percentK);
    const b = 1 - Math.min(1, percentY * (1 - percentK) + percentK);

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
};
