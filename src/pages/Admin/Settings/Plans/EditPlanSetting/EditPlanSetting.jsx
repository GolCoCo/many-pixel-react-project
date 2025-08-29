import React, { memo, useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { SETTINGS, ADMIN_PLAN_SETTING } from '@constants/routes';
import DocumentTitle from '@components/DocumentTitle';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import { Button } from '@components/Button';
import { Link } from '@components/Link';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Skeleton } from '@components/Skeleton';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { PLAN } from '@graphql/queries/plan';
import { UPDATE_PLAN } from '@graphql/mutations/plan';
import message from '@components/Message';
import PlanForm from '../blocks/PlanForm';

const EditPlanSetting = memo(({ plan }) => {
    const history = useHistory();

    const [updatePlan] = useMutation(UPDATE_PLAN);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = useCallback(
        async (
            /**
             * @type {ReturnType<typeof import('../blocks/PlanForm')['getDefaultValues']>}
             */
            values
        ) => {
            const newServices = new Set(values.services);

            const transformedValues = {
                id: plan.id,
                name: values.name,
                activated: values.activated,
                dailyOutput: values.dailyOutput,
                visible: values.visible,
                servicesIds: values.services,
                servicesIdsToDisconnect: plan.services.filter(service => !newServices.has(service.id)).map(({ id }) => id),
                featuresTitle: values.featuresTitle,
                features: values.features.map(({ name }) => name),
                tooltips: values.features.map(({ tooltip }) => tooltip),
            };

            message.destroy();
            message.loading('Updating plan...', 50000);
            setIsLoading(true);

            try {
                await updatePlan({ variables: { ...transformedValues } });
                message.destroy();
                message.success('Plan has been updated');
                setIsLoading(false);
                history.push(`${SETTINGS}?tab=PLAN`);
            } catch (err) {
                setIsLoading(false);
                console.log(err);
                message.destroy();
                const errors = err.graphQLErrors || [];
                const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on updating plan';
                message.error(formErrorMessage);
            }
        },
        [history, plan.id, plan.services, updatePlan]
    );

    return (
        <Box>
            <PlanForm
                defaultValues={{
                    name: plan.name,
                    price: plan.price,
                    interval: plan.interval,
                    activated: plan.activated,
                    dailyOutput: plan.dailyOutput,
                    visible: plan.visible,
                    stripeId: plan.stripeId,
                    services: plan.services.map(({ id }) => id),
                    featuresTitle: plan.featuresTitle,
                    features: plan.features.map((feature, index) => ({
                        name: feature,
                        tooltip: (Array.isArray(plan.tooltips) ? plan.tooltips : [])[index],
                    })),
                }}
                onSubmit={handleOnSubmit}
                disabledFields={{
                    price: true,
                    interval: true,
                }}
                loading={isLoading}
            />
        </Box>
    );
});

function FormSkeleton() {
    return (
        <Box>
            <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="30">
                <Box $w="100%" $mr="20">
                    <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                        Name
                    </Text>
                    <Skeleton $w="100%" $h="40" />
                </Box>
                <Box $w="100%" $ml="20">
                    <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                        Stripe ID
                    </Text>
                    <Skeleton $w="100%" $h="40" />
                </Box>
            </Box>
            <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="30">
                <Box $w="100%" $mr="20">
                    <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                        Price
                    </Text>
                    <Skeleton $w="100%" $h="40" />
                </Box>
                <Box $w="100%" $ml="20">
                    <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                        Interval
                    </Text>
                    <Skeleton $w="100%" $h="40" />
                </Box>
            </Box>
            <Box $mb="30">
                <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                    Daily output
                </Text>
                <Skeleton $w="195" $h="40" />
            </Box>
            <Box $d="flex" $alignItems="center" $justifyContent="space-between" $mb="30">
                <Box $w="100%" $mr="20">
                    <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                        Status
                    </Text>
                    <Skeleton $w="102" $h="20" />
                </Box>
                <Box $w="100%" $ml="20">
                    <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                        Visibility
                    </Text>
                    <Skeleton $w="102" $h="20" />
                </Box>
            </Box>
            <Box $mb="30">
                <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                    Associated Products
                </Text>
                <Skeleton $w="100%" $h="40" />
            </Box>
            <Box $mb="30">
                <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                    Features title{' '}
                    <Text $d="inline-block" $colorScheme="tertiary">
                        (Optional)
                    </Text>
                </Text>
                <Skeleton $w="100%" $h="40" />
            </Box>
            <Box $mb="30">
                <Text $textVariant="H6" $colorScheme="primary" $mb="10">
                    Features name
                </Text>
                <Skeleton $w="100%" $h="40" />
            </Box>
            <Box $d="flex" $alignItems="center" $justifyContent="flex-end">
                <Skeleton $w="98" $h="40" $mr="20" />
                <Skeleton $w="144" $h="40" />
            </Box>
        </Box>
    );
}

function PlanContainer(props) {
    const { match } = props;

    const { params } = match;

    const queryResult = useQuery(PLAN, {
        variables: {
            id: params?.id,
        },
        fetchPolicy: 'network-only',
    });

    const { loading, data } = queryResult;

    return (
        <DocumentTitle title="Edit Plan | ManyPixels">
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
                            <Text $textVariant="H3" $colorScheme="headline" $mb="12">
                                Edit plan
                            </Text>
                            <Breadcrumb $mb="29">
                                <BreadcrumbItem isFirst as={Link} to={SETTINGS}>
                                    Settings
                                </BreadcrumbItem>
                                <BreadcrumbItem as={Link} to={ADMIN_PLAN_SETTING}>
                                    Plans
                                </BreadcrumbItem>
                                <BreadcrumbItem>Edit plan</BreadcrumbItem>
                            </Breadcrumb>
                            {data?.Plan ? <EditPlanSetting plan={data.Plan} queryResult={queryResult} /> : <>{loading ? <FormSkeleton /> : null}</>}
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
}

export default PlanContainer;
