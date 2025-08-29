import React from 'react';
import { InputNumber } from '@components/InputNumber';
import { InputBoxItem, InputBoxLike, PreviewColor } from '../style.js';
import { degreeFormatter, degreeParser, percentFormatter, percentParser } from '../utils/stringConverter.js';
import { hsvToRgb } from '../utils/hsvRgbConverter.js';
import { hsvlToStr, strToHsvl } from '../utils/inputColorConverter.js';

export const InputHSV = ({ value, onChange }) => {
    const [h, s, v] = strToHsvl(value);

    const setHsv = input => {
        const newValue = { h, s, v, ...input };
        if (onChange) {
            onChange(hsvlToStr([newValue.h, newValue.s, newValue.v]));
        }
    };

    const { r, g, b } = hsvToRgb(h, s, v);

    return (
        <InputBoxLike>
            <InputBoxItem $radii="10px 0 0 10px">
                <PreviewColor $bg={`rgb(${r}, ${g}, ${b})`} />
            </InputBoxItem>
            <InputNumber value={h} formatter={degreeFormatter} parser={degreeParser} onChange={val => setHsv({ h: val })} />
            <InputNumber value={s} formatter={percentFormatter} parser={percentParser} onChange={val => setHsv({ s: val })} min={0} max={100} />
            <InputNumber
                formatter={percentFormatter}
                parser={percentParser}
                value={v}
                onChange={val => setHsv({ v: val })}
                min={0}
                max={100}
                $radii="0 10px 10px 0"
            />
        </InputBoxLike>
    );
};
