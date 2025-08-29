import React, { useCallback, memo } from 'react';
import { useMutation } from '@apollo/client';
import { NEW_ORDER } from '@graphql/mutations/order';
import { SAVE_FILE } from '@graphql/mutations/file';
import { uploadToR2 } from '@utils/uploadToR2';
import message from '@components/Message';
import { parseLinks, toHtml } from '@components/Wysiwyg';
import withLoggedUser from '@components/WithLoggedUser';
import DocumentTitle from '@components/DocumentTitle';
import FormRequest from '../blocks/FormRequest/FormRequest';

const CreateRequest = memo(({ viewer }) => {
    const [newOrder] = useMutation(NEW_ORDER);
    const [saveFile] = useMutation(SAVE_FILE);

    const handleSubmit = useCallback(
        async ({ attachments, ...values }) => {
            if (attachments && attachments.length) {
                message.destroy();
                message.loading('Uploading attachments...', 50000);

                const promises = attachments.map(async attachment => {
                    const uploadedFile = await uploadToR2(attachment, () => {});
                    const variables = {
                        name: attachment.name,
                        size: attachment.size,
                        type: attachment.type,
                        secret: uploadedFile,
                    };
                    const res = await saveFile({ variables });
                    return res.data.saveFile.id;
                });

                const uploadedAttachmentIds = await Promise.all(promises);
                message.destroy();
                message.loading('Finalizing request...', 50000);
                await newOrder({
                    variables: {
                        input: {
                            ...values,
                            description: toHtml(parseLinks(values?.description)),
                            attachmentIds: uploadedAttachmentIds,
                        },
                    },
                })
                    .then(() => {
                        message.destroy();
                        message.success('Request has been created.');
                    })
                    .catch(err => {
                        console.log(err);
                        message.destroy();
                        message.error('Error on creating request');
                    });
            } else {
                message.destroy();
                message.loading('Creating request...', 50000);

                await newOrder({
                    variables: {
                        input: {
                            ...values,
                            description: toHtml(parseLinks(values?.description)),
                            attachmentIds: null,
                        },
                    },
                })
                    .then(() => {
                        message.destroy();
                        message.success('Request has been created.');
                    })
                    .catch(err => {
                        console.log(err);
                        message.destroy();
                        message.error('Error on creating request');
                    });
            }
        },
        [newOrder, saveFile]
    );

    return (
        <DocumentTitle title="Create Request | ManyPixels">
            <FormRequest paging breadcrumbLabel="Create" onSubmit={handleSubmit} initialValues={{}} title="Create Request" viewer={viewer} />
        </DocumentTitle>
    );
});

export default withLoggedUser(CreateRequest);
