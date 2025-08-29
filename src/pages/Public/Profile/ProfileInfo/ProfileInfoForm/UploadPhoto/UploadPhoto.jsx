/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React, { useState, memo } from 'react';
import { Upload } from 'antd';
import { useMutation } from '@apollo/client';
import { AvatarBlock } from '@components/AvatarBlock';
import uploadIcon from '@public/assets/icons/upload.svg';
import message from '@components/Message';
import { ME } from '@graphql/queries/userConnected';
import { UPDATE_USER_PICTURE, DELETE_USER_PICTURE } from '@graphql/mutations/user';
import { UPLOAD_FILE } from '@graphql/mutations/file';

const UploadPhoto = memo(({ userId, profilePic }) => {
    const [imageFilePreview, setImageFilePreview] = useState(profilePic || null);
    const [isUploading, setIsUploading] = useState(false);
    const [updateUserPicture] = useMutation(UPDATE_USER_PICTURE, {
        refetchQueries: [{ query: ME }],
    });
    const [deleteUserPicture] = useMutation(DELETE_USER_PICTURE, {
        refetchQueries: [{ query: ME }],
    });
    const [uploadFile] = useMutation(UPLOAD_FILE);

    const handleUpload = async file => {
        try {
            const variables = { userId, fileId: file.response.id };
            await updateUserPicture({ variables });
            message.destroy();
            message.success('Profile picture has been updated');
            setIsUploading(false);
            return true;
        } catch (err) {
            setIsUploading(false);
            console.log(err);
            message.destroy();
            const errors = err.graphQLErrors || [];
            const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on updating profile picture';
            message.error(formErrorMessage);
            return false;
        }
    };

    const customRequest = async options => {
        message.destroy();
        message.loading('Uploading profile picture...', 50000);
        setIsUploading(true);
        const variables = {
            file: options.file,
            isPublic: true
        };
        const res = await uploadFile({ variables });
        options.onSuccess(res.data.uploadFile);
        return {
            abort() {
                message.destroy();
                setIsUploading(false);
                message.error('There was an error on uploading your picture');
            },
        };
    };

    const handleChange = info => {
        if (info.file.status === 'done') {
            handleUpload(info.file);
            setImageFilePreview(info.file.response.url);
        } else if (info.file.status === 'error') {
            message.destroy();
            message.error('There was an error on uploading your picture');
            console.log(info, 'upload file error');
        }
    };

    const handleRemove = () => {
        try {
            deleteUserPicture({ variables: { userId } });
            setImageFilePreview(null);
            message.destroy();
            message.success(`Picture removed successfully`);
        } catch (err) {
            console.log(err);
            message.destroy();
            const errors = err.graphQLErrors || [];
            const formErrorMessage = errors.length > 0 ? errors[0].message : 'Error on removing profile picture';
            message.error(formErrorMessage);
        }
    };

    return (
        <>
            <AvatarBlock
                size={80}
                styles={{ border: '1px solid #d5d6dd' }}
                src={imageFilePreview}
                onRemove={handleRemove}
                loading={isUploading}
            />
            <Upload
                name="image-upload"
                accept="image/*"
                showUploadList={false}
                onChange={file => handleChange(file)}
                customRequest={file => customRequest(file)}
            >
                <a href="/" onClick={e => e.preventDefault()}>
                    <img src={uploadIcon} alt="Upload" />
                </a>
            </Upload>
        </>
    );
});

export default UploadPhoto;
