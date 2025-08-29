import React from 'react';
import { withResponsive } from '@components/ResponsiveProvider';
import IconFinish from '@components/Svg/IconFinish';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';

const texts = [
    'Clear description of what you want',
    'How/where design will be used',
    '3-4 concepts that you like',
    'What you like from the concepts provided',
    'Dimensions',
    'Color preferences',
    'Design copywriting',
    'Number of design',
];

const SideNoteForm = ({ windowWidth, loading = false }) => {
    if (windowWidth < 1279) {
        return null;
    }

    const noteWidth = windowWidth < 1367 ? '200' : '220';

    return (
        <Box $pos="fixed" hide="mobile" $top="50%" $left="0" $transform="translateY(-50%)" $userSelect="none">
            {loading ? (
                <Skeleton $w="220" $h="293" />
            ) : (
                <Box $py="20" $px="16" $bg="cta" $colorScheme="white" $w={noteWidth} $radii="10">
                    <Text $textVariant="H6" $mb="13">
                        WHAT TO INCLUDE
                    </Text>
                    <Box>
                        {texts.map(text => (
                            <Box key={text} $d="flex" $mb="8">
                                <Box $h="14" $pt="3">
                                    <Box $d="flex" $h="14" $w="14" $radii="4" $bg="other-yellow" $fontSize="10" $alignItems="center" $justifyContent="center">
                                        <IconFinish />
                                    </Box>
                                </Box>
                                <Text $textVariant="P4" $pl="10">
                                    {text}
                                </Text>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default withResponsive(SideNoteForm);
