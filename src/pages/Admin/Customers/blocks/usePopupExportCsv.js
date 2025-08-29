import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { get } from '@utils/get';
import saveAs from 'file-saver';
import { useCustomerPopupContext } from './CustomerPopupContext.jsx';

const makeCsv = (result, headers) => {
    let csv = 'data:text/csv;charset=utf-8,';
    csv +=
        headers
            .map(header => {
                if (header.label) {
                    return header.label;
                }
                return header.dataIndex;
            })
            .join(';') + '\r\n';
    csv += result
        .map(item => {
            return headers
                .map(header => (header.render ? header.render(get(item, header.dataIndex) ?? '', item) : (get(item, header.dataIndex) ?? '')))
                .join(';');
        })
        .join('\r\n');
    return csv;
};

const usePopupExportCsv = ({ filter, query, headers, getArrayData, fileName }) => {
    const { isExporting, setExporting } = useCustomerPopupContext();
    const client = useApolloClient();

    useEffect(() => {
        const doExport = async () => {
            try {
                const { data } = await client.query({
                    query,
                    variables: { ...filter },
                });
                const result = getArrayData(data);
                const csvStr = makeCsv(result, headers);
                saveAs(encodeURI(csvStr), fileName);
                setExporting(false);
            } catch (error) {
                console.log(error);
                setExporting(false);
            }
        };

        if (isExporting) {
            doExport();
        }
    }, [isExporting, filter, query, client, setExporting, fileName, getArrayData, headers]);

    return null;
};

export default usePopupExportCsv;
