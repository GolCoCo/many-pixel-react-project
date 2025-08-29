import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Popup } from '@components/Popup';
import { Button } from '@components/Button';
import { REQUESTS } from '@constants/routes';
import CloseIcon from '@components/Svg/Close';
import { ORDER_STATUS_DRAFT } from '@constants/order';

const getContentTexts = (isEdit, isFilled) => {
    if (isEdit || (!isEdit && !isFilled)) {
        return {
            title: 'Are you sure you want to quit?',
            content: 'All changes on this request will be cancelled.',
            okText: 'Quit',
            cancelText: 'Cancel',
        };
    }
    return {
        title: 'Discard Request?',
        content: 'Would you like to save your request as a draft instead? You can continue editing the request later and submit it whenever you are ready.',
        okText: 'Save As Draft',
        cancelText: 'Discard',
    };
};

export const PopupCancelRequest = ({ isFilled, isEdit, form, handleSubmit, handleSetIsFilled }) => {
    const [isShow, setIsShow] = useState(false);
    const history = useHistory();

    const timeout = useRef(null);
    const content = getContentTexts(isEdit, isFilled);

    useEffect(() => {
        return () => {
            if (timeout.current !== null) {
                window.clearTimeout(timeout.current);
            }
        };
    }, []);

    const handleOkay = () => {
        if (isEdit || (!isEdit && !isFilled)) {
            handleSetIsFilled(false);
            setIsShow(false);

            if (timeout.current !== null) {
                window.clearTimeout(timeout.current);
            }
            timeout.current = setTimeout(() => {
                history.replace(REQUESTS);
            }, 100);
        } else {
            form.setFieldsValue({
                type: ORDER_STATUS_DRAFT,
            });
            handleSubmit();
        }
    };

    const handleCancel = () => {
        if (isEdit || (!isEdit && !isFilled)) {
            setIsShow(false);
        } else {
            handleSetIsFilled(false);
            setIsShow(false);

            if (timeout.current !== null) {
                window.clearTimeout(timeout.current);
            }
            timeout.current = setTimeout(() => {
                history.replace(REQUESTS);
            }, 100);
        }
    };

    return (
        <>
            <Box hide="mobile">
                <Button type="ghost" $px="0" htmlType="button" onClick={() => setIsShow(true)}>
                    Cancel
                </Button>
            </Box>
            <Box hide="desktop">
                <Button type="default" htmlType="button" icon={<CloseIcon />} onClick={() => setIsShow(true)} />
            </Box>
            <Popup
                open={isShow}
                title={content.title}
                $variant="delete"
                title$colorScheme="primary"
                centered
                onCancel={() => setIsShow(false)}
                footer={null}
                width={436}
            >
                <Text $textVariant="P4" $mb="30" $px="0">
                    {content.content}
                </Text>
                <Box $d="flex" $justifyContent="flex-end">
                    <Button $w="100%" type="default" onClick={handleCancel} $mr="14">
                        {content.cancelText}
                    </Button>
                    <Button $w="100%" type="primary" onClick={handleOkay}>
                        {content.okText}
                    </Button>
                </Box>
            </Popup>
        </>
    );
};
