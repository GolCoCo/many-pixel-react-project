import { COLOR_OTHERS_GREEN, COLOR_OTHERS_RED } from '@components/Theme';
import * as React from 'react';
import styled from 'styled-components';

export const YellowOrangeGradientSpan = styled.span`
    /* Fallback: Set a background color. */
    background-color: #e79800;

    /* Create the gradient. */
    background-image: linear-gradient(180deg, #ffdb1d, #e79800);

    /* Set the background size and repeat properties. */
    background-size: 100%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    background-clip: text;
`;

export default function StatusColoredText({ status, children, className, style }) {
    if (status === 'active' || status === 'paused') {
        return (
            <span className={className} style={{ color: COLOR_OTHERS_GREEN, ...style }}>
                {children}
            </span>
        );
    }

    if (status === 'inactive') {
        return (
            <span className={className} style={{ color: COLOR_OTHERS_RED, ...style }}>
                {children}
            </span>
        );
    }

    if (status === 'canceled') {
        return (
            <YellowOrangeGradientSpan className={className} style={style}>
                {children}
            </YellowOrangeGradientSpan>
        );
    }

    return (
        <span className={className} style={style}>
            {children}
        </span>
    );
}
