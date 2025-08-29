import React from 'react';
import { Link as RRDLink, NavLink as RRDNavLink } from 'react-router-dom';

/**
 * To enable "as" prop for styled components
 * Link and NavLink props from react-router-dom need to be filtered
 * From 'styled-components' docs there is no other way to filter props when using "as" prop
 */

export const Link = ({ to, className, style, children }) => (
    <RRDLink to={to} className={className} style={style}>
        {children}
    </RRDLink>
);

export const NavLink = ({ to, className, style, children, exact, activeClassName, activeStyle, strict, isActive, location }) => (
    <RRDNavLink
        to={to}
        className={className}
        style={style}
        activeClassName={activeClassName}
        activeStyle={activeStyle}
        isActive={isActive}
        location={location}
        strict={strict}
        exact={exact}
    >
        {children}
    </RRDNavLink>
);
