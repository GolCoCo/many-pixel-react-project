// @flow
import moment from 'moment';
import React, { Fragment } from 'react';

const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

const capitalize = (string, lower) => (lower ? string.toLowerCase() : string).replace(/(?:^|\s)\S/g, a => a.toUpperCase());

const humanFileSize = size => {
    if (!size) return '0 kb';
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / 1024 ** i).toFixed(0) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

const uuid = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        // eslint-disable-next-line no-bitwise
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line no-bitwise
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

const TODAY = moment().startOf('day');
const YESTERDAY = moment().subtract(1, 'days').startOf('day');

const isToday = momentDate => momentDate.isSame(TODAY, 'd');
const isYesterday = momentDate => momentDate.isSame(YESTERDAY, 'd');

const prettyTime = time => {
    const m = moment(time);

    if (isToday(m)) return m.format('HH:mm');
    if (isYesterday(m)) return m.format('[Yesterday at] HH:mm');
    return m.format('D MMM, YYYY [at] HH:mm');
};

const textWithUrlConfig = [
    {
        regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
        fn: (key, result) => (
            <Fragment key={key}>
                <a target="_blank" rel="noopener noreferrer" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>
                    {result[1]}
                    ://
                    {result[2]}.{result[3]}
                    {result[4]}
                </a>
                {result[5]}
            </Fragment>
        ),
    },
    {
        regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
        fn: (key, result) => (
            <Fragment key={key}>
                <a target="_blank" rel="noopener noreferrer" href={`http://${result[1]}.${result[2]}${result[3]}`}>
                    {result[1]}.{result[2]}
                    {result[3]}
                </a>
                {result[4]}
            </Fragment>
        ),
    },
];

const openInNewTab = href => {
    Object.assign(document.createElement('a'), {
        target: '_blank',
        href,
    }).click();
};

const debounce = (func, wait, immediate) => {
    let timeout = null;
    return (...args) => {
        const context = this;
        const executable = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            if (!executable) {
                func.apply(context, args);
            }
        }, wait);
        if (executable) func.apply(context, args);
    };
};

const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return (...args) => {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

export const MANAGER = 'manager';
export const OWNER = 'owner';
export const WORKER = 'worker';
export const CUSTOMER = 'customer';
export const TEAM = [OWNER, MANAGER, WORKER];
export const MANAGEMENT = [OWNER, MANAGER];

export const isManagement = role => MANAGEMENT.indexOf(role) > -1;
export const isTeam = role => TEAM.indexOf(role) > -1;
export const isOwner = role => role === OWNER;
export const isManager = role => role === MANAGER;
export const isCustomer = role => role === CUSTOMER;

const isBrowser = typeof window !== 'undefined';
const isTouchDevice = () => 'ontouchstart' in window;

export { usdFormatter, capitalize, prettyTime, humanFileSize, uuid, textWithUrlConfig, openInNewTab, debounce, throttle, isBrowser, isTouchDevice };
