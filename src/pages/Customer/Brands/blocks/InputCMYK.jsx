import React from 'react';
import { InputNumber } from '@components/InputNumber';
import { InputBoxItem, InputBoxLike, PreviewColor } from '../style.js';
import { cmykToRgb } from '../utils/cmykRgbConverter.js';
import { percentFormatter, percentParser } from '../utils/stringConverter.js';
import { strToCmyk, cmykToStr } from '../utils/inputColorConverter.js';

export const InputCMYK = ({ value, onChange }) => {
    const [c, m, y, k] = strToCmyk(value);

    const setCmyk = input => {
        const newValue = { c, m, y, k, ...input };
        if (onChange) {
            onChange(cmykToStr([newValue.c, newValue.m, newValue.y, newValue.k]));
        }
    };

    const { r, g, b } = cmykToRgb(c, m, y, k);

    return (
        <InputBoxLike>
            <InputBoxItem $radii="10px 0 0 10px">
                <PreviewColor $bg={`rgb(${r}, ${g}, ${b})`} />
            </InputBoxItem>
            <InputNumber value={c} formatter={percentFormatter} parser={percentParser} onChange={val => setCmyk({ c: val })} min={0} max={100} />
            <InputNumber value={m} formatter={percentFormatter} parser={percentParser} onChange={val => setCmyk({ m: val })} min={0} max={100} />
            <InputNumber formatter={percentFormatter} parser={percentParser} value={y} onChange={val => setCmyk({ y: val })} min={0} max={100} />
            <InputNumber
                formatter={percentFormatter}
                parser={percentParser}
                value={k}
                onChange={val => setCmyk({ k: val })}
                min={0}
                max={100}
                $radii="0 10px 10px 0"
            />
        </InputBoxLike>
    );
};
