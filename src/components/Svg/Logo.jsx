import React from 'react';
import styled from 'styled-components';
import logoFile from '@public/assets/icons/logo_manypixels.svg';
import logoFileWhite from '@public/assets/icons/logo_manypixels_white.svg';
import logoFileSmall from '@public/assets/icons/logo_manypixels_notext.svg';

const Logo = styled.img`
    display: inline-block;
    height: ${p => p.height || '64'}px;
    width: auto;
    backface-visibility: hidden;
`;

export default props => <>{props.iconOnly ? <Logo {...props} src={logoFileSmall} /> : <Logo {...props} src={props.inverted ? logoFileWhite : logoFile} />}</>;
