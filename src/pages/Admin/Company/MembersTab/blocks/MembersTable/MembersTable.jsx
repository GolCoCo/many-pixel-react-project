import React from 'react';
import { ConfigProvider } from 'antd';
import { Table } from '@components/Table';
import { Box } from '@components/Box';
import { EmptyData } from '@components/EmptyData';

const MembersTable = ({
    columns,
    dataSource,
    setPage,
    page,
    pageSize = 10,
    pageSizeOptions = ['10', '20', '30', '40', '50'],
    totalCount,
    paginate = true,
    onChange = () => {},
}) => {
    return (
        <Box>
            <ConfigProvider renderEmpty={EmptyData}>
                <Table
                    isAdminTable
                    columns={columns}
                    onChange={onChange}
                    dataSource={dataSource}
                    rowKey={row => row.id}
                    pagination={
                        paginate
                            ? {
                                  total: totalCount,
                                  pageSize,
                                  current: page,
                                  onChange: setPage,
                                  defaultPageSize: 10,
                                  showSizeChanger: true,
                                  pageSizeOptions,
                              }
                            : false
                    }
                />
            </ConfigProvider>
        </Box>
    );
};

export default MembersTable;
