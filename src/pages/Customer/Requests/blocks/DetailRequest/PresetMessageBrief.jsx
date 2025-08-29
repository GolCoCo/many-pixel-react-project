import React from 'react';
import { Box } from '@components/Box';
import ArrowRightIcon from '@components/Svg/ArrowRight';
import IconEdit from '@components/Svg/IconEdit';
import { CardAttachment } from './CardAttachment.jsx';
import { useDetailContext } from './DetailContext.js';

export const PresetMessageBrief = ({ renderer }) => {
    const { setActiveTab, request } = useDetailContext();

    const handleClick = () => {
        setActiveTab('brief');
    };

    return (
        <Box $mx="-7px" $d="flex" $flexWrap="wrap" $flexDir="row">
            <Box $px="7px" $maxW={['100%', '33%']} $w="100%" $pt="10">
                <CardAttachment
                    name="Request brief"
                    content={renderer?.serviceName ?? undefined}
                    downloadIcon={<ArrowRightIcon />}
                    imageIcon={
                        <Box $fontSize="22" $lineH="1" $colorScheme="primary" _hover={{ $colorScheme: 'cta' }}>
                            <IconEdit />
                        </Box>
                    }
                    pl="16"
                    py="11"
                    pr="16"
                    onClick={handleClick}
                    h="60"
                    requestId={request.id}
                />
            </Box>
        </Box>
    );
};
