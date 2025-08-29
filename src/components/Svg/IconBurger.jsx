import React from 'react';

const IconBurger = ({ className }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="3.25" width="24" height="2.5" fill="currentColor" />
      <rect y="10.25" width="12" height="2.5" fill="currentColor" />
      <rect y="17.25" width="20" height="2.5" fill="currentColor" />
    </svg>
  );
};

export default IconBurger;
