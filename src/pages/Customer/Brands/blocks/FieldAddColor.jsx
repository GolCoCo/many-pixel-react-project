import React, { useState, forwardRef } from 'react';
import { useMutation } from '@apollo/client';
import { Dropdown } from 'antd';
import IconAdd from '@components/Svg/IconAdd';
import IconOptions from '@components/Svg/IconOptions';
import IconEdit from '@components/Svg/IconEdit';
import IconDelete from '@components/Svg/IconDelete';
import { DropdownMenu, DropdownMenuItem, DropdownMenuItemContent } from '@components/Dropdown';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Popup, PopupDelete } from '@components/Popup';
import message from '@components/Message';
import { UPDATE_COLOR, DELETE_COLOR } from '@graphql/mutations/color';
import { UPDATE_BRAND } from '@graphql/mutations/brand';
import FormColor from './FormColor.jsx';
import { BoxPreviewHex } from './BoxPreviewHex.jsx';
import { AddColorContainer } from '../style.js';

const FieldAddColor = forwardRef(({ value, onBrandDetailChange, onChange, cardWidth = '224', brandData, isCustomer, refetch }, ref) => {
    const [showAdd, setShowAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [{ editable, editIndex }, setEditable] = useState({ editable: null, editIndex: null });
    const [{ deletable, deleteIndex }, setDeletable] = useState({ deletable: null, deletIndex: null });
    const [updateColor] = useMutation(UPDATE_COLOR);
    const [deleteColor] = useMutation(DELETE_COLOR);
    const [updateBrand] = useMutation(UPDATE_BRAND);

    const handleAdd = async color => {
        if (onChange) {
            onChange([...(value ?? []), color]);
        }

        if (onBrandDetailChange) {
            setIsLoading(true);
            await onBrandDetailChange(color);
            setIsLoading(false);
        }
        setShowAdd(false);
    };

    const handleEdit = async color => {
        if (onChange) {
            onChange(
                value.map((item, index) => {
                    if (index === editIndex) {
                        return color;
                    }
                    return item;
                })
            );

            message.destroy();
            message.success('Color info has been updated');
        }

        if (onBrandDetailChange) {
            message.destroy();
            message.loading('Updating color...', 50000);
            setIsLoading(true);
            await updateColor({
                variables: {
                    id: editable.id,
                    name: color.name,
                    colorValue: color.colorValue,
                    type: color.type,
                },
            })
                .then(() => {
                    message.destroy();
                    message.success('Color info has been updated');
                })
                .catch(err => {
                    console.log(err);
                    message.destroy();
                    message.error('Error on updating color');
                });
            setIsLoading(false);
        }

        setEditable({ editable: null, editIndex: null });
    };

    const handleDelete = async () => {
        if (onChange) {
            onChange(value.filter((_, i) => i !== deleteIndex));
            message.destroy();
            message.success('Color has been deleted');
        }

        if (onBrandDetailChange) {
            message.destroy();
            message.loading('Deleting color...', 50000);
            setIsLoading(true);
            await updateBrand({
                variables: {
                    id: brandData.id,
                    name: brandData.name,
                    industry: brandData.industry,
                    description: brandData.description,
                    website: brandData.website,
                },
            })
                .then(async () => {
                    message.destroy();
                    message.loading('Finalizing...', 50000);
                    await deleteColor({ variables: { id: deletable.id } })
                        .then(() => {
                            message.destroy();
                            message.success('Color has been deleted');
                        })
                        .catch(err => {
                            console.log(err);
                            message.destroy();
                            message.error('Error on deleting color');
                        });
                })
                .catch(err => {
                    console.log(err);
                    message.destroy();
                    message.error('Error on updating brand');
                })
                .finally(() => {
                    refetch();
                    setIsLoading(false);
                });
        }
        setDeletable({ deletable: null, deleteIndex: null });
    };

    return (
        <>
            <Box $d="flex" $flexWrap="wrap" $mx="-10">
                {isCustomer && (
                    <Box $w={['100%', cardWidth]} $mx="10">
                        <AddColorContainer onClick={() => setShowAdd(true)}>
                            <Box $d="flex" $alignItems="center">
                                <IconAdd style={{ fontSize: 30 }} />
                                <Box $pl="16">
                                    <Text $textVariant="Badge" $colorScheme="primary">
                                        Add Color
                                    </Text>
                                </Box>
                            </Box>
                        </AddColorContainer>
                    </Box>
                )}
                {!isCustomer && value?.length === 0 && (
                    <Box
                        $d="flex"
                        $w="224"
                        $h="60"
                        $px="16"
                        $py="11"
                        $flexDir="column"
                        $justifyContent="center"
                        $borderW="1"
                        $borderColor="outline-gray"
                        $borderStyle="solid"
                        $mx="10"
                        $mb="20"
                    >
                        <Text $textVariant="Badge" $colorScheme="primary">
                            N/A
                        </Text>
                    </Box>
                )}
                {Array.isArray(value) &&
                    value.length > 0 &&
                    value.map((color, index) => (
                        <Box $w={['100%', cardWidth]} key={index} $mx="10">
                            <AddColorContainer>
                                <BoxPreviewHex width={38} height={38} type={color.type} hex={color.colorValue} />
                                <Box $pl="16">
                                    <Text $w="100" $textVariant="Badge" $colorScheme="primary" $isTruncate>
                                        {color.colorValue}
                                    </Text>
                                    <Text $textVariant="P5" $colorScheme="secondary">
                                        {color.name}
                                    </Text>
                                </Box>
                                {isCustomer && (
                                    <Box $ml="auto" $alignSelf="flex-start">
                                        <Dropdown
                                            trigger={['click']}
                                            overlay={
                                                <DropdownMenu $w="164" $mt="-8">
                                                    <DropdownMenuItem key="edit" onClick={() => setEditable({ editable: color, editIndex: index })}>
                                                        <DropdownMenuItemContent icon={<IconEdit />}>Edit</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem key="delete" onClick={() => setDeletable({ deletable: color, deleteIndex: index })}>
                                                        <DropdownMenuItemContent icon={<IconDelete />}>Delete</DropdownMenuItemContent>
                                                    </DropdownMenuItem>
                                                </DropdownMenu>
                                            }
                                        >
                                            <Box $colorScheme="cta" className="ant-dropdown-link">
                                                <IconOptions style={{ fontSize: 20 }} />
                                            </Box>
                                        </Dropdown>
                                    </Box>
                                )}
                            </AddColorContainer>
                        </Box>
                    ))}
            </Box>
            <Popup open={showAdd} $variant="default" title="Add color" footer={null} onCancel={() => setShowAdd(false)} destroyOnClose>
                <FormColor onAdd={handleAdd} loading={isLoading} />
            </Popup>
            <Popup
                open={editable !== null}
                $variant="default"
                title="Edit color"
                footer={null}
                onCancel={() => setEditable({ editable: null, editIndex: null })}
                destroyOnClose
            >
                <FormColor onAdd={handleEdit} initialValues={editable} loading={isLoading} />
            </Popup>
            <PopupDelete
                title="Are you sure you want to delete this color?"
                $variant="delete"
                open={deletable !== null}
                onOk={handleDelete}
                onCancel={() => setDeletable({ deletable: null, deleteIndex: null })}
                confirmLoading={isLoading}
            >
                <Text $textVariant="P4" $colorScheme="secondary">
                    This action cannot be undone
                </Text>
            </PopupDelete>
        </>
    );
});

export default FieldAddColor;
