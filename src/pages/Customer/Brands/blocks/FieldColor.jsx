import React, { forwardRef } from 'react';
import { InputHex } from './InputHex.jsx';
import { InputCMYK } from './InputCMYK.jsx';
import { InputHSL } from './InputHSL.jsx';
import { InputHSV } from './InputHSV.jsx';
import { InputRGBA } from './InputRGBA.jsx';

const FieldColor = forwardRef(({ value, onChange, type = 'HEX' }, ref) => {
    if (type === 'HEX') {
        return <InputHex value={value} onChange={onChange} />;
    }

    if (type === 'RGB') {
        return <InputRGBA value={value} onChange={onChange} />;
    }

    if (type === 'CMYK') {
        return <InputCMYK value={value} onChange={onChange} />;
    }

    if (type === 'HSV') {
        return <InputHSV value={value} onChange={onChange} />;
    }

    if (type === 'HSL') {
        return <InputHSL value={value} onChange={onChange} />;
    }

    return null;
});

export default FieldColor;
