import React, { useState } from 'react';
import { Avatar, Skeleton, Tooltip } from 'antd';
import deleteIcon from '@public/assets/icons/trash-bin.svg';
import { AvatarBlockStyle } from './style.js';
import { Text } from '@components/Text/Text.js';
import { Box } from '@components/Box/Box.js';
import { Button } from '@components/Button';

export const AvatarBlock = ({ size, styles, src, onRemove, loading }) => {
    const [visible, setVisible] = useState(false);
    const content = (
        <Box $py="10" $px="12">
            <Text $textVariant="P4" $my="10">
                Are you sure you want to remove this picture?
            </Text>
            <Box $d="flex" $justifyContent="flex-end">
                <Button type="default" $mr="10" onClick={() => setVisible(false)}>
                    NO
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        onRemove().then(() => setVisible(false));
                    }}
                >
                    YES
                </Button>
            </Box>
        </Box>
    );
    return (
        <AvatarBlockStyle styles={styles}>
            {loading ? (
                <Skeleton avatar={{ size: size }} active paragraph={false} title={false} />
            ) : (
                <>
                    <Avatar size={size} src={src} icon="user" />
                    {src
                        ? onRemove && (
                              <Tooltip color="white" open={visible} title={content} trigger="click" onClick={() => setVisible(true)} arrowPointAtCenter={false}>
                                  <a href="/" onClick={e => e.preventDefault()}>
                                      <img src={deleteIcon} alt="Trash Bin" />
                                  </a>
                              </Tooltip>
                          )
                        : null}
                </>
            )}
        </AvatarBlockStyle>
    );
};
