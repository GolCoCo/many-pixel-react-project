import React, { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import * as qs from 'query-string';
import {
    ADD_PLAN_SETTING,
    ADMIN_PLAN_SETTING,
    ADMIN_CATEGORY_SETTING,
    ADMIN_PRODUCT_SETTING,
    ADMIN_DESIGN_TYPE_SETTING,
    ADMIN_TOOL_SETTING,
    ADMIN_SNIPPETS_SETTING,
} from '@constants/routes';
import { Box } from '@components/Box';
import { Text } from '@components/Text';
import { Tabs } from '@components/Tabs';
import { Button } from '@components/Button';
import IconAdd from '@components/Svg/IconAdd';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import { PageContainer } from '@components/PageContainer';
import { ADD_DESIGN_TYPE } from '@graphql/mutations/designType';
import { CREATE_CATEGORY } from '@graphql/mutations/category';
import { ADD_SERVICE } from '@graphql/mutations/service';
import { DESIGN_TYPES } from '@graphql/queries/designType';
import { ALL_CATEGORIES } from '@graphql/queries/category';
import { ALL_SERVICES } from '@graphql/queries/service';
import Plans from './Plans';
import Categories from './Categories';
import AddCategory from './Categories/modals/AddCategory';
import Products from './Products';
import AddProduct from './Products/modals/AddProduct';
import DesignTypes from './DesignTypes';
import AddDesignType from './DesignTypes/modals/AddDesignType';
import Tools from './Tools';
import Snippets from './Snippets';

const AdminSettings = memo(({ location }) => {
    const [activeTab, setActiveTab] = useState('PLAN');
    const [buttonFunction, setButtonFunction] = useState(() => {});
    const [isShowAddDesignType, setIsShowAddDesignType] = useState(false);
    const [isShowAddCategory, setIsShowAddCategory] = useState(false);
    const [isShowAddProduct, setIsShowAddProduct] = useState(false);
    const [isProductAdded, setIsProductAdded] = useState(false);
    const [isShowAddSnippet, setIsShowAddSnippet] = useState(false);
    const { refetch: refetchDesignTypes } = useQuery(DESIGN_TYPES, {
        fetchPolicy: 'network-only',
    });
    const { refetch: refetchCategories } = useQuery(ALL_CATEGORIES, {
        variables: {
            orderBy: { position: 'Asc' },
        },
        fetchPolicy: 'cache-first',
    });
    const { refetch: refetchProducts } = useQuery(ALL_SERVICES, {
        variables: { activated: true },
        fetchPolicy: 'network-only',
    });
    const [createDesignType] = useMutation(ADD_DESIGN_TYPE);
    const [createCategory] = useMutation(CREATE_CATEGORY);
    const [createService] = useMutation(ADD_SERVICE);

    const showDesignTypeModal = () => {
        setIsShowAddDesignType(true);
    };

    const showAddSnippet = () => {
        setIsShowAddSnippet(true);
    };

    const showCategoryModal = () => {
        setIsShowAddCategory(true);
    };

    const showProductModal = () => {
        setIsShowAddProduct(true);
    };

    const hideDesignTypeModal = () => {
        setIsShowAddDesignType(false);
    };

    const hideCategoryModal = () => {
        setIsShowAddCategory(false);
    };

    const hideProductModal = () => {
        setIsShowAddProduct(false);
    };

    const handleAddDesignType = useCallback(
        async values => {
            await createDesignType({ variables: { ...values } });
        },
        [createDesignType]
    );

    const handleAddCategory = useCallback(
        async values => {
            await createCategory({ variables: { ...values } });
        },
        [createCategory]
    );

    const handleAddProduct = useCallback(
        async values => {
            await createService({ variables: { ...values } });
            setIsProductAdded(true);
        },
        [createService, setIsProductAdded]
    );

    const handleAfterProductAdded = () => {
        setIsProductAdded(false);
    };

    const handleAddClick = useCallback(() => {
        switch (activeTab) {
            case 'CATEGORY':
                showCategoryModal();
                break;
            case 'PRODUCT':
                showProductModal();
                break;
            case 'DESIGN TYPE':
                showDesignTypeModal();
                break;
            case 'SNIPPETS':
                showAddSnippet();
                break;
            default:
                break;
        }
    }, [activeTab]);

    const handleChangeTab = key => {
        let selectedPath;

        switch (key) {
            case 'PLAN':
                selectedPath = ADMIN_PLAN_SETTING;
                break;
            case 'CATEGORY':
                selectedPath = ADMIN_CATEGORY_SETTING;
                break;
            case 'PRODUCT':
                selectedPath = ADMIN_PRODUCT_SETTING;
                break;
            case 'DESIGN TYPE':
                selectedPath = ADMIN_DESIGN_TYPE_SETTING;
                break;
            case 'TOOL':
                selectedPath = ADMIN_TOOL_SETTING;
                break;
            case 'SNIPPETS':
                selectedPath = ADMIN_SNIPPETS_SETTING;
                break;
            default:
                break;
        }

        window.history.pushState('', '', selectedPath);
        setActiveTab(key);
    };

    const [defaultTab] = useState(() => {
        const parsed = qs.parse(location.search);
        handleChangeTab(parsed.tab ? parsed.tab : 'PLAN');
        return parsed.tab ? parsed.tab : 'PLAN';
    });

    return (
        <DocumentTitle title="Settings | ManyPixels">
            <Basepage>
                <PageContainer $maxW="1232">
                    <Box $d="flex" $justifyContent="space-between" $alignItems="center" $mb="30">
                        <Text hide="mobile" $textVariant="H3">
                            Settings
                        </Text>
                        <Text hide="desktop" $textVariant="H4">
                            Settings
                        </Text>
                        {activeTab === 'PLAN' && (
                            <Link to={ADD_PLAN_SETTING}>
                                <Button type="primary" icon={<IconAdd style={{ fontSize: 20 }} />}>
                                    ADD {activeTab}
                                </Button>
                            </Link>
                        )}
                        {activeTab !== 'TOOL' && activeTab !== 'PLAN' && (
                            <Button onClick={handleAddClick} type="primary" icon={<IconAdd style={{ fontSize: 20 }} />}>
                                ADD {activeTab}
                            </Button>
                        )}
                    </Box>
                    <Box>
                        <Tabs defaultActiveKey={defaultTab} onChange={handleChangeTab}>
                            <Tabs.TabPane tab="Plans" key="PLAN">
                                <Plans />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Categories" key="CATEGORY">
                                <Categories />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Products" key="PRODUCT">
                                <Products isProductAdded={isProductAdded} handleAfterProductAdded={handleAfterProductAdded} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Design Types" key="DESIGN TYPE">
                                <DesignTypes />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Tools" key="TOOL">
                                <Tools />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Snippets" key="SNIPPETS">
                                <Snippets isShowAddSnippet={isShowAddSnippet} setIsShowAddSnippet={setIsShowAddSnippet} />
                            </Tabs.TabPane>
                        </Tabs>
                    </Box>
                    <AddDesignType
                        visible={isShowAddDesignType}
                        onCancel={hideDesignTypeModal}
                        onAdd={handleAddDesignType}
                        refetchDesignTypes={refetchDesignTypes}
                    />
                    <AddCategory visible={isShowAddCategory} onCancel={hideCategoryModal} onAdd={handleAddCategory} refetchCategories={refetchCategories} />
                    <AddProduct visible={isShowAddProduct} onCancel={hideProductModal} onAdd={handleAddProduct} refetchProducts={refetchProducts} />
                </PageContainer>
            </Basepage>
        </DocumentTitle>
    );
});

export default AdminSettings;
