import React, { useState } from 'react';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Box } from '@components/Box';
import { IconFile } from '@components/IconFile';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import IconDownloadAlt from '@components/Svg/IconDownloadAlt';
import { humanFileSize } from '@constants/utils';
import message from '@components/Message';
import downloadFilesAsZip from '@utils/downloadFilesAsZip';

export const FeedbackFileFolder = ({ name, size, files, requestName, updatedAt }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleZippingFiles = prcnt => {
        if (Math.ceil(prcnt) >= 100) {
            setIsDownloading(false);
        }
    };

    const handleDownloadClick = async ev => {
        ev.preventDefault();
        ev.stopPropagation();

        if (files.length) {
            setIsDownloading(true);
            const folderName = `${requestName}-${name}`;
            downloadFilesAsZip(files, folderName, handleZippingFiles);
        } else {
            message.destroy();
            message.error('Folder is empty');
        }
    };

    return (
        <Box $d="flex">
            <Box $pr="20" $alignSelf="center">
                <IconFile name={name} isDirectory size="38" />
            </Box>
            <Box>
                <Text $textVariant="Badges" $colorScheme="primary">
                    {name}
                </Text>
                <Box $d="flex" $alignItems="center" $textVariant="P5" $colorScheme="secondary" $mb="2">
                    <Text>{humanFileSize(size)}</Text>
                    <Box $w="1" $h="12" $mx="6" $bg="outline-gray" />
                    <Text>{moment(updatedAt).format('D MMM YYYY')}</Text>
                </Box>
                <Button
                    type="ghost"
                    $textTransform="none"
                    $colorScheme="cta"
                    $px="0"
                    $fontSize="12"
                    $h={['16', '16']}
                    icon={
                        <Box $lineH="1" $fontSize="14">
                            {isDownloading ? <Icon component={LoadingOutlined} style={{ fontSize: 14, color: '#0099F6' }} /> : <IconDownloadAlt />}
                        </Box>
                    }
                    onClick={handleDownloadClick}
                >
                    Download
                </Button>
            </Box>
        </Box>
    );
};
