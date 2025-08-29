import { degreeFormatter, degreeParser, percentFormatter, percentParser } from './stringConverter.js';

export const strToHsvl = input => {
    if (!input || input === null) {
        return [0, 0, 0];
    }
    const inputs = input.split(',');
    return [
        parseInt(degreeParser(inputs[0]), 10),
        parseInt(percentParser(inputs[1]), 10),
        parseInt(percentParser(inputs[2]), 10),
    ];
};

export const hsvlToStr = input =>
    `${degreeFormatter(input[0])},${percentFormatter(input[1])},${percentFormatter(input[2])}`;

export const strToCmyk = input => {
    if (!input || input === null) {
        return [0, 0, 0, 100];
    }
    return input.split(',').map(item => parseInt(percentParser(item), 10));
};

export const cmykToStr = input => input.map(item => percentFormatter(item)).join(',');

export const strToRgba = input => {
    if (!input || input === null) {
        return [0, 0, 0];
    }

    const inputs = input.split(',');
    return [
        parseInt(inputs[0], 10),
        parseInt(inputs[1], 10),
        parseInt(inputs[2], 10),
    ];
};

export const rgbaToStr = input => `${input[0]},${input[1]},${input[2]}`;
