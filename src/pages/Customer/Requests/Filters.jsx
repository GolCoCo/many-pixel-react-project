import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Avatar from '@components/Avatar';
import { Badge } from '@components/Badge';
import { get } from 'lodash';
import { Radio, RadioGroup } from '@components/Radio';
import { DelayedSearchInput } from './blocks/DelayedSearchInput';
import styled from 'styled-components';
import { Dropdown } from 'antd';
import IconFilter from '@components/Svg/IconFilter.jsx';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { getOrderGroupValues } from '@constants/order';
import * as qs from 'query-string';
import { Tabs } from '@components/Tabs';
import { Text } from '@components/Text';
import IconNoBrand from '@components/Svg/IconNoBrand';
import CloseIcon from '@components/Svg/Close';

const CustomTabContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 2px;
    width: fit-content;
    max-width: 367px;
    cursor: pointer;

    background: #f3f3f3;
    border-radius: 10px;

    flex: none;
    order: 0;
    flex-grow: 0;
`;

const CustomTab = styled.div`
    /* Auto layout */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 24px;
    gap: 8px;
    min-width: 85px;
    max-width: 149px;
    height: 44px;

    &:hover {
        background: #e7e7e7;
        border-radius: 10px;
        color: #0099f6;
    }

    /* Background/White */
    ${props =>
        props.$isActive &&
        `
      background: #FFFFFF !important;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
  `}

    /* Inside auto layout */
  flex: none;
    order: 0;
    flex-grow: 0;
    /* Title/Black */
    font-family: 'Mulish';
    font-style: normal;
    font-weight: 900;
    font-size: 14px;
    line-height: 140%;

    /* Primary Color/Primary */
    color: ${props => (props.$isActive ? '#0099F6' : 'black')};
`;

const DropdownContainer = styled.div`
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
    max-width: 550px;
    border-radius: 10px;
    border: 1px solid #d5d6dd;
    background-color: white;

    ${props =>
        props.$isNav &&
        `
    max-height: 50vh;
    overflow-y: auto;
//  width:100%
//   max-width: 100vw;
//   overflow: hidden;
  `}
`;

const FilterContainer = styled.div`
    display: flex;
    gap: 16px; /* Space between columns */
    flex-wrap: wrap; /* Ensures wrapping on smaller screens */
    margin-top: 16px;
    ${props =>
        props.$maxH &&
        `
        max-height: ${props.$maxH}px;
    `}
    ${props =>
        props.$overflowY &&
        `
        overflow-y: ${props.$overflowY};
    `}
    ${props =>
        props.$overflowX &&
        `
        overflow-x: ${props.$overflowX};
    `}
    ${props =>
        props.$isNav &&
        `
 width:100%
  max-width: 100vw;
  overflow: hidden;
  `}

    .column {
        flex: 1; /* Equal width for both columns */
        box-sizing: border-box; /* Include padding and border in the width calculation */
    }
`;

export const getCurrentValue = value => {
    if (Array.isArray(value)) {
        return value.filter(v => v !== 'All');
    }

    if (typeof value === 'string' && value) {
        if (value === 'All') {
            return [];
        }

        if (value.includes(',')) {
            const values = value.split(',');
            return values.filter(v => v !== 'All');
        }

        return [value];
    }

    return [];
};

const ButtonFilters = ({ options, onApply, currentValue, labelKey, filterKey, valueKey, iconKey, isNav, handleSetActiveFilters, callback }) => {
    const [value, setValue] = useState(currentValue);
    const handleStatusClick = useCallback(
        name => {
            if (value.includes(name)) {
                setValue(curr => curr.filter(prev => prev !== name));
            } else {
                setValue(curr => [...curr, name]);
            }
        },
        [value]
    );

    const handleApply = useCallback(() => {
        onApply(filterKey, value);
        if (handleSetActiveFilters) handleSetActiveFilters(!!value.length);
    }, [value]);

    const handleClear = useCallback(() => {
        if (filterKey === 'status') {
            onApply(filterKey, 'All');
            if (handleSetActiveFilters) handleSetActiveFilters(false);
            if (callback) {
                callback({ status: 'All' });
                setValue([]);
            }
            return;
        }
        if (callback) {
            callback({ [filterKey]: null });
            setValue(null);
        }
        onApply(filterKey, null);
    }, [value]);

    if (!options) {
        return <Box $mt="10">Fetching {filterKey}...</Box>;
    }
    return (
        <Box>
            <FilterContainer $isNav={isNav} $maxH="355" $overflowY="auto" $overflowX="hidden">
                {options.map(option => (
                    <Button
                        type={value?.includes(option[valueKey]) ? 'primary' : 'default'}
                        $fontWeight="400"
                        fontFamily="Geomanist"
                        className="column"
                        iscapitalized="true"
                        onClick={() => handleStatusClick(option[valueKey])}
                        key={option[valueKey]}
                        $minW="calc(50% - 8px)"
                        $maxW="calc(50% - 8px)"
                        icon={
                            option.Icon ? (
                                <option.Icon />
                            ) : iconKey ? (
                                <Box $fontSize="10" $lineH="0" $d="inline-block">
                                    <Avatar src={get(option, iconKey)} size={24} style={{ maxWidth: 'none' }} name={option[labelKey]} $textVariant="SmallTitle" />
                                </Box>
                            ) : null
                        }
                    >
                        {option[labelKey].length > 15 ? `${option[labelKey].substring(0, 15)}...` : option[labelKey]}
                    </Button>
                ))}
            </FilterContainer>
            {((value && value.length > 0) || JSON.stringify(value) !== JSON.stringify(currentValue)) && (
                <Box $d="flex" $justifyContent="space-between" $mt="20">
                    <Button type="link" onClick={handleClear}>
                        Clear All
                    </Button>
                    {JSON.stringify(value) !== JSON.stringify(currentValue) && (
                        <Button type="primary" onClick={handleApply}>
                            Apply
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

const RadioFilters = ({ options = [], valueKey, additionalLabelKey, labelKey, filterKey, currentValue, onApply, handleSetActiveFilters, isNav, callback }) => {
    const [value, setValue] = useState(currentValue);

    useEffect(() => {
        setValue(currentValue);
    }, [currentValue]);

    const handleApply = useCallback(() => {
        onApply(filterKey, value);
        if (handleSetActiveFilters) handleSetActiveFilters(!!value);
    }, [value, filterKey, onApply, handleSetActiveFilters]);

    const handleClear = useCallback(() => {
        onApply(filterKey, null);
        if (handleSetActiveFilters) handleSetActiveFilters(false);
        if (callback) {
            callback({ [filterKey]: null });
            setValue(null);
        }
    }, [filterKey, onApply, handleSetActiveFilters]);

    if (!options || options.length === 0) {
        return <Box $mt="10">No {filterKey}s available</Box>;
    }

    return (
        <Box $d="flex" $mt="16" $flexDir="column">
            <RadioGroup onChange={e => setValue(e.target.value)} value={value} $maxH="355" $overflowY="auto" $overflowX="hidden">
                {options.map(option => (
                    <Radio value={get(option, valueKey)} key={get(option, valueKey)} className="filter">
                        {get(option, labelKey)} {additionalLabelKey ? get(option, additionalLabelKey) : ''}
                    </Radio>
                ))}
            </RadioGroup>

            {(value !== null || JSON.stringify(value) !== JSON.stringify(currentValue)) && (
                <Box $d="flex" $justifyContent="space-between" $mt="20">
                    <Button type="link" onClick={handleClear}>
                        Clear All
                    </Button>
                    {JSON.stringify(value) !== JSON.stringify(currentValue) && (
                        <Button type="primary" onClick={handleApply}>
                            Apply
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

const DropdownContent = ({
    companyData,
    categoriesData,
    brandsData,
    currentTab,
    location,
    history,
    statusValue,
    brandsValue,
    designValue,
    ownerValue,
    designerValue,
    handleSetFilter,
    query,
    isNav,
    handleSetActiveFilters,
    allDesigners,
    isDesignersLoading,
    withReload = true,
    callback = null,
    state = null,
}) => {
    const statusGroup = getOrderGroupValues(currentTab);

    const sortedOwners = useMemo(() => {
        const owners = [...get(companyData, 'Company.users', [])];
        return owners.sort((a, b) => a.firstname.localeCompare(b.firstname));
    }, [companyData]);

    const filteredAndSortedDesigners = useMemo(() => {
        if (isDesignersLoading) {
            return [];
        }

        if (!allDesigners || allDesigners.length === 0) {
            return [];
        }

        const designers = allDesigners.filter(designer => {
            if (!designer.orders || designer.orders.length === 0) {
                const shouldShow = currentTab === 'QUEUE';
                return shouldShow;
            }

            const hasMatchingOrders = designer.orders.some(order => {
                switch (currentTab) {
                    case 'QUEUE':
                        return ['ONGOING_PROJECT', 'ONGOING_REVISION', 'SUBMITTED', 'AWAITING_FEEDBACK', 'QUEUED'].includes(order.status);
                    case 'DELIVERED':
                        return ['DELIVERED_PROJECT', 'DELIVERED_REVISION', 'COMPLETED'].includes(order.status);
                    case 'DRAFT':
                        return order.status === 'DRAFT';
                    default:
                        return false;
                }
            });

            return hasMatchingOrders;
        });

        const sortedDesigners = designers.sort((a, b) => a.firstname.localeCompare(b.firstname));

        return sortedDesigners;
    }, [allDesigners, currentTab, isDesignersLoading]);

    const onApply = (key, value) => {
        const obj = state
            ? {
                  ...state,
                  [key]: value,
              }
            : {
                  ...query,
                  [key]: value,
              };
        const stringify = qs.stringify(obj);
        if (withReload) {
            history.push(`${location.pathname}?${stringify}`);
        } else {
            window.history.pushState('', '', `${location.pathname}?${stringify}`);
        }
        if (callback) {
            callback(obj);
        }
        if (handleSetFilter) handleSetFilter(false);
        if (handleSetActiveFilters) handleSetActiveFilters(!!stringify.length);
    };

    // Reorder the array based on the desired order
    const orderedArray = useMemo(() => {
        return categoriesData?.allCategories.map(item => categoriesData?.allCategories?.find(categ => categ.title === item.title)).filter(Boolean);
    }, [categoriesData]);

    const items = useMemo(() => {
        let tabs = [
            {
                key: 'brand',
                label: <div>Brand {brandsValue.length > 0 && <Badge $isNotification>{brandsValue.length}</Badge>}</div>,
                children: (
                    <ButtonFilters
                        isNav={isNav}
                        currentValue={brandsValue}
                        onApply={onApply}
                        options={get(brandsData, 'User.company.brands', []).concat({ name: 'No brand', id: 'none', logos: [], Icon: IconNoBrand })}
                        labelKey="name"
                        filterKey={callback ? 'brands' : 'brand'}
                        valueKey="id"
                        iconKey="logos[0].url"
                        handleSetActiveFilters={handleSetActiveFilters}
                        callback={callback}
                    />
                ),
            },
            {
                key: 'design',
                label: <div>Design {designValue.length > 0 && <Badge $isNotification>{designValue.length}</Badge>}</div>,
                children: (
                    <ButtonFilters
                        isNav={isNav}
                        options={orderedArray}
                        currentValue={designValue}
                        onApply={onApply}
                        labelKey="title"
                        filterKey="design"
                        valueKey="id"
                        handleSetActiveFilters={handleSetActiveFilters}
                        callback={callback}
                    />
                ),
            },
            {
                key: 'owner',
                label: <div>Owner {ownerValue && <Badge $isNotification>1</Badge>}</div>,
                children: (
                    <RadioFilters
                        isNav={isNav}
                        options={sortedOwners}
                        valueKey="id"
                        labelKey="firstname"
                        additionalLabelKey="lastname"
                        onApply={onApply}
                        filterKey="owner"
                        currentValue={ownerValue}
                        handleSetActiveFilters={handleSetActiveFilters}
                        callback={callback}
                    />
                ),
            },
            {
                key: 'designer',
                label: <div>Designer {designerValue && <Badge $isNotification>1</Badge>}</div>,
                children: (
                    <Box>
                        {isDesignersLoading ? (
                            <Box $mt="10">Loading designers...</Box>
                        ) : !allDesigners || allDesigners.length === 0 ? (
                            <Box $mt="10">No designers available</Box>
                        ) : filteredAndSortedDesigners.length === 0 ? (
                            <Box $mt="10">No designers found for current tab</Box>
                        ) : (
                            <RadioFilters
                                isNav={isNav}
                                options={filteredAndSortedDesigners}
                                valueKey="id"
                                labelKey="firstname"
                                additionalLabelKey="lastname"
                                onApply={onApply}
                                filterKey="designer"
                                currentValue={designerValue}
                                handleSetActiveFilters={handleSetActiveFilters}
                                callback={callback}
                            />
                        )}
                    </Box>
                ),
            },
        ];

        if (currentTab !== 'DRAFT') {
            tabs = [
                {
                    key: 'status',
                    label: <div>Status {statusValue.length > 0 && <Badge $isNotification>{statusValue.length}</Badge>}</div>,
                    children: (
                        <ButtonFilters
                            isNav={isNav}
                            statusGroup={statusGroup}
                            currentValue={statusValue}
                            onApply={onApply}
                            options={statusGroup.filter(s => s.label !== 'All')}
                            labelKey="label"
                            filterKey="status"
                            valueKey="label"
                            handleSetActiveFilters={handleSetActiveFilters}
                            callback={callback}
                        />
                    ),
                },
                ...tabs,
            ];
        }
        return tabs;
    }, [
        currentTab,
        brandsData,
        companyData,
        categoriesData,
        allDesigners,
        filteredAndSortedDesigners,
        isDesignersLoading,
        designerValue,
        brandsValue,
        designValue,
        ownerValue,
        statusValue,
        sortedOwners,
        orderedArray,
        isNav,
        handleSetActiveFilters,
    ]);
    return (
        <DropdownContainer $isNav={isNav} className="dropdown__container">
            <Box
                $d="flex"
                $justifyContent="space-between"
                style={{
                    width: '100%',
                    maxWidth: '100%',
                }}
                $alignItems="center"
            >
                <Text $textVariant="H5">Filters</Text>
                {isNav && (
                    <Button type="text" style={{ fontSize: '17px' }} onClick={() => handleSetFilter(false)}>
                        <CloseIcon />
                    </Button>
                )}
            </Box>

            <Tabs $isNav={isNav} items={items} $minW="500" />
        </DropdownContainer>
    );
};

export const ExtraTabContent = ({ adminView = false, search, location, currentTab, isNav = false, handleSetFilter, ...props }) => {
    const { isSubscriptionActive, subStatus } = search;
    const [state, setState] = useState(props.state);
    const query = qs.parse(location.search);
    const statusValue = state ? getCurrentValue(state.status) : getCurrentValue(query.status);
    const brandsValue = state ? getCurrentValue(state.brands) : getCurrentValue(query.brand);
    const designValue = state ? getCurrentValue(state.design) : getCurrentValue(query.design);
    const ownerValue = state ? state.owner : get(query, 'owner', null);
    const designerValue = state ? state.designer : get(query, 'designer', null);
    const filtersDone =
        (statusValue.length ? 1 : 0) + (brandsValue.length ? 1 : 0) + (designValue.length ? 1 : 0) + (!!ownerValue ? 1 : 0) + (!!designerValue ? 1 : 0);
    const dropdownProps = {
        ...props,
        location,
        query,
        statusValue,
        brandsValue,
        designValue,
        ownerValue,
        designerValue,
        handleSetFilter,
        currentTab,
        isNav,
    };

    useEffect(() => {
        if (props.state) {
            setState(props.state);
        }
    }, [props.state]);

    if (isNav) return <DropdownContent {...dropdownProps} />;

    return (
        <Box $d="flex" $justifyContent={adminView ? 'fle    -end' : 'space-between'} $minW={['auto', '500']}>
            {search && (
                <Box hide="mobile" $mr="15" $w="100%" $maxW="440">
                    <DelayedSearchInput {...search} />
                </Box>
            )}
            <Dropdown trigger={['click']} placement="bottomLeft" dropdownRender={() => <DropdownContent {...dropdownProps} />}>
                {/* TODO: fix this height */}
                <Button $h="42" icon={<IconFilter />}>
                    Filter {filtersDone > 0 && <Badge $isNotification>{filtersDone}</Badge>}
                </Button>
            </Dropdown>
        </Box>
    );
};

export const CustomTabBar = ({ extraContent, panes, activeKey, onTabClick }) => {
    return (
        <Box $d="flex" $justifyContent="space-between" $alignItems="center">
            <CustomTabContainer>
                {panes.map(pane => (
                    <CustomTab key={pane.key} $isActive={activeKey === pane.key} onClick={() => onTabClick(pane.key)}>
                        {pane.props.tab}
                    </CustomTab>
                ))}
            </CustomTabContainer>
            {extraContent}
        </Box>
    );
};
