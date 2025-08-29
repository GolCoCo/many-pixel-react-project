import React from 'react';
import Icon from '@ant-design/icons';

const CheckSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 10.2586L7.56457 18L20 5.27401L16.8008 2L7.56464 11.452L3.19924 6.98455L0 10.2586ZM16.8006 2.73986L19.277 5.27413L7.56453 17.2603L7.56458 17.2603L19.2772 5.27401L16.8008 2.73969L16.8006 2.73986ZM3.19924 7.72424L7.56459 12.1916L7.56442 12.1918L3.19907 7.72441L3.19924 7.72424ZM7.56448 12.9628L7.56445 12.9628L16.8005 3.51082L16.8006 3.51086L7.56448 12.9628ZM7.56436 16.4894L7.56439 16.4894L1.47604 10.2587L3.19905 8.49541L3.19902 8.49537L1.47598 10.2587L7.56436 16.4894Z"
            fill="currentColor"
        />
    </svg>
);

const CheckIcon = props => <Icon component={CheckSvg} {...props} />;

export default CheckIcon;
