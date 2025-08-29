import React, { memo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link as RouterLink } from 'react-router-dom';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import numeral from 'numeral';
import { SETTINGS, EDIT_PLAN_SETTING, ADMIN_PLAN_SETTING, STRIPE_PLAN_PROFILE } from '@constants/routes';
import DocumentTitle from '@components/DocumentTitle';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Button } from '@components/Button';
import { Link } from '@components/Link';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import { Skeleton } from '@components/Skeleton';
import { TooltipIconBlock } from '@components/LabelWithTooltipBlock';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import IconEdit from '@components/Svg/IconEdit';
import { PLAN } from '@graphql/queries/plan';
import stripeLogo from '@public/assets/icons/stripe-logo.png';

const PlanDetails = memo(({ match }) => {
    const { params } = match;
    const { loading, data } = useQuery(PLAN, {
        variables: {
            id: params?.id,
        },
        fetchPolicy: 'network-only',
    });

    const plan = {
        ...data?.Plan,
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateObj = !loading ? new Date(plan?.createdAt) : null;
    const day = dateObj ? String(dateObj.getDate()).padStart(2, '0') : null;
    const month = dateObj ? monthNames[dateObj.getMonth()] : null;
    const year = dateObj ? dateObj.getFullYear() : null;

    return (
        <DocumentTitle title={`${!loading ? `${plan?.name} | ` : ''}ManyPixels`}>
            <Basepage>
                <PageContainer $maxW="1288">
                    <Box $d="flex">
                        <Box $pt="4" $mr="20">
                            <Button
                                $w="36"
                                $h="36"
                                mobileH="36"
                                type="default"
                                className="ant-btn ant-btn-default"
                                as={Link}
                                to={SETTINGS}
                                icon={<ArrowLeftIcon style={{ fontSize: 20 }} />}
                            />
                        </Box>
                        <Box $flex="1">
                            <Box $d="flex" $justifyContent="space-between" $mb="29">
                                <Box>
                                    {loading ? (
                                        <Skeleton $w="150" $h="44" $mb="12" />
                                    ) : (
                                        <Box $d="flex" $alignItems="center" $mb="12">
                                            <Text $textVariant="H3" $colorScheme="Headline" $mr="4">
                                                {plan.name}
                                            </Text>
                                            <Box as="a" href={STRIPE_PLAN_PROFILE.replace(':planId', plan.stripeId)} target="_blank" rel="noopener noreferrer">
                                                <Box as="img" src={stripeLogo} alt="Stripe" />
                                            </Box>
                                        </Box>
                                    )}
                                    <Breadcrumb>
                                        <BreadcrumbItem isFirst as={Link} to={SETTINGS}>
                                            Settings
                                        </BreadcrumbItem>
                                        <BreadcrumbItem as={Link} to={ADMIN_PLAN_SETTING}>
                                            Plans
                                        </BreadcrumbItem>
                                        <BreadcrumbItem>Details</BreadcrumbItem>
                                    </Breadcrumb>
                                </Box>
                                {loading ? (
                                    <Skeleton $w="100" $h="40" />
                                ) : (
                                    <RouterLink to={EDIT_PLAN_SETTING.replace(':id', params?.id)}>
                                        <Button type="default" icon={<IconEdit style={{ fontSize: 18 }} />}>
                                            EDIT
                                        </Button>
                                    </RouterLink>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Plan type
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {capitalize(startCase(plan?.type))}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Created on
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {day} {month} {year}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Daily output
                                </Text>
                                {loading ? (
                                    <Skeleton $w="87" $h="22" />
                                ) : (
                                    <Text $textVariant="P3" $colorScheme="primary">
                                        {plan?.dailyOutput ? `${plan?.dailyOutput} daily output` : 'None'}
                                        {plan?.dailyOutput > 1 ? 's' : ''}
                                    </Text>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Details
                                </Text>
                                {loading ? (
                                    <>
                                        <Skeleton $w="367" $h="22" $mb="10" />
                                        <Skeleton $w="109" $h="22" />
                                    </>
                                ) : (
                                    <>
                                        <Text $textVariant="P3" $colorScheme="primary">
                                            The plan is{' '}
                                            <Text $d="inline-block" $textVariant="PrimaryButton" $colorScheme="primary">
                                                {plan?.activated ? 'activated' : 'deactivated'}
                                            </Text>{' '}
                                            and{' '}
                                            <Text $d="inline-block" $textVariant="PrimaryButton" $colorScheme="primary">
                                                {plan?.visible ? 'visible' : 'not visible'}
                                            </Text>{' '}
                                            by the customers.
                                        </Text>
                                        <Text $textVariant="P3" $colorScheme="primary">
                                            <Text $d="inline-block" $textVariant="PrimaryButton" $colorScheme="primary">
                                                {numeral(plan?.price).format('$0,0[.]00')}
                                            </Text>
                                            /{plan?.interval}
                                        </Text>
                                    </>
                                )}
                            </Box>
                            <Box $mb="20">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Associated products
                                </Text>
                                {loading ? (
                                    <Box $d="flex">
                                        <Skeleton $w="164" $h="34" $mr="8" />
                                        <Skeleton $w="133" $h="34" $mr="8" />
                                        <Skeleton $w="142" $h="34" $mr="8" />
                                        <Skeleton $w="95" $h="34" />
                                    </Box>
                                ) : (
                                    <Box $d="flex" $alignItems="center" $flexWrap="wrap" $mx="-8">
                                        {plan?.services?.length > 0 &&
                                            plan?.services?.map(service => (
                                                <Text
                                                    key={service.id}
                                                    $bg="rgba(0, 153, 246, 0.1)"
                                                    $textVariant="P2"
                                                    $colorScheme="cta"
                                                    $px="16"
                                                    $py="4"
                                                    $mx="4"
                                                    $mb="10"
                                                    $radii="10"
                                                >
                                                    {service.name}
                                                </Text>
                                            ))}
                                    </Box>
                                )}
                            </Box>
                            <Box $mb="30">
                                <Text $textVariant="H5" $colorScheme="primary" $mb="10">
                                    Features
                                </Text>
                                {loading ? (
                                    <>
                                        <Skeleton $w="231" $h="22" $mb="10" />
                                        <Skeleton $w="200" $h="22" $mb="10" />
                                        <Skeleton $w="170" $h="22" $mb="10" />
                                        <Skeleton $w="170" $h="22" $mb="10" />
                                        <Skeleton $w="190" $h="22" $mb="10" />
                                        <Skeleton $w="210" $h="22" />
                                    </>
                                ) : (
                                    <>
                                        <Text $textVariant="PrimaryButton" $colorScheme="primary">
                                            {plan?.featuresTitle}
                                        </Text>
                                        {plan?.features?.length > 0 &&
                                            plan?.tooltips &&
                                            plan?.features?.map((feature, index) =>
                                                plan?.tooltips[index] ? (
                                                    <Box key={feature}>
                                                        <TooltipIconBlock
                                                            label={feature}
                                                            tooltip={plan?.tooltips[index]}
                                                            $textVariant="P3"
                                                            $colorScheme="primary"
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Text key={feature} $textVariant="P3" $colorScheme="primary">
                                                        {feature}
                                                    </Text>
                                                )
                                            )}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default PlanDetails;
