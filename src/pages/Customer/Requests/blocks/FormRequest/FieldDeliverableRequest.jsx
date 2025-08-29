import React, { forwardRef } from 'react';
import find from 'lodash/find';
import { Col, Row } from 'antd';
import { Box } from '@components/Box';
import { Card } from '@components/Card';
import { Text } from '@components/Text';
import IconFinish from '@components/Svg/IconFinish';
import { DELIVERABLES } from '@constants/deliverables';

const DESIGNER_CHOOSE = 'LET_MY_DESIGNER_CHOOSE';

export const FieldDeliverableRequest = forwardRef(({ value = [], onChange, onSelect, chosenProductDeliverables }, ref) => {
    const handleChange = newValue => {
        const newValues = value.includes(newValue) ? value.filter(item => item !== newValue) : [...value, newValue];
        onSelect(newValues);
        onChange(newValues);
    };

    const handleDesignerChooseChange = val => {
        if (value.indexOf(val) < 0) {
            onSelect([val]);
            onChange([val]);
        } else {
            onSelect([]);
            onChange([]);
        }
    };

    const isDesignerChoosen = value.includes(DESIGNER_CHOOSE);
    const handleClick = val => {
        return () => {
            if (!isDesignerChoosen && val !== DESIGNER_CHOOSE) {
                handleChange(val);
            }
        };
    };

    return (
        <Row style={{ rowGap: '0px' }} gutter={[20, 20]}>
            {Array.isArray(DELIVERABLES) &&
                DELIVERABLES.length > 0 &&
                DELIVERABLES.filter(d => d.value === DESIGNER_CHOOSE).map(({ id, icon: Icon, title, value: fieldValue }) => (
                    <Box as={Col} key={id} $w={['100%', '20%']}>
                        <Card
                            $h="140"
                            $px="26"
                            $alignItems="center"
                            $hoverable
                            $flexDir="column"
                            $justifyContent="center"
                            $mb="20"
                            $isActive={value.includes(fieldValue)}
                            onClick={() => handleDesignerChooseChange(fieldValue)}
                        >
                            {value.includes(fieldValue) && (
                                <Box $pos="absolute" $top="12" $right="20" $colorScheme="cta">
                                    <IconFinish />
                                </Box>
                            )}

                            <Icon />

                            <Text $textVariant="Badge" $textAlign="center" $pt="8" $colorScheme="primary">
                                {title}
                            </Text>
                        </Card>
                    </Box>
                ))}
            {chosenProductDeliverables && chosenProductDeliverables?.length > 0
                ? chosenProductDeliverables?.map(d => {
                      const deliverable = find(DELIVERABLES, ['value', d]);
                      const Icon = deliverable.icon;

                      return (
                          <Box as={Col} key={deliverable.id} $w={['100%', '20%']}>
                              <Card
                                  $h="140"
                                  $px="26"
                                  $alignItems="center"
                                  $hoverable
                                  $flexDir="column"
                                  $justifyContent="center"
                                  $mb="20"
                                  $isActive={value.includes(deliverable.value)}
                                  onClick={handleClick(deliverable.value)}
                                  isDisabled={isDesignerChoosen}
                              >
                                  {value.includes(deliverable.value) && (
                                      <Box $pos="absolute" $top="12" $right="20" $colorScheme="cta">
                                          <IconFinish />
                                      </Box>
                                  )}
                                  <Box $alignItems="center" $justifyContent="center" $d="flex" $h="56px" $w="56px">
                                      {' '}
                                      <Icon />{' '}
                                  </Box>
                                  <Text $textVariant="Badge" $textAlign="center" $pt="8" $colorScheme="primary">
                                      {deliverable.title}
                                  </Text>
                              </Card>
                          </Box>
                      );
                  })
                : ''}
            {Array.isArray(DELIVERABLES) &&
                DELIVERABLES.length > 0 &&
                DELIVERABLES.filter(d => d.value === 'OTHERS').map(({ id, icon: Icon, title, value: fieldValue }) => (
                    <Box as={Col} key={id} $w={['100%', '20%']}>
                        <Card
                            $h="140"
                            $px="26"
                            $alignItems="center"
                            $hoverable
                            $flexDir="column"
                            $justifyContent="center"
                            $mb="20"
                            $isActive={value.includes(fieldValue)}
                            onClick={handleClick(fieldValue)}
                            isDisabled={isDesignerChoosen}
                        >
                            {value.includes(fieldValue) && (
                                <Box $pos="absolute" $top="12" $right="20" $colorScheme="cta">
                                    <IconFinish />
                                </Box>
                            )}
                            <Box $alignItems="center" $justifyContent="center" $d="flex" $h="56px" $w="56px">
                                {' '}
                                <Icon />{' '}
                            </Box>
                            <Text $textVariant="Badge" $textAlign="center" $pt="8" $colorScheme="primary">
                                {title}
                            </Text>
                        </Card>
                    </Box>
                ))}
        </Row>
    );
});
