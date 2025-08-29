import React, { useState } from 'react';
import { Box } from '@components/Box';
import { Collapse, CollapsePanel } from '@components/Collapse';
import { FeedbackFileItem } from './FeedbackFileItem.jsx';
import { unreadCheck } from '../../utils/unreadCheck.js';
import { CardAttachment } from '@pages/Admin/Requests/blocks/DetailRequest/CardAttachment';

export const FeedbackTabFile = ({ requestName, request, folders, selectedFile, onViewFile, viewer }) => {
    const [activePanel, setActivePanel] = useState(null);
    return (
        <Box $py="16" $px="20" $h="calc(100vh - 55px)" $overflow="auto">
            <Collapse accordion expandIconPosition="right" onChange={d => setActivePanel(d)}>
                {folders.map(folder => {
                    let totalSize = 0;
                    for (let i = 0; i < folder.files.length; i++) {
                        totalSize += folder.files[i].size;
                    }

                    return (
                        <CollapsePanel
                            key={folder.id}
                            header={
                                <CardAttachment
                                    {...folder}
                                    isDefaultFolder={false}
                                    isDirectory={true}
                                    textSizeVariant="P5"
                                    imageSize="38"
                                    paddingImage="20"
                                    onClick={() => {}}
                                    requestName={requestName}
                                    orderId={request.id}
                                    requestId={request.id}
                                    hover={false}
                                    size={totalSize}
                                />
                            }
                        >
                            {folder?.files?.length > 0 && (
                                <Box $px="16" $pt="16">
                                    {folder?.files?.map(childFile => (
                                        <FeedbackFileItem
                                            key={childFile.id}
                                            fileId={childFile.id}
                                            name={childFile.name}
                                            size={childFile.size}
                                            url={childFile.url}
                                            updatedAt={childFile.updatedAt}
                                            isViewed={selectedFile?.id === childFile.id}
                                            onViewFile={onViewFile}
                                            totalComment={childFile.feedback.length ?? 0}
                                            hasUnread={
                                                childFile.feedback.findIndex(feed => {
                                                    const unreadDetailsComments = feed.comments?.filter(comment => unreadCheck(comment, viewer));
                                                    const unreadCommentCount = unreadDetailsComments?.length ?? 0;
                                                    const unreadFeedbackCount = unreadCheck(feed, viewer) ? 1 : 0;
                                                    return unreadCommentCount + unreadFeedbackCount > 0;
                                                }) > -1
                                            }
                                        />
                                    ))}
                                </Box>
                            )}
                        </CollapsePanel>
                    );
                })}
            </Collapse>
        </Box>
    );
};
