import React, { useState, useCallback, useMemo } from 'react';
import withLoggedUser from '@components/WithLoggedUser/WithLoggedUser';
import { USER_TYPE_CUSTOMER, USER_TYPE_WORKER } from '@constants/account';
import { SNIPPETS } from '@graphql/queries/snippet';
import { DelayedSearchInput } from '@pages/Customer/Requests/blocks/DelayedSearchInput';
import { Popover } from 'antd';
import { useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { convertFromHTML } from 'draft-js';
import ArrowDownIcon from '@components/Svg/ArrowDown';
import CloseIcon from '@components/Svg/Close';

const getSnippetText = text => {
    const blocks = convertFromHTML(text).contentBlocks;
    return blocks.map(block => block.text).join('');
};

const Snippets = ({ viewer, handleAddSnippet }) => {
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);

    const hide = () => {
        setClicked(false);
        setHovered(false);
    };
    const handleClickChange = open => {
        setHovered(false);
        setClicked(open);
    };
    const [filter, setFilter] = useState('');
    const variables = useMemo(() => {
        const vars = {
            where: {
                name: {
                    contains: filter,
                    mode: 'Insensitive',
                },
            },
        };
        return vars;
    }, [filter]);

    const { data, loading } = useQuery(SNIPPETS, {
        variables,
    });

    const handleSearch = value => {
        setFilter(value);
    };

    const dataRenderer = useCallback(() => {
        if (data?.allSnippets?.length === 0) {
            return (
                <Box $fontSize="14" $textAlign="center" $pt="10" $pb="15">
                    <Text>Snippet not found</Text>
                </Box>
            );
        }
        const snippets = data?.allSnippets;
        return (
            <Box $mb="10" $w="100%" $maxH="250" $overflowY="scroll" className="scrollbar">
                {snippets.map(snippet => (
                    <Box
                        _hover={{ $bg: 'badge-blue' }}
                        $h="66"
                        $px="16"
                        $py="12"
                        key={snippet.id}
                        $cursor="pointer"
                        onClick={() => {
                            handleAddSnippet(snippet);
                            hide();
                        }}
                    >
                        {snippet?.text && (
                            <>
                                <Text fontFamily="Geomanist" $fontSize="14" $fontWeight="300">
                                    {snippet.name}
                                </Text>
                                <Text
                                    $textVariant="P5"
                                    $colorScheme="secondary"
                                    $pr="4"
                                    $whiteSpace="nowrap"
                                    $fontSize={['12']}
                                    $textOverflow="ellipsis"
                                    $overflow="hidden"
                                    $d="block"
                                    $h="18"
                                >
                                    {getSnippetText(snippet.text)}
                                </Text>
                            </>
                        )}
                    </Box>
                ))}
            </Box>
        );
    }, [data, handleAddSnippet]);

    const content = (
        <Box $w="400">
            <Box $p="16">
                <DelayedSearchInput onChange={handleSearch} />
            </Box>
            {loading ? (
                <Box $fontSize="14" $textAlign="center" $pt="10" $pb="15">
                    <Text> Searching... </Text>
                </Box>
            ) : (
                dataRenderer()
            )}
        </Box>
    );

    const title = (
        <Box $d="flex" $flexDir="row" $justifyContent="space-between" $alignItems="center">
            <Text>Snippets</Text>
            <CloseIcon onClick={hide} />
        </Box>
    );

    if (viewer.role === USER_TYPE_CUSTOMER || viewer.role === USER_TYPE_WORKER) {
        return null;
    }

    return (
        <Popover title={title} content={content} trigger="click" open={clicked} onOpenChange={handleClickChange}>
            <Box $flexDir="row" $d="flex" style={{ cursor: 'pointer' }}>
                <Text $mr="4">Snippets</Text>
                <ArrowDownIcon />
            </Box>
        </Popover>
    );
};

export default withLoggedUser(Snippets);
