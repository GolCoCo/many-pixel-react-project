import { Box } from '@components/Box';
import { Button } from '@components/Button';
import React, { useState, useEffect, useCallback } from 'react';
import { Prompt as RRPrompt, useLocation, useHistory } from 'react-router-dom';
import { Popup } from '../Popup';
import { Text } from '../Text';

const defaultAfterOkay = (handleConfirmCallback, closeModalCallback) => {
    handleConfirmCallback();
};

const defaultAfterCancel = (handleConfirmCallback, closeModalCallback) => {
    closeModalCallback();
};

const defaultAfterClose = (handleConfirmCallback, closeModalCallback) => {
    closeModalCallback();
};

export const Prompt = ({
    title,
    content,
    isBlocked,
    onOkay,
    onCancel,
    okayButtonProps,
    cancelButtonProps,
    okayText,
    cancelText,
    onClose,
    afterOkay = defaultAfterOkay,
    afterCancel = defaultAfterCancel,
    afterClose = defaultAfterClose,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const location = useLocation();
    const history = useHistory();
    const [lastLocation, setLastLocation] = useState(location);
    const [shouldUnload, setShouldUnload] = useState(false);
    const [confirmedNavigation, setConfirmedNavigation] = useState(false);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setShouldUnload(false);
    }, []);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const showModal = useCallback(
        nextLocation => {
            openModal();
            setLastLocation(nextLocation);
        },
        [openModal]
    );

    const handleBlockedRoute = useCallback(
        nextLocation => {
            if (!confirmedNavigation && isBlocked) {
                showModal(nextLocation);
                return false;
            }

            return true;
        },
        [isBlocked, confirmedNavigation, showModal]
    );

    const handleConfirmNavigationClick = useCallback(() => {
        closeModal();
        setConfirmedNavigation(true);
    }, [closeModal]);

    // Block react routes
    useEffect(() => {
        if (confirmedNavigation && lastLocation) {
            // Navigate to the previous blocked location with your navigate function
            setShouldUnload(true);
            history.push(lastLocation.pathname);
        }
    }, [confirmedNavigation, lastLocation, history]);

    // Block non-react routes
    useEffect(() => {
        const unload = event => {
            if (isBlocked && !shouldUnload) {
                // eslint-disable-next-line no-param-reassign
                event.returnValue = content;
            }
            if (shouldUnload) {
                // eslint-disable-next-line no-param-reassign
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', unload);

        return () => window.removeEventListener('beforeunload', unload);
    }, [isBlocked, content, shouldUnload]);

    const handleOkay = async () => {
        if (onOkay) {
            await onOkay();
        }
        afterOkay(handleConfirmNavigationClick, closeModal);
    };

    const handleCancel = async () => {
        if (onCancel) {
            await onCancel();
        }
        afterCancel(handleConfirmNavigationClick, closeModal);
    };

    const handleClose = async () => {
        if (onClose) {
            await onClose();
        }
        afterClose(handleConfirmNavigationClick, closeModal);
    };

    return (
        <>
            <RRPrompt when message={handleBlockedRoute} />
            <Popup width={436} open={isModalOpen} title={title} $variant="delete" title$colorScheme="primary" centered footer={null} onCancel={handleClose}>
                <Text $textVariant="P4" $mb="30" $px="34">
                    {content}
                </Text>
                <Box $d="flex" $justifyContent="flex-end">
                    <Button type="default" $mr="14" {...cancelButtonProps} onClick={handleCancel}>
                        {cancelText}
                    </Button>
                    <Button type="primary" {...okayButtonProps} onClick={handleOkay}>
                        {okayText}
                    </Button>
                </Box>
            </Popup>
        </>
    );
};
