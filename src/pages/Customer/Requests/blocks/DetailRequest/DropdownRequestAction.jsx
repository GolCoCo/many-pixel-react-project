import React from 'react';
import { Dropdown } from 'antd';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { Button } from '@components/Button';
import IconMarkComplete from '@components/Svg/IconMarkComplete';
import IconOptions from '@components/Svg/IconOptions';
import IconPause from '@components/Svg/IconPause';
import IconSubmit from '@components/Svg/IconSubmit';
import IconPlay from '@components/Svg/IconPlay';
import { useDetailContext } from './DetailContext.js';
import { useRequestActions } from './useRequestActions.jsx';
import { ORDER_STATUS_ON_HOLD } from '@constants/order';

export const DropdownRequestAction = () => {
    const { request, isSubscriptionPaused } = useDetailContext();
    const {
        getPopupComplete,
        getPopupReopen,
        getPopupResume,
        showHandlerComplete,
        showHandlerPauseOrResume,
        showHandlerReopen,
        showHandlerSubmit,
        handleClickComplete,
        handleClickPauseOrResume,
        handleClickReopen,
        handleClickSubmit,
        handleResumeSubscription,
    } = useRequestActions();

    return (
        <>
            <Dropdown
                trigger={['click']}
                overlay={
                    <DropdownMenu $w="192">
                        {isSubscriptionPaused && (
                            <DropdownMenuItem key="subscription-paused" onClick={handleResumeSubscription}>
                                <DropdownMenuItemContent>Resume subscription</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {!isSubscriptionPaused && showHandlerPauseOrResume && (
                            <DropdownMenuItem key="pauseorresume" onClick={handleClickPauseOrResume}>
                                <DropdownMenuItemContent icon={request.status !== ORDER_STATUS_ON_HOLD ? <IconPause /> : <IconPlay />}>
                                    {request.status !== ORDER_STATUS_ON_HOLD ? 'Pause request' : 'Resume request'}
                                </DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {!isSubscriptionPaused && showHandlerComplete && (
                            <DropdownMenuItem key="complete" onClick={handleClickComplete}>
                                <DropdownMenuItemContent icon={<IconMarkComplete />}>Mark as complete</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {!isSubscriptionPaused && showHandlerReopen && (
                            <DropdownMenuItem key="reopen" onClick={handleClickReopen}>
                                <DropdownMenuItemContent>Reopen request</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                        {!isSubscriptionPaused && showHandlerSubmit && (
                            <DropdownMenuItem key="submit" onClick={handleClickSubmit}>
                                <DropdownMenuItemContent icon={<IconSubmit />}>Submit Request</DropdownMenuItemContent>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenu>
                }
            >
                <Button hasDropDown type="default" icon={<IconOptions style={{ fontSize: 20 }} />} $w={['34', '40']} $h={['34', '40']} $mt="2" mobileH="34" />
            </Dropdown>
            {getPopupComplete()}
            {getPopupReopen()}
            {getPopupResume()}
        </>
    );
};
