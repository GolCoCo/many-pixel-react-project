import React from 'react';

const IconOptions = props => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0)">
                <circle cx="18" cy="10" r="2" transform="rotate(90 18 10)" fill="currentColor" />
                <circle cx="10" cy="10" r="2" transform="rotate(90 10 10)" fill="currentColor" />
                <circle cx="2" cy="10" r="2" transform="rotate(90 2 10)" fill="currentColor" />
            </g>
            <defs>
                <clipPath id="clip0">
                    <rect width="1em" height="1em" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default IconOptions;
