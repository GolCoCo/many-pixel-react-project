import React from 'react';
import { Box } from '@components/Box';
import { Collapse, CollapsePanel } from '@components/Collapse';
import { FeedbackFileFolder } from './FeedbackFileFolder.jsx';
import { FeedbackFileItem } from './FeedbackFileItem.jsx';
import { unreadCheck } from '../../utils/unreadCheck.js';

export const FeedbackTabFile = ({ requestName, folders, selectedFile, onViewFile, viewer }) => {
    return (
        <Box $py="16" $px="20" $h="calc(100vh - 55px)" $overflow="auto">
            <Collapse accordion expandIconPosition="right">
                {folders.map(folder => {
                    let totalSize = 0;
                    for (let i = 0; i < folder.files.length; i++) {
                        totalSize += folder.files[i].size;
                    }

                    return (
                        <CollapsePanel
                            key={folder.id}
                            header={
                                <FeedbackFileFolder
                                    requestName={requestName}
                                    name={folder.name}
                                    size={totalSize}
                                    files={folder.files}
                                    updatedAt={folder.updatedAt}
                                />
                            }
                        >
                            <Box $px="16" $pt="16">
                                {folder?.files?.map(childFile => (
                                    <FeedbackFileItem
                                        key={childFile.id}
                                        fileId={childFile.id}
                                        name={childFile.name}
                                        size={parseInt(childFile.size)}
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
                        </CollapsePanel>
                    );
                })}
            </Collapse>
        </Box>
    );
};
