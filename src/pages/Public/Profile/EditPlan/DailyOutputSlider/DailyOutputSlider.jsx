import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Slider } from '@components/Slider';
import { Box } from '@components/Box';
import * as theme from '@components/Theme';

const marks = {
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: '',
    9: '',
    10: '',
};

const TooltipSlider = styled.div`
    .ant-tooltip {
        padding-bottom: 3px;
    }
    .ant-tooltip-arrow {
        display: none;
    }
    .ant-tooltip-inner {
        ${theme.TYPO_P4}
        color: #000000;
        box-shadow: none;
        border: 1px solid ${theme.COLOR_OUTLINE_GRAY};
        padding: 7px 12px;
    }
`;

export const DailyOutputSlider = ({ value, onChange }) => {
    const ref = useRef(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (ref.current) {
            setLoaded(true);
        }
    }, []);

    return (
        <Box $pt="36">
            <TooltipSlider ref={ref} />
            {loaded && (
                <Slider
                    min={3}
                    max={10}
                    marks={marks}
                    step={null}
                    defaultValue={3}
                    onChange={onChange}
                    tooltipVisible={true}
                    tipFormatter={val => `${val} daily outputs`}
                    getTooltipPopupContainer={() => ref.current}
                />
            )}
        </Box>
    );
};
