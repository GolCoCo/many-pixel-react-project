import React from 'react';
import { InputNumber } from '@components/InputNumber';
import { InputBoxItem, InputBoxLike, PreviewColor } from '../style.js';
import { degreeFormatter, degreeParser, percentFormatter, percentParser } from '../utils/stringConverter.js';
import { hsvlToStr, strToHsvl } from '../utils/inputColorConverter.js';

export const InputHSL = ({ value, onChange }) => {
    const [h, s, l] = strToHsvl(value);

    const setHsl = input => {
        const newValue = { h, s, l, ...input };
        if (onChange) {
            onChange(hsvlToStr([newValue.h, newValue.s, newValue.l]));
        }
    };

    return (
        <InputBoxLike>
            <InputBoxItem $radii="10px 0 0 10px">
                <PreviewColor $bg={`hsl(${h}, ${s}%, ${l}%)`} />
            </InputBoxItem>
            <InputNumber value={h} formatter={degreeFormatter} parser={degreeParser} onChange={val => setHsl({ h: val })} />
            <InputNumber value={s} formatter={percentFormatter} parser={percentParser} onChange={val => setHsl({ s: val })} min={0} max={100} />
            <InputNumber
                value={l}
                formatter={percentFormatter}
                parser={percentParser}
                onChange={val => setHsl({ l: val })}
                min={0}
                max={100}
                $radii="0 10px 10px 0"
            />
        </InputBoxLike>
    );
};
