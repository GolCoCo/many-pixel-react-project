import React from 'react';
import Icon from '@ant-design/icons';

const NotSvg = () => (
  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.0006 17.4H10C6.18769 17.4 3.1 14.3123 3.1 10.5C3.1 9.0263 3.56325 7.66386 4.35403 6.54729L13.9528 16.1461C12.8001 16.963 11.4191 17.4029 10.0006 17.4ZM9.99939 3.6H10C13.8123 3.6 16.9 6.68769 16.9 10.5C16.9 11.9737 16.4367 13.3361 15.646 14.4527L6.04718 4.85391C7.19994 4.03702 8.58095 3.59712 9.99939 3.6ZM10 1.2C4.86631 1.2 0.7 5.36631 0.7 10.5C0.7 15.6337 4.86631 19.8 10 19.8C15.1337 19.8 19.3 15.6337 19.3 10.5C19.3 5.36631 15.1337 1.2 10 1.2Z" fill="#FF3041" stroke="#FF3041" strokeWidth="0.6" />
  </svg>
);

const NotIcon = (props) => <Icon component={NotSvg} {...props} />;

export default NotIcon;
