import React, { useState } from 'react';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Popup } from '@components/Popup';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import { Button } from '@components/Button';
import { CheckOutlined, LockOutlined } from '@ant-design/icons';
import { COLOR_CTA, COLOR_OTHERS_YELLOW } from '@components/Theme';
import canvaLogo from '@public/assets/icons/canva.png';
import figmaLogo from '@public/assets/icons/figma.png';
import multiLogo from '@public/assets/icons/multi.png';

const PLAN_SUB_HEADING = {
    Advanced: 'Create all of your everyday designs.',
    Business: 'Get double the output everyday.',
    'Designated Designer': 'Collaborate in real time with your designer.',
    'Design Team': 'Get more done with your design team.',
}

const CATEGORIES = [
    'Digital Design',
    'Print Design',
    'Web Design',
    'Brand Identity Design',
    'Illustration Design',
    'Corporate Design',
    'Motion Graphics',
    'Video Editing',
]

const ModalPlan = ({
    visible,
    onConfirm,
    onCancel,
    plans,
    frequency,
    selectedPlanName,
    windowWidth,
    title = 'Change plan',
    isUpdating = false,
    currentPlanName,
    okText = 'Update',
}) => {
    const [newPlan, setNewPlan] = useState(selectedPlanName);

    const handleChangePlan = newPlan => {
        setNewPlan(newPlan);
    };

    const handleConfirm = () => {
        onConfirm(newPlan);
    };

    let modalWidth;
    if (windowWidth > 1237) {
        modalWidth = 1300;
    } else if (windowWidth > 768 && windowWidth <= 1237) {
        modalWidth = '100%';
    } else if (windowWidth <= 768) {
        modalWidth = 353;
    }

    return (
        <Popup
            $variant="default"
            title={title}
            open={visible}
            okText={okText}
            onCancel={onCancel}
            footer={null}
            width={modalWidth}
            centered
        >
            <Box $d="flex" $mx="-10" hide="mobile">
                {plans
                    ?.filter(plan => plan.interval === frequency)
                    .map((plan, indexPlan) => {
                        let monthlyRate;
                        switch (plan.interval) {
                            case 'YEARLY':
                                monthlyRate = plan.price / 12;
                                break;
                            case 'BIANNUALLY':
                                monthlyRate = plan.price / 6;
                                break;
                            case 'QUARTERLY':
                                monthlyRate = plan.price / 3;
                                break;
                            case 'MONTHLY':
                                monthlyRate = plan.price;
                                break;
                            default:
                                break;
                        }

                        const formattedMonthlyRate = monthlyRate % 1 !== 0 ? monthlyRate.toFixed(2) : monthlyRate;

                        return (
                            <Box
                                key={plan.id}
                                $mx="10"
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor="outline-gray"
                                $py="24"
                                $pos="relative"
                                $px="16"
                                $pb="60"
                                onClick={() => handleChangePlan(plan.name)}
                                pointer="cursor"
                                $radii="10px"
                                $h={{ md: 'unset', xl: '910'}}
                                $w="304"
                                $bg={newPlan === plan.name ? 'cta' : 'white'}
                            >
                                <Text
                                    $textVariant="H5"
                                    $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                    $mb="10"
                                >
                                    {plan.name}
                                </Text>
                                <Text
                                    $textVariant="Badge"
                                    $mb="20"
                                    color="primary"
                                    $fontWeight="300"
                                    $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                >
                                    {PLAN_SUB_HEADING[plan.name]}
                                </Text>
                                <Text
                                    $textVariant="H5"
                                    $colorScheme={newPlan === plan.name ? 'white' : 'cta'}
                                    $mb="20"
                                >{`USD $${formattedMonthlyRate}/mo`}</Text>
                                <hr />
                                <Box $py="20">
                                    <Text
                                        $textVariant="H5"
                                        $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                        $mb="20"
                                    >
                                        Features
                                    </Text>
                                    {plan.features.map((feature, indexFeature) => (
                                        <Box
                                            key={feature}
                                            $d="flex"
                                            $alignItems="center"
                                            $mb={plan?.features.length - 1 === indexFeature ? '0' : '16'}
                                        >
                                            <Box $mr="10">
                                                <CheckOutlined style={{ color: newPlan === plan.name ? COLOR_OTHERS_YELLOW : COLOR_CTA }} />
                                            </Box>
                                            {(plan.tooltips && plan?.tooltips[indexFeature]) ? (
                                                <TooltipIconBlock
                                                    label={feature}
                                                    tooltip={plan?.tooltips[indexFeature]}
                                                    tooltipIconSize="16px"
                                                    $textVariant="P4"
                                                    $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                                    tooltipIconColor={newPlan === plan.name ? 'white' : 'primary'}
                                                />
                                            ) : (
                                                <Text
                                                    $textVariant="P4"
                                                    $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                                >
                                                    {feature}
                                                </Text>
                                            )}
                                        </Box>
                                    ))}
                                    <Box
                                        $d="flex"
                                        $alignItems="center"
                                        $mt="16"
                                        $opacity={['Advanced', 'Business'].includes(plan.name) ? "0.5" : "1"}
                                    >
                                        <Box $mr="10">
                                            <LockOutlined style={{ color: newPlan === plan.name ? COLOR_OTHERS_YELLOW : COLOR_CTA }} />
                                        </Box>
                                        <Text
                                            $textVariant="P4"
                                            $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                        >
                                            Real Time Slack Communication
                                        </Text>
                                    </Box>
                                </Box>
                                <Box $pt="10" $pb="20">
                                    <Text
                                        $textVariant="H5"
                                        $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                        $mb="20"
                                    >
                                        Design Services
                                    </Text>
                                    {CATEGORIES.map((category, indexCategory) => (
                                        <Box
                                            key={category}
                                            $d="flex"
                                            $alignItems="center"
                                            $mb={CATEGORIES.length - 1 === indexCategory ? '0' : '16'}
                                        >
                                            <Box $mr="10">
                                                <CheckOutlined style={{ color: newPlan === plan.name ? COLOR_OTHERS_YELLOW : COLOR_CTA }} />
                                            </Box>
                                            <Text
                                                $textVariant="P4"
                                                $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                                $opacity={plan.name === 'Advanced' && ['Motion Graphics', 'Video Editing'].includes(category) ? '0.5' : '1'}
                                            >
                                                {category}
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                                <Box $py="20">
                                    <Text
                                        $textVariant="H5"
                                        $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                        $mb="20"
                                    >
                                        Tools
                                    </Text>
                                    <Box
                                        $d="flex"
                                        $alignItems="flex-start"
                                    >
                                        <Box as="img" src={multiLogo} alt="multi" $mr="10" $w="34" $h="34"/>
                                        <Box as="img" src={figmaLogo} alt="figma" $mr="10"  $w="34" $h="34" />
                                         <Box as="img" src={canvaLogo} alt="canva"  $w="34" $h="34"/>
                                    </Box>
                                </Box>
                                <Box $pos="absolute" $bottom="0" $w="80%" $pb="20">
                                    <Button
                                        type="primary"
                                        onClick={() => handleChangePlan(plan.name)}
                                        $w="100%"
                                        noColorTransitions
                                        disabled={currentPlanName && currentPlanName === plan.name}
                                    >
                                        {currentPlanName && currentPlanName === plan.name
                                            ? 'CURRENT PLAN'
                                            : (newPlan === plan.name ? 'SELECTED' : 'SELECT PLAN')
                                        }
                                    </Button>
                                </Box>
                            </Box>
                        );
                    })}
            </Box>
            <Box hide="desktop">
                {plans
                    ?.filter(plan => plan.interval === frequency)
                    .map((plan, indexPlan) => {
                        let monthlyRate;
                        switch (plan.interval) {
                            case 'YEARLY':
                                monthlyRate = plan.price / 12;
                                break;
                            case 'BIANNUALLY':
                                monthlyRate = plan.price / 6;
                                break;
                            case 'QUARTERLY':
                                monthlyRate = plan.price / 3;
                                break;
                            case 'MONTHLY':
                                monthlyRate = plan.price;
                                break;
                            default:
                                break;
                        }

                        const formattedMonthlyRate = monthlyRate % 1 !== 0 ? monthlyRate.toFixed(2) : monthlyRate;

                        return (
                            <Box
                                key={plan.id}
                                $w="100%"
                                $radii="10"
                                $borderW="1"
                                $borderStyle="solid"
                                $borderColor="outline-gray"
                                $py="24"
                                $px="16"
                                $bg={newPlan === plan.name ? 'cta' : 'white'}
                                $mb="10"
                                onClick={() => handleChangePlan(plan.name)}
                                pointer="cursor"
                            >
                                <Text
                                    $textVariant="H5"
                                    $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                    $mb="20"
                                >
                                    {plan.name}
                                </Text>
                                <Text
                                    $textVariant="H5"
                                    $colorScheme={newPlan === plan.name ? 'white' : 'cta'}
                                    $mb="20"
                                >{`$${formattedMonthlyRate}/mo`}</Text>
                                <hr />
                                <Box $py="20">
                                    <Text
                                        $textVariant="H5"
                                        $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                        $mb="20"
                                    >
                                      Features
                                    </Text>
                                    {plan.features.map((feature, indexFeature) => (
                                        <Box
                                            key={feature}
                                            $d="flex"
                                            $alignItems="center"
                                            $mb={plan?.features.length - 1 === indexFeature ? '0' : '16'}
                                        >
                                            <Box $w="8" $h="8" $bg="other-yellow" $mr="16" />
                                            {(plan.tooltips && plan?.tooltips[feature]) ? (
                                                <>
                                                    <TooltipIconBlock
                                                        label={feature}
                                                        tooltip={plan?.tooltips[feature]}
                                                        tooltipIconSize="16px"
                                                        $textVariant="P4"
                                                        $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                                        tooltipIconColor={
                                                            newPlan === plan.name ? 'white' : 'primary'
                                                        }
                                                    />
                                                    <Text
                                                        $textVariant="P4"
                                                        $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                                        hide="desktop"
                                                    >
                                                        {feature}
                                                    </Text>
                                                </>
                                            ) : (
                                                <Text
                                                    $textVariant="P4"
                                                    $colorScheme={newPlan === plan.name ? 'white' : 'primary'}
                                                >
                                                    {feature}
                                                </Text>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                                <hr />
                                <Box $mt="24">
                                    <Button
                                        type="primary"
                                        onClick={() => handleChangePlan(plan.name)}
                                        $w="100%"
                                        noColorTransitions
                                    >
                                        {newPlan === plan.name ? 'SELECTED' : 'SELECT PLAN'}
                                    </Button>
                                </Box>
                            </Box>
                        );
                    })}
            </Box>
            <Box $d="flex" $justifyContent="flex-end" $alignItems="center" $mt="30">
                <Button type="primary" $w="140" loading={isUpdating} onClick={handleConfirm}>
                    {okText}
                </Button>
            </Box>
        </Popup>
    );
};

export default ModalPlan;
