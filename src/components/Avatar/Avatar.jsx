import React from 'react';
import { Tooltip } from 'antd';
import { Relative, ActiveDot } from './style.js';
import { Image } from '@components/Image';

const Avatar = props => {
    const { showActive, size, src = null, children, md5email = null, name, style, $textVariant, isActive, $fontSize, relativeW, relativeH } = props;
    const onlineActivity = isActive ? 'Online' : `Offline`;
    let imgLink = src;
    if (!src && md5email) {
        imgLink = `https://www.gravatar.com/avatar/${md5email}?s=${size * 2}&d=404`;
    }

    if (!src && !md5email) {
        imgLink = `https://www.gravatar.com/avatar?s=${size * 2}&d=mp`;
    }
    const avatarChildren = (
        <Relative $w={relativeW} $h={relativeH}>
            {showActive && isActive && <ActiveDot />}
            <Image name={name} size={size} $fontSize={$fontSize ?? 14} isRounded textProps={{ $textVariant }} src={imgLink} style={style}>
                {children}
            </Image>
        </Relative>
    );

    return showActive ? (
        <Tooltip title={onlineActivity} placement="top" color="white">
            {avatarChildren}
        </Tooltip>
    ) : (
        avatarChildren
    );
};

export default Avatar;
