import React from 'react';
import { Dropdown } from 'antd';
import { Box } from '@components/Box';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import IconDownload from '@components/Svg/IconDownload';
import IconOptions from '@components/Svg/IconOptions';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { Text } from '@components/Text';
import { IconFile } from '@components/IconFile';
import { humanFileSize } from '@constants/utils';
import { MiniUpload } from '../style.js';
import IconDownloadAlt from '@components/Svg/IconDownloadAlt';

export const CardDetailUploaded = ({ name, size, url, onRename, onDelete, onDownload, isCustomer }) => {
    return (
        <MiniUpload uploaded="true" style={{ position: 'relative' }}>
            <Box $pos="absolute" $top="10" $right="10">
                {isCustomer ? (
                    <Dropdown
                        trigger={['click']}
                        overlay={
                            <DropdownMenu $mt="-8" $w="164">
                                <DropdownMenuItem key="download" onClick={onDownload}>
                                    <DropdownMenuItemContent icon={<IconDownload />}>Download</DropdownMenuItemContent>
                                </DropdownMenuItem>
                                <DropdownMenuItem key="rename" onClick={onRename}>
                                    <DropdownMenuItemContent icon={<IconEdit />}>Rename</DropdownMenuItemContent>
                                </DropdownMenuItem>
                                <DropdownMenuItem key="delete" onClick={onDelete}>
                                    <DropdownMenuItemContent icon={<IconDelete />}>Delete</DropdownMenuItemContent>
                                </DropdownMenuItem>
                            </DropdownMenu>
                        }
                    >
                        <Box $colorScheme="cta" className="ant-dropdown-link">
                            <IconOptions style={{ fontSize: 20 }} />
                        </Box>
                    </Dropdown>
                ) : (
                    <Box
                        onClick={onDownload}
                        $cursor="pointer"
                        $colorScheme="tertiary"
                        $fontSize="20"
                        $trans="0.2s all"
                        $lineH="1"
                        _hover={{ $colorScheme: 'cta' }}
                    >
                        <IconDownloadAlt />
                    </Box>
                )}
            </Box>
            <IconFile url={url} name={name} size="66" showPreviewImage />
            <Text $w="170" $pt="20" $textVariant="P4" $textAlign="center" $colorScheme="primary" $isTruncate>
                {name}
            </Text>
            <Text $textVariant="P5" $colorScheme="secondary">
                {humanFileSize(size)}
            </Text>
        </MiniUpload>
    );
};
