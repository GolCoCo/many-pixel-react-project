import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { useQuery } from '@apollo/client';
import { Box } from '@components/Box';
import { Card } from '@components/Card';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { ALL_PLANS_TO_SUB } from '@graphql/queries/plan';
import { LoadingWithLogo } from '@components/LoadingWithLogo';
import WithLoggedUser from '@components/WithLoggedUser';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';

const featureTooltips = {
    'Native Source Files': 'We work with Photoshop, Illustrator, InDesign, Sketch and Figma. You will have full legal ownership of the files.',
    '1 Daily Output': '1 designer is assigned to your account and will work on your projects every business day.',
    'Custom Illustrations': 'A professional illustrator will be assigned to your projects that require hand-drawing.',
    'Web Design': (
        <>
            A professional UI designer will be assigned to your web and UI projects. We do{' '}
            <Box $d="inline" $fontWeight="700">
                not
            </Box>{' '}
            provide UX and coding.
        </>
    ),
    'Logos & Branding': 'An experienced brand designer will be assigned to your brand identity projects.',
    '2 Daily Outputs': '2 designers are assigned to your account and will work on your projects every business day.',
};

export const UpgradePlan = WithLoggedUser(({ onClose, viewer }) => {
    const { loading, data: dataPlans } = useQuery(ALL_PLANS_TO_SUB);
    // TODO:
    // fetch current plan from backend
    const [activePlan, setActivePlan] = useState('Essentials');

    const handleUpgrade = () => {
        onClose();
    };

    return (
        <>
            <Text $textVariant="H5" $mb="30">
                Upgrade plan
            </Text>
            <Row gutter={20}>
                {loading && <LoadingWithLogo $w="100%" $h="449" />}
                {dataPlans?.allPlans
                    .filter(plan => plan.interval === 'MONTHLY')
                    .map((plan, indexPlan) => (
                        <Col lg={8} key={plan.id}>
                            <Card $py="24" $px="16" $flexDir="column" $alignItems="flex-start" $bg={activePlan === plan.name ? 'cta' : 'white'} $mb="20">
                                <Text $textVariant="H5" $mb="20" $colorScheme={activePlan === plan.name ? 'white' : 'primary'}>
                                    {plan.name}
                                </Text>
                                <Text $textVariant="H5" $mb="20" $colorScheme={activePlan === plan.name ? 'white' : 'cta'}>
                                    ${plan.price}/mo
                                </Text>
                                <Box $borderTop="1px solid" $borderBottom="1px solid" $borderColor="outline-gray" $w="100%" $pt="20" $minH="243">
                                    {indexPlan > 0 && (
                                        <Text $textVariant="Button" $mb="11" $colorScheme={activePlan === plan.name ? 'white' : 'primary'}>
                                            {plan.features[0]}
                                        </Text>
                                    )}
                                    {plan?.features?.map((feature, indexFeature) => {
                                        return indexFeature === 0 && indexPlan > 0 ? null : (
                                            <Box key={`${plan.id}-${feature}`} $d="flex" $alignItems="center" $mb="16">
                                                <Box $w="8" $h="8" $bg="other-yellow" />
                                                <Box $pl="16">
                                                    <TooltipIconBlock
                                                        label={feature}
                                                        $textVariant="P4"
                                                        tooltip={featureTooltips[feature] ?? undefined}
                                                        $colorScheme={activePlan === plan.name ? 'white' : 'primary'}
                                                        tooltipIconColor={activePlan === plan.name ? 'white' : 'primary'}
                                                    />
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>
                                <Button type="primary" block $mt="24" noColorTransitions onClick={() => setActivePlan(plan.name)}>
                                    {activePlan === plan.name ? 'Selected' : 'Select Plan'}
                                </Button>
                            </Card>
                        </Col>
                    ))}
            </Row>
            <Box $textAlign="right" $mt="10" onClick={handleUpgrade}>
                <Button type="primary">Upgrade Plan</Button>
            </Box>
        </>
    );
});
