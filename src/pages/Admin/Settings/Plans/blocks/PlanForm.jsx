import * as React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Link as NavLink } from 'react-router-dom';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import RemoveIcon from '@public/assets/icons/remove-feature.svg';
import { Input } from '@components/Input';
import IconAdd from '@components/Svg/IconAdd';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { ADMIN_PLAN_SETTING } from '@constants/routes';
import { ALL_ACTIVATED_SERVICES } from '@graphql/queries/service';
import { useQuery } from '@apollo/client';
import { Switch } from 'antd';
import { Select } from '@components/Select';
import ProductsField from './ProductsField';
import DailyOutputField from './DailyOutputField';
import PlanPriceField from './PlanPriceField';

/**
 *
 * @param {string} value
 * @param {number} featureIndex
 * @param {{name: string, tooltip: string | null | undefined}} features
 */
function featureExists(value, featureIndex, features) {
    const hasFeature = features.some((feature, index) => {
        if (index === featureIndex) return false;

        return feature.name === value;
    });

    if (hasFeature) {
        return true;
    }

    return false;
}

export function getDefaultValues() {
    /**
     * @type {Record<'name' | 'stripeId' | 'featuresTitle' | 'interval', string | undefined> & Record<'dailyOutput' | 'price', number | undefined> & {
     * 	features: {name: string, tooltip: string | null | undefined}[]
     * 	services: string[]
     * 	activated: boolean
     * 	visible: boolean
     * }}
     */
    const newValues = {
        name: '',
        activated: true,
        visible: true,
        dailyOutput: undefined,
        price: 0,
        featuresTitle: '',
        interval: '',
        stripeId: '',
        services: [],
        features: [
            {
                name: '',
                tooltip: null,
            },
        ],
    };

    return newValues;
}

function getFormItemErrorProps(fieldState) {
    const hasError = Boolean(fieldState.error);
    const errorMessage = fieldState.error?.message;
    const message = typeof errorMessage === 'string' ? errorMessage : undefined;

    return {
        validateStatus: hasError ? 'error' : undefined,
        help: message,
    };
}

export default function PlanForm(
    /**
     * @type {{
     * 	defaultValues?: ReturnType<typeof getDefaultValues>;
     * 	onSubmit?: (
     * 		data: ReturnType<typeof getDefaultValues>
     * 	) => void | Promise<void>;
     * 	disabledFields?: Partial<Record<keyof ReturnType<typeof getDefaultValues>, boolean>>
     * 	loading?: boolean
     * }}
     */
    { defaultValues: defaultValuesProp, onSubmit = () => {}, disabledFields, loading }
) {
    const [defaultValues] = React.useState(() => defaultValuesProp || getDefaultValues());

    const { control, handleSubmit, setValue, trigger } = useForm({
        defaultValues,
    });

    const handleOnSubmit = React.useMemo(
        () =>
            handleSubmit(async data => {
                await onSubmit(data);
            }),
        [handleSubmit, onSubmit]
    );

    const {
        fields: featurefields,
        append: appendFeature,
        remove: removeFeature,
    } = useFieldArray({
        control,
        name: 'features',
    });

    const validateFeatureNames = React.useCallback(() => trigger(featurefields.map((_, index) => `features.${index}.name`)), [featurefields, trigger]);

    const { loading: servicesLoading, data: servicesData } = useQuery(ALL_ACTIVATED_SERVICES, {
        fetchPolicy: 'network-only',
    });

    return (
        <Form onFinish={handleOnSubmit}>
            <Box $d="flex" $alignItems="center" $justifyContent="space-between">
                <Box $w="100%" $mr="20">
                    <Controller
                        control={control}
                        name="name"
                        rules={{
                            required: 'This field cannot be empty',
                        }}
                        render={({ field, fieldState }) => (
                            <Form.Item label="Name" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                                <Input {...field} placeholder="Enter plan name" />
                            </Form.Item>
                        )}
                    />
                </Box>

                <Box $w="100%" $ml="20">
                    <Controller
                        control={control}
                        name="stripeId"
                        render={({ field: { value }, fieldState }) => (
                            <Form.Item label="Stripe ID" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                                <Input value={value} disabled placeholder="By default generated from name" />
                            </Form.Item>
                        )}
                    />
                </Box>
            </Box>

            <Box $d="flex" $alignItems="center" $justifyContent="space-between">
                <Box $w="100%" $mr="20">
                    <Controller
                        control={control}
                        name="price"
                        rules={{
                            required: 'This field cannot be empty',
                        }}
                        render={({ field, fieldState }) => (
                            <Form.Item label="Price" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                                <PlanPriceField {...field} disabled={disabledFields?.[field.name]} />
                            </Form.Item>
                        )}
                    />
                </Box>
                <Box $w="100%" $ml="20">
                    <Controller
                        control={control}
                        name="interval"
                        rules={{
                            required: 'This field cannot be empty',
                        }}
                        render={({ field, fieldState }) => (
                            <Form.Item label="Interval" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                                <Select {...field} disabled={disabledFields?.[field.name]} placeholder="Choose interval">
                                    <Select.Option key="MONTHLY" value="MONTHLY">
                                        MONTHLY
                                    </Select.Option>
                                    <Select.Option key="QUARTERLY" value="QUARTERLY">
                                        QUARTERLY
                                    </Select.Option>
                                    <Select.Option key="BIANNUALLY" value="BIANNUALLY">
                                        BIANNUALLY
                                    </Select.Option>
                                    <Select.Option key="YEARLY" value="YEARLY">
                                        YEARLY
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        )}
                    />
                </Box>
            </Box>

            <Controller
                control={control}
                name="dailyOutput"
                rules={{
                    required: 'This field cannot be empty',
                }}
                render={({ field, fieldState }) => (
                    <Form.Item label="Daily output" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                        <DailyOutputField {...field} />
                    </Form.Item>
                )}
            />

            <Box $d="flex" $alignItems="center" $justifyContent="space-between">
                <Box $w="100%" $mr="20">
                    <Controller
                        control={control}
                        name="activated"
                        render={({ field, fieldState }) => (
                            <Form.Item label="Status" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                                <Box $mt="11" $d="flex" $alignItems="center">
                                    <Box $mr="10">
                                        <Switch {...field} checked={field.value} />
                                    </Box>
                                    <Text $textVariant="P4" $colorScheme="primary">
                                        {field.value ? 'Activated' : 'Deactivated'}
                                    </Text>
                                </Box>
                            </Form.Item>
                        )}
                    />
                </Box>

                <Box $w="100%" $ml="20">
                    <Controller
                        control={control}
                        name="visible"
                        render={({ field, fieldState }) => (
                            <Form.Item label="Visibility" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                                <Box $mt="11" $d="flex" $alignItems="center">
                                    <Box $mr="10">
                                        <Switch {...field} checked={field.value} />
                                    </Box>
                                    <Text $textVariant="P4" $colorScheme="primary">
                                        {field.value ? 'On' : 'Off'}
                                    </Text>
                                </Box>
                            </Form.Item>
                        )}
                    />
                </Box>
            </Box>

            <Controller
                control={control}
                name="services"
                rules={{
                    required: 'This field cannot be empty',
                }}
                render={({ field: { name, value }, fieldState }) => {
                    return (
                        <Form.Item label="Associated products" colon={false} required={false} {...getFormItemErrorProps(fieldState)}>
                            <ProductsField
                                loading={servicesLoading}
                                data={servicesData}
                                name={name}
                                value={value}
                                onRemoveProduct={serviceToRemove => {
                                    setValue(
                                        'services',
                                        value.filter(service => service !== serviceToRemove)
                                    );
                                }}
                                onUnremoveProduct={serviceToAdd => {
                                    setValue('services', [...value, serviceToAdd]);
                                }}
                            />
                        </Form.Item>
                    );
                }}
            />

            <Controller
                control={control}
                name="featuresTitle"
                render={({ field, fieldState }) => {
                    const hasError = Boolean(fieldState.error);
                    const errorMessage = fieldState.error?.message;
                    const message = typeof errorMessage === 'string' ? errorMessage : undefined;

                    return (
                        <Form.Item
                            label={
                                <>
                                    Features title{' '}
                                    <Text $d="inline-block" $colorScheme="tertiary">
                                        (Optional)
                                    </Text>
                                </>
                            }
                            colon={false}
                            required={false}
                            validateStatus={hasError ? 'error' : undefined}
                            help={message}
                        >
                            <Input {...field} placeholder="Ex: Everything on essentials plan, plus" />
                        </Form.Item>
                    );
                }}
            />

            <Form.Item label="Features name" colon={false} required={false}>
                {featurefields.map((featureField, featureIndex) => {
                    return (
                        <Box key={featureField.id} $mt={featureIndex === 0 ? '6' : '0'}>
                            <Controller
                                control={control}
                                name={`features.${featureIndex}.name`}
                                rules={{
                                    required: true,
                                    validate: (value, formValues) => {
                                        return featureExists(value, featureIndex, formValues.features) ? 'You have already added this feature' : true;
                                    },
                                }}
                                render={({ field, fieldState }) => {
                                    const hasError = Boolean(fieldState.error);

                                    const errorMessage = fieldState.error?.message;

                                    const message = typeof errorMessage === 'string' ? errorMessage : undefined;

                                    return (
                                        <Form.Item
                                            label={`Feature #${featureIndex + 1}`}
                                            validateStatus={hasError ? 'error' : undefined}
                                            help={message}
                                            colon={false}
                                            required={false}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Box $d="flex" $alignItems="center">
                                                <Input
                                                    {...field}
                                                    onBlur={ev => {
                                                        validateFeatureNames();

                                                        field.onBlur(ev);
                                                    }}
                                                    required
                                                    placeholder="Enter feature name"
                                                />

                                                {featurefields.length > 1 ? (
                                                    <Box
                                                        $ml="18"
                                                        $w="40"
                                                        $h="40"
                                                        $lineH="38"
                                                        $borderW="1"
                                                        $borderStyle="solid"
                                                        $borderColor="outline-gray"
                                                        $cursor="pointer"
                                                        $textAlign="center"
                                                        $radii="10"
                                                        onClick={() => {
                                                            removeFeature(featureIndex);
                                                            validateFeatureNames();
                                                        }}
                                                    >
                                                        <img src={RemoveIcon} alt="Remove Feature" />
                                                    </Box>
                                                ) : null}
                                            </Box>
                                        </Form.Item>
                                    );
                                }}
                            />

                            <Controller
                                control={control}
                                name={`features.${featureIndex}.tooltip`}
                                render={({ field: { value, ...fieldProps } }) =>
                                    value == null ? (
                                        <Box
                                            $my="20"
                                            $d="flex"
                                            $alignItems="center"
                                            $colorScheme="cta"
                                            $cursor="pointer"
                                            onClick={() => setValue(`features.${featureIndex}.tooltip`, '')}
                                            $w="103"
                                        >
                                            <IconAdd />
                                            <Text $ml="8" $textVariant="H6">
                                                Add tooltip
                                            </Text>
                                        </Box>
                                    ) : (
                                        <>
                                            <Form.Item>
                                                <Box $my="20" $d="flex" $alignItems="center">
                                                    <Input {...fieldProps} value={value} required placeholder="Enter tooltip information" />

                                                    <Box
                                                        $ml="18"
                                                        $w="40"
                                                        $h="40"
                                                        $lineH="38"
                                                        $borderW="1"
                                                        $borderStyle="solid"
                                                        $borderColor="outline-gray"
                                                        $cursor="pointer"
                                                        $textAlign="center"
                                                        $radii="10"
                                                        onClick={() => setValue(`features.${featureIndex}.tooltip`, null)}
                                                    >
                                                        <img src={RemoveIcon} alt="Remove" />
                                                    </Box>
                                                </Box>
                                            </Form.Item>
                                        </>
                                    )
                                }
                            />
                        </Box>
                    );
                })}

                <Text
                    $textVariant="H6"
                    $colorScheme="cta"
                    $borderW="1"
                    $borderStyle="solid"
                    $borderColor="cta"
                    $w="150"
                    $h="40"
                    $lineH="38"
                    $radii="10"
                    $textAlign="center"
                    $cursor="pointer"
                    onClick={() => {
                        appendFeature({
                            name: '',
                            tooltip: null,
                        });
                    }}
                >
                    ADD FEATURES
                </Text>
            </Form.Item>

            <Form.Item>
                <Box $d="flex" $alignItems="center" $justifyContent="flex-end">
                    <Box $mr="20">
                        <NavLink to={ADMIN_PLAN_SETTING}>
                            <Button $w="98" type="default">
                                Cancel
                            </Button>
                        </NavLink>
                    </Box>
                    <Button $w="144" type="primary" htmlType="submit" loading={loading}>
                        Update
                    </Button>
                </Box>
            </Form.Item>
        </Form>
    );
}
