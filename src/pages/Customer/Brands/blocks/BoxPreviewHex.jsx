import React from 'react';
import { cmykToRgb } from '../utils/cmykRgbConverter.js';
import { hsvToRgb } from '../utils/hsvRgbConverter.js';

export const BoxPreviewHex = ({ width, height, hex, type }) => {
    let converted;
    switch (type) {
        case 'HEX':
            converted = hex;
            break;
        case 'RGB':
            converted = `rgba(${hex})`;
            break;
        case 'CMYK': {
            const cmyk = hex.split(',');
            const rgb = cmykToRgb(parseInt(cmyk[0], 10), parseInt(cmyk[1], 10), parseInt(cmyk[2], 10), parseInt(cmyk[3], 10));
            converted = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            break;
        }
        case 'HSV': {
            const hsv = hex.split(',');
            const rgb = hsvToRgb(parseInt(hsv[0], 10), parseInt(hsv[1], 10), parseInt(hsv[2], 10));
            converted = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            break;
        }
        case 'HSL': {
            converted = `hsl(${hex.replace('°', '')})`;
            break;
        }
        default:
            break;
    }

    return <div style={{ width, height, backgroundColor: converted, borderRadius: '8px' }} />;
};
