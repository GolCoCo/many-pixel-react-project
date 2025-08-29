import React from 'react';
import { Link } from '@components/Link';
import { Dropdown } from 'antd';
import IconOptions from '@components/Svg/IconOptions';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import IconDownload from '@components/Svg/IconDownload';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { CardBrandContainer } from '../style.js';
import { Image } from '@components/Image';

export const CardBrand = ({ id, name, logos, orders, onClickEdit, onClickDelete, onClickDownload, canEdit = true }) => {
    return (
        <Box
            $flex={{ xs: '1 1 0%', sm: '1 1 0%', md: '0 1 47%', lg: '0 1 307px', xl: '0 1 340px', xxl: '0 1 340px' }}
            $w={{ xs: '100%', sm: '100%', md: '47%', lg: '307', xl: '340', xxl: '340' }}
            key={name}
            $mx={['0', '10']}
            $mb="20"
        >
            <CardBrandContainer>
                <Box $d="flex" $alignItems="center" $flex="1 1 0%" as={Link} to={`/brand/${id}`}>
                    <Image src={logos ? logos[0]?.url : undefined} name={name} size={51} $fontSize={14} isRounded />
                    <Box $pl="16">
                        <Text $textVariant="Badge" $colorScheme="primary" $maxW="190" $isTruncate>
                            {name}
                        </Text>
                        <Text $textVariant="P5" $colorScheme="secondary">
                            Used in {orders?.length} request{orders?.length > 1 ? 's' : ''}
                        </Text>
                    </Box>
                </Box>
                {canEdit && (
                    <Box $ml="auto">
                        <Dropdown
                            trigger={['click']}
                            overlay={
                                <DropdownMenu $w="auto" $mt="-8">
                                    <DropdownMenuItem key="edit" onClick={onClickEdit}>
                                        <DropdownMenuItemContent icon={<IconEdit />}>Edit</DropdownMenuItemContent>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem key="delete" onClick={onClickDelete}>
                                        <DropdownMenuItemContent icon={<IconDelete />}>Delete</DropdownMenuItemContent>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem key="download" onClick={onClickDownload}>
                                        <DropdownMenuItemContent icon={<IconDownload />}>Download all brand assets</DropdownMenuItemContent>
                                    </DropdownMenuItem>
                                </DropdownMenu>
                            }
                        >
                            <Box $colorScheme="cta" className="ant-dropdown-link" $cursor="pointer" $h="20">
                                <IconOptions style={{ fontSize: 20 }} />
                            </Box>
                        </Dropdown>
                    </Box>
                )}
            </CardBrandContainer>
        </Box>
    );
};
