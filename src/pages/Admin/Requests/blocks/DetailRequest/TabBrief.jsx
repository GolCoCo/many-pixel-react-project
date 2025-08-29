import React, { useState } from 'react';
import Icon, { LoadingOutlined } from '@ant-design/icons';
import { Box } from '@components/Box';
import { Button } from '@components/Button';
import { Text } from '@components/Text';
import { WysiwygRenderer } from '@components/Wysiwyg';
import IconDownloadAlt from '@components/Svg/IconDownloadAlt';
import downloadFilesAsZip from '@utils/downloadFilesAsZip';
import startCase from 'lodash/startCase';
import { useDetailContext } from './DetailContext.js';
import { CardAttachment } from './CardAttachment.jsx';
import { Briefs } from './Briefs.jsx';

export const TabBrief = () => {
    const { request } = useDetailContext();
    const [isDownloadingFiles, setIsDownloadingFiles] = useState(false);
    const brief = request.brief.filter(b => b.answerType !== 'UPLOAD_FILES' && b.answerType !== 'IMG_SELECT');
    const handleZippingFiles = prcnt => {
        if (Math.ceil(prcnt) >= 100) {
            setIsDownloadingFiles(false);
        }
    };

    const handleDownloadZip = () => {
        setIsDownloadingFiles(true);
        const folderName = `${request.name}-attachments`;
        downloadFilesAsZip(request.briefAttachments, folderName, handleZippingFiles);
    };

    const displayDescription = () => {
        if (request?.description) {
            const nonHTMLmsg = request?.description.replace(/(<([^>]+)>)/gi, '');
            if (nonHTMLmsg && nonHTMLmsg.trim()) {
                return request?.description;
            }
        }
    };

    return (
        <Box $px="20" $py="16">
            {brief.length > 0 && (
                <>
                    <Text $textVariant="P4" $colorScheme="secondary" $mb="8">
                        Questions
                    </Text>
                    <Briefs brief={brief} />
                </>
            )}
            {request?.description && (
                <>
                    <Text $textVariant="P4" $colorScheme="secondary" $mb="8">
                        Description
                    </Text>
                    <Box $mb="8">
                        <WysiwygRenderer content={displayDescription()} />
                    </Box>

                    <Text $textVariant="P4" $colorScheme="secondary" $mb="8">
                        Attachments
                    </Text>
                    <Box $d="flex" $flexWrap="wrap" $mx="-10" $mb="0">
                        {request?.briefAttachments?.map(attachment => (
                            <Box
                                $mb="20"
                                key={attachment.id}
                                $mx="10"
                                $w={{ xs: '100%', sm: '100%', md: '45%', lg: '237', xl: '270', xxl: '270' }}
                                $flex={{
                                    xs: '1 1 0%',
                                    sm: '1 1 0%',
                                    md: '0 1 45%',
                                    lg: '0 1 237px',
                                    xl: '0 1 270px',
                                    xxl: '0 1 270px',
                                }}
                            >
                                <CardAttachment
                                    {...attachment}
                                    canDownload
                                    downloadIcon={<IconDownloadAlt />}
                                    py="14"
                                    pl="16"
                                    pr="16"
                                    h="60"
                                    downloadIconSize="20"
                                    requestName={request.name}
                                    requestId={request.id}
                                    isBrief={true}
                                />
                            </Box>
                        ))}
                    </Box>
                </>
            )}
            {request.briefAttachments?.length < 1 && (
                <Text $textVariant="P4" $colorScheme="primary" $mb="8">
                    N/A
                </Text>
            )}
            {request.briefAttachments?.length > 0 && (
                <Button
                    type="ghost"
                    icon={isDownloadingFiles ? <Icon component={LoadingOutlined} /> : <IconDownloadAlt />}
                    $textTransform="none"
                    $colorScheme="cta"
                    $px="0"
                    $h="16"
                    $mb="25"
                    onClick={handleDownloadZip}
                >
                    Download all files as .zip
                </Button>
            )}
            <Text $textVariant="P4" $colorScheme="secondary" $mb="8">
                File deliverables
            </Text>
            {request.deliverables?.length > 0 && (
                <Text as="ul" $pl="20" $textVariant="P4" $colorScheme="primary" $mb="0">
                    {request.deliverables?.map(deliverable => {
                        if (deliverable === 'OTHERS') {
                            return (
                                <li key={deliverable}>
                                    {deliverable} {request.otherDeliverables ? `(${request.otherDeliverables})` : ''}
                                </li>
                            );
                        }
                        return <li key={deliverable}>{startCase(deliverable)}</li>;
                    })}
                </Text>
            )}
        </Box>
    );
};
