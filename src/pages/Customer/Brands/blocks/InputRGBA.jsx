import React from 'react';
import { InputNumber } from '@components/InputNumber';
import { InputBoxItem, InputBoxLike, PreviewColor } from '../style.js';
import { rgbaToStr, strToRgba } from '../utils/inputColorConverter.js';

export const InputRGBA = ({ value, onChange }) => {
    const [r, g, b] = strToRgba(value);

    const setRgba = input => {
        const newValue = { r, g, b, ...input };
        if (onChange) {
            onChange(rgbaToStr([newValue.r, newValue.g, newValue.b]));
        }
    };
    return (
        <InputBoxLike>
            <InputBoxItem $radii="10px 0 0 10px">
                <PreviewColor $bg={`rgba(${r}, ${g}, ${b})`} />
            </InputBoxItem>
            <InputNumber value={r} onChange={val => setRgba({ r: val })} min={0} max={255} />
            <InputNumber value={g} onChange={val => setRgba({ g: val })} min={0} max={255} />
            <InputNumber $radii="0 10px 10px 0" value={b} onChange={val => setRgba({ b: val })} min={0} max={255} />
        </InputBoxLike>
    );
};
