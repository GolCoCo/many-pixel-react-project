import React, { memo } from 'react';
import { Table } from '@components/Table';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Popup } from '@components/Popup';
import moment from 'moment';
import { usdFormatter } from '@constants/utils';

const columns = [
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 368,
        render: text => (
            <Text $textVariant="P4" $colorScheme="primary">
                {text}
            </Text>
        ),
    },
    {
        title: 'QTY',
        dataIndex: 'qty',
        key: 'qty',
        width: 93,
        render: text => (
            <Text $textVariant="P4" $colorScheme="primary">
                {text}
            </Text>
        ),
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: 113,
        render: text => (
            <Text $textVariant="P4" $colorScheme="primary">
                {text}
            </Text>
        ),
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        align: 'right',
        render: text => (
            <Text $textVariant="P4" $colorScheme="primary">
                {text}
            </Text>
        ),
    },
];

const BillingSummaryModal = memo(
    ({ visible, onOk, onCancel, customer, nextBillingDate, upcomingInvoice, paymentMethod }) => {
        const data = [
            {
                key: '1',
                description: upcomingInvoice.items ? upcomingInvoice?.items[0]?.description : '',
                qty: upcomingInvoice.items ? upcomingInvoice?.items[0]?.quantity : 0,
                price: usdFormatter.format(upcomingInvoice.subtotal / 100),
                total: usdFormatter.format(upcomingInvoice.total / 100),
            },
        ];
        return (
            <Popup
                $variant="default"
                width={720}
                title="Upcoming invoice"
                open={visible}
                onOk={onOk}
                onCancel={onCancel}
                footer={null}
                centered
            >
                <Box $d="flex" $justifyContent="space-between" $mb="18" hide="mobile">
                    <Box $flex="1 1 0%">
                        <Text $textVariant="H6" $colorScheme="primary" $mb="8">
                            Bill to
                        </Text>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {`${customer.firstname} ${customer.lastname}`}
                        </Text>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {paymentMethod?.billingDetails?.email}
                        </Text>
                    </Box>
                    <Box $flex="1 1 0%">
                        <Text $textVariant="H6" $colorScheme="primary" $mb="8">
                            Due date
                        </Text>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {moment(nextBillingDate).format('MMM DD, YYYY')}
                        </Text>
                    </Box>
                </Box>
                <Box hide="mobile">
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={{ hideOnSinglePage: true }}
                        footer={() => (
                            <Box $d="flex" $justifyContent="flex-end" $alignItems="center">
                                <Text $textVariant="P4" $colorScheme="primary" $mr="68">
                                    Total amount
                                </Text>
                                <Text $textVariant="H5" $colorScheme="cta" $pr="2">
                                    {usdFormatter.format(upcomingInvoice.amountDue / 100)}
                                </Text>
                            </Box>
                        )}
                    />
                </Box>
                <Box hide="desktop">
                    <Box $mb="20">
                        <Text $textVariant="H6" $colorScheme="primary" $mb="8">
                            Bill to
                        </Text>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {`${customer.firstname} ${customer.lastname}`}
                        </Text>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {customer.email}
                        </Text>
                    </Box>
                    <Box $mb="20">
                        <Text $textVariant="H6" $colorScheme="primary" $mb="8">
                            Due date
                        </Text>
                        <Text $textVariant="P4" $colorScheme="primary">
                            {moment(nextBillingDate).format('MMM DD, YYYY')}
                        </Text>
                    </Box>
                    <Box>
                        <Text $textVariant="H6" $colorScheme="primary" $mb="8">
                            Total amount
                        </Text>
                        <Text $textVariant="H5" $colorScheme="cta">
                            {usdFormatter.format(upcomingInvoice.amountDue / 100)}
                        </Text>
                    </Box>
                </Box>
            </Popup>
        );
    }
);

export default BillingSummaryModal;
