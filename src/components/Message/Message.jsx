import React from 'react';
import { message as antdMessage } from 'antd';
import CheckIcon from '@components/Svg/Check';
import NotIcon from '@components/Svg/Not';
import Icon, { LoadingOutlined } from '@ant-design/icons';

const success = (content, duration) =>
    antdMessage.success({
        icon: <CheckIcon />,
        content,
        duration,
    });

const error = (content, duration) =>
    antdMessage.error({
        icon: <NotIcon />,
        content,
        duration,
    });

const loading = (content, duration) =>
    antdMessage.loading({
        icon: <Icon component={LoadingOutlined} />,
        content,
        duration,
    });

const message = {
    success,
    error,
    loading,
    destroy: antdMessage.destroy,
};

export default message;
