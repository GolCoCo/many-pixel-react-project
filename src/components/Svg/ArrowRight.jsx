import React from 'react';
import Icon from '@ant-design/icons';

const ArrowRightSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.92078 3.2002L4.80078 4.3202L8.48078 8.0002L4.80078 11.6802L5.92078 12.8002L10.7208 8.0002L5.92078 3.2002Z"
            fill="currentColor"
        />
    </svg>
);

const ArrowRightIcon = props => <Icon component={ArrowRightSvg} {...props} />;

export default ArrowRightIcon;
