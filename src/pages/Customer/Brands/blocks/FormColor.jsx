import React, { forwardRef, useState } from 'react';
import { Form } from '@components/Form';
import { Box } from '@components/Box';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Select } from '@components/Select';
import FieldColor from './FieldColor.jsx';

const colorOptions = [
    { label: 'HEX', value: 'HEX' },
    { label: 'RGB', value: 'RGB' },
    { label: 'CMYK', value: 'CMYK' },
    { label: 'HSV', value: 'HSV' },
    { label: 'HSL', value: 'HSL' },
];

const FormColor = forwardRef(({ onAdd, initialValues, loading }, ref) => {
    const [form] = Form.useForm();
    const [stateType, setStateType] = useState(() => initialValues?.type);

    // Use state to manage changed type input color
    // and reset value input
    const handleChangeType = value => {
        setStateType(value);

        let defaultColor;
        switch (value) {
            case 'HEX':
                defaultColor = '#000000';
                break;
            case 'RGB':
                defaultColor = '0,0,0';
                break;
            case 'CMYK':
                defaultColor = '0%,0%,0%,100%';
                break;
            case 'HSV':
                defaultColor = '0°,0%,0%';
                break;
            case 'HSL':
                defaultColor = '0°,0%,0%';
                break;
            default:
                break;
        }

        form.setFieldsValue({
            colorValue: defaultColor,
        });
    };

    const handleSubmit = () => {
        form.validateFields().then(async values => {
            onAdd(values);
        });
    };

    return (
        <Form
            ref={ref}
            onFinish={handleSubmit}
            form={form}
            name="colorForm"
            initialValues={{
                name: initialValues?.name,
                colorValue: initialValues?.colorValue ?? '#000000',
                type: initialValues?.type ?? 'HEX',
            }}
        >
            <Form.Item
                rules={[
                    {
                        required: true,
                        message: 'Please enter color name',
                    },
                ]}
                validateTrigger="onBlur"
                name="name"
                label="Name"
                colon={false}
                required={false}
                style={{ marginBottom: 20 }}
            >
                <Input placeholder="Give your color a name" />
            </Form.Item>
            <Form.Item label="Color" colon={false} required={false} style={{ marginBottom: 20 }}>
                <Box $d={['block', 'flex']} $flexDir="row" $mx="-7px">
                    <Box $flex={1} $px="7px" $mb={['16', '0']}>
                        <Form.Item name="colorValue" style={{ marginBottom: 0 }}>
                            <FieldColor type={stateType} />
                        </Form.Item>
                    </Box>
                    <Box $ml="auto" $px="7px" $maxW={['auto', '108']} $w="100%">
                        <Form.Item validateTrigger="onBlur" name="type" colon={false} equired="false" style={{ marginBottom: 0 }}>
                            <Select placeholder="Type" onChange={handleChangeType}>
                                {colorOptions.map(opt => (
                                    <Select.Option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Box>
                </Box>
            </Form.Item>
            <Form.Item>
                <Box $d="flex" $justifyContent="flex-end" $alignItems="center">
                    <Button type="primary" htmlType="submit" $h="34" $fontSize="12" loading={loading}>
                        {initialValues && initialValues.name ? 'Update' : 'Add Color'}
                    </Button>
                </Box>
            </Form.Item>
        </Form>
    );
});

export default FormColor;
