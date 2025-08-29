import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import replace from 'lodash/replace';
import { SETTINGS, ADMIN_PLAN_SETTING } from '@constants/routes';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Basepage } from '@components/Basepage';
import { PageContainer } from '@components/PageContainer';
import DocumentTitle from '@components/DocumentTitle';
import { Link } from '@components/Link';
import ArrowLeftIcon from '@components/Svg/ArrowLeft';
import { Button } from '@components/Button';
import { Breadcrumb, BreadcrumbItem } from '@components/Breadcrumb';
import message from '@components/Message';
import { ADD_PLAN } from '@graphql/mutations/plan';
import PlanForm from '../blocks/PlanForm.jsx';

const AddPlanSetting = () => {
    const history = useHistory();
    const [createSubscriptionPlan] = useMutation(ADD_PLAN);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = useCallback(
        async (
            /**
             * @type {ReturnType<typeof import('../blocks/PlanForm')['getDefaultValues']>}
             */
            values
        ) => {
            const transformedValues = {
                name: values.name,
                stripeId: replace(values.name, /(\s)/g, '_'),
                price: values.price,
                interval: values.interval,
                activated: values.activated,
                dailyOutput: values.dailyOutput,
                visible: values.visible,
                servicesIds: values.services,
                featuresTitle: values.featuresTitle,
                features: values.features.map(({ name }) => name),
                tooltips: values.features.map(({ tooltip }) => tooltip),
            };

            message.destroy();
            message.loading('Adding plan...', 50000);

            setIsLoading(true);

            try {
                await createSubscriptionPlan({
                    variables: { ...transformedValues },
                });
                message.destroy();
                message.success('Plan successfully added');
                setIsLoading(false);
                history.push(`${SETTINGS}?tab=PLAN`);
            } catch (err2) {
                setIsLoading(false);
                console.log(err2);
                message.destroy();
                const errors = err2.graphQLErrors || [];
                const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on adding plan';
                message.error(formErrorMessage);
            }
        },
        [createSubscriptionPlan, history]
    );

    return (
        <DocumentTitle title="Add Plan | ManyPixels">
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
                                Add plan
                            </Text>
                            <Breadcrumb $mb="29">
                                <BreadcrumbItem isFirst as={Link} to={SETTINGS}>
                                    Settings
                                </BreadcrumbItem>
                                <BreadcrumbItem as={Link} to={ADMIN_PLAN_SETTING}>
                                    Plans
                                </BreadcrumbItem>
                                <BreadcrumbItem>Add plan</BreadcrumbItem>
                            </Breadcrumb>
                            <Box>
                                <PlanForm onSubmit={handleOnSubmit} loading={isLoading} />
                            </Box>
                        </Box>
                    </Box>
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
};

export default AddPlanSetting;
