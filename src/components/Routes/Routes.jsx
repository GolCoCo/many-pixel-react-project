import React, { useEffect, useCallback } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import history from '@constants/history';
import * as routes from '@constants/routes';
import { USER_TYPE_OWNER, USER_TYPE_MANAGER, USER_TYPE_WORKER, USER_TYPE_CUSTOMER } from '@constants/account';
import { ME } from '@graphql/queries/userConnected';
import Logout from '@pages/Public/Logout';
import SignIn from '@pages/Public/SignIn';
import Onboarding from '@pages/Public/Onboarding';
import PageNotFound from '@pages/Public/PageNotFound';
import ResetPassword from '@pages/Public/ResetPassword';
import Notifications from '@pages/Public/Notifications';
import PasswordForget from '@pages/Public/PasswordForget';
import OnboardingMember from '@pages/Public/OnboardingMember';
import Profile from '@pages/Public/Profile';
import EditPlan from '@pages/Public/Profile/EditPlan';
import AdminCompany from '@pages/Admin/Company';
import ManageTeam from '@pages/Admin/Company/TeamMembers';
import AdminRequests from '@pages/Admin/Requests';
import AdminRequestDetails from '@pages/Admin/Requests/DetailRequest';
import AdminPlanning from '@pages/Admin/Planning';
import AdminSettings from '@pages/Admin/Settings';
import AdminCustomers from '@pages/Admin/Customers';
import AdminAccount from '@pages/Admin/Account';
import AddPlanSetting from '@pages/Admin/Settings/Plans/AddPlanSetting';
import EditPlanSetting from '@pages/Admin/Settings/Plans/EditPlanSetting';
import PlanDetails from '@pages/Admin/Settings/Plans/PlanDetails';
import CategoryDetails from '@pages/Admin/Settings/Categories/CategoryDetails';
import ProductDetails from '@pages/Admin/Settings/Products/ProductDetails';
import WorkerRequests from '@pages/Worker/Requests';
import WorkerPlanning from '@pages/Worker/Planning';
import Team from '@pages/Customer/Team';
import Brands from '@pages/Customer/Brands';
import Requests from '@pages/Customer/Requests';
import BrandDetail from '@pages/Customer/Brands/BrandDetail';
import EditRequest from '@pages/Customer/Requests/EditRequest';
import CreateRequest from '@pages/Customer/Requests/CreateRequest';
import DetailRequest from '@pages/Customer/Requests/DetailRequest';
import FeedbackRequest from '@pages/Customer/Requests/FeedbackRequest';
import DuplicateRequest from '@pages/Customer/Requests/DuplicateRequest';
import Members from '@pages/Admin/Members';
import { LoadingWithLogo } from '@components/LoadingWithLogo';

import ConnectAs from '@pages/ConnectAs';
import SnippetDetails from '@pages/Admin/Settings/Snippets/SnippetDetails';

const ensureAuth = (props, component, redirectComponent, adminComponent, workerComponent, passViewer) => {
    if (localStorage.getItem('token') || passViewer) {
        const AuthComponent = component;
        const {
            loading,
            error,
            data = {},
        } = useQuery(ME, {
            fetchPolicy: 'network-only',
        });
        const newProps = { ...props };

        if (loading) return <LoadingWithLogo $w="100%" $h="100vh" />;

        if (error) {
            return <Redirect to={routes.LOG_OUT} />;
        }

        const { user } = data;

        if (!user && !passViewer) {
            return <Redirect to={routes.LOG_OUT} />;
        }

        newProps.viewer = user;

        if (
            user &&
            user.role === USER_TYPE_CUSTOMER &&
            ((user.company?.onboarding !== 5 && !user.activated) ||
                (user.company.onboarding === 5 && !user.activated)) &&
            props.match.url !== routes.ONBOARD
        ) {
            return <Redirect to={routes.ONBOARD} />;
        }

        if (user && (user.role === USER_TYPE_OWNER || user.role === USER_TYPE_MANAGER)) {
            const AuthAdminComponent = adminComponent;
            return <AuthAdminComponent {...newProps} key={Math.random()} />;
        }

        if (user && user.role === USER_TYPE_WORKER) {
            const AuthWorkerComponent = workerComponent;
            return <AuthWorkerComponent {...newProps} key={Math.random()} />;
        }

        return <AuthComponent {...newProps} key={Math.random()} />;
    }

    if (redirectComponent) {
        const RedirectComponent = redirectComponent;
        return <RedirectComponent {...props} />;
    }

    const {
        match: { url: redirectUrl },
    } = props;

    const redirectTo = {
        pathname: routes.SIGN_IN,
        state: { redirectUrl },
    };

    return <Redirect to={redirectTo} />;
};

const ensureNotAuth = component => {
    if (localStorage.getItem('token')) return <Redirect to={routes.REQUESTS} />;
    return component;
};

const openPages = [routes.ONBOARD, routes.SIGN_IN];

const Routes = () => {
    const { pathname, search } = history.location;

    const appendHeadWithNoCrawl = useCallback((pathnameArg, searchArg) => {
        const noCrawl = document.createElement('meta');

        if (!openPages.includes(pathnameArg + searchArg)) {
            noCrawl.setAttribute('name', 'robots');
            noCrawl.setAttribute('content', 'noindex');
            document.head.appendChild(noCrawl);
        }

        return () => noCrawl.remove();
    }, []);

    const appendHeadWithCanonical = useCallback(pathnameArg => {
        const canonical = document.createElement('link');

        if (routes.ONBOARD === pathnameArg) {
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', window.location.origin + pathnameArg);
            document.head.appendChild(canonical);
        }

        return () => canonical.remove();
    }, []);

    useEffect(() => {
        let removeNoCrawl = appendHeadWithNoCrawl(pathname, search);
        let removeCanonical = appendHeadWithCanonical(pathname);

        const unRegister = history.listen(({ pathnameArg, searchArg }) => {
            removeNoCrawl();
            removeCanonical();
            removeNoCrawl = appendHeadWithNoCrawl(pathnameArg, searchArg);
            removeCanonical = appendHeadWithCanonical(pathnameArg);
        });

        return unRegister;
    }, [appendHeadWithNoCrawl, appendHeadWithCanonical, pathname, search]);

    return (
        <Router history={history}>
            <Switch>
                <Route exact path={routes.ONBOARD} component={Onboarding} />
                <Route
                    exact
                    path={routes.ONBOARD_MEMBER}
                    component={props => ensureNotAuth(<OnboardingMember {...props} />)}
                />
                <Route exact path={routes.SIGN_IN} component={props => ensureNotAuth(<SignIn {...props} />)} />
                <Route exact path={routes.LOG_OUT} component={Logout} />
                <Route exact path={routes.PASSWORD_FORGET} component={PasswordForget} />
                <Route exact path={routes.PASSWORD_RESET} component={ResetPassword} />
                <Route
                    exact
                    path={routes.PROFILE}
                    component={props => ensureAuth(props, Profile, null, Profile, Profile)}
                />
                <Route exact path={routes.EDIT_PLAN} component={props => ensureAuth(props, EditPlan)} />
                <Route
                    exact
                    path={routes.REQUESTS}
                    component={props => ensureAuth(props, Requests, null, AdminRequests, WorkerRequests)}
                />
                <Route exact path={routes.CREATE_REQUEST} component={props => ensureAuth(props, CreateRequest)} />
                <Route exact path={routes.EDIT_REQUEST} component={props => ensureAuth(props, EditRequest)} />
                <Route exact path={routes.DUPLICATE_REQUEST} component={props => ensureAuth(props, DuplicateRequest)} />
                <Route
                    exact
                    path={routes.FEEDBACK_REQUEST}
                    component={props => ensureAuth(props, FeedbackRequest, null, FeedbackRequest, FeedbackRequest)}
                />
                <Route
                    exact
                    path={routes.DETAIL_REQUEST}
                    component={props =>
                        ensureAuth(props, DetailRequest, null, AdminRequestDetails, AdminRequestDetails)
                    }
                />
                <Route exact path={routes.BRANDS} component={props => ensureAuth(props, Brands)} />
                <Route
                    exact
                    path={routes.BRAND}
                    component={props => ensureAuth(props, BrandDetail, null, BrandDetail, BrandDetail)}
                />
                <Route exact path={routes.TEAM} component={props => ensureAuth(props, Team)} />
                <Route
                    exact
                    path={routes.NOTIFICATIONS}
                    component={props => ensureAuth(props, Notifications, null, Notifications, Notifications)}
                />
                {/* <Route exact path={routes.REFERRAL} component={props => ensureAuth(props, Referral)} /> */}
                <Route
                    exact
                    path={routes.PLANNING}
                    component={props => ensureAuth(props, null, null, AdminPlanning, WorkerPlanning)}
                />
                <Route
                    exact
                    path={routes.MANAGE_COMPANY}
                    component={props => ensureAuth(props, null, null, AdminCompany)}
                />
                <Route
                    exact
                    path={routes.CUSTOMERS}
                    component={props => ensureAuth(props, null, null, AdminCustomers)}
                />
                <Route
                    exact
                    path={routes.MANAGE_TEAM}
                    component={props => ensureAuth(props, null, null, ManageTeam, ManageTeam)}
                />
                <Route exact path={routes.SETTINGS} component={props => ensureAuth(props, null, null, AdminSettings)} />
                <Route
                    exact
                    path={routes.ADD_PLAN_SETTING}
                    component={props => ensureAuth(props, null, null, AddPlanSetting)}
                />
                <Route
                    exact
                    path={routes.EDIT_PLAN_SETTING}
                    component={props => ensureAuth(props, null, null, EditPlanSetting)}
                />
                <Route
                    exact
                    path={routes.PLAN_DETAILS}
                    component={props => ensureAuth(props, null, null, PlanDetails)}
                />
                <Route
                    exact
                    path={routes.CATEGORY_DETAILS}
                    component={props => ensureAuth(props, null, null, CategoryDetails)}
                />
                <Route
                    exact
                    path={routes.PRODUCT_DETAILS}
                    component={props => ensureAuth(props, null, null, ProductDetails)}
                />
                <Route
                    exact
                    path={routes.SNIPPET_DETAILS}
                    component={props => ensureAuth(props, null, null, SnippetDetails)}
                />
                <Route
                    exact
                    path={routes.ACCOUNT_INFO}
                    component={props => ensureAuth(props, null, null, AdminAccount, AdminAccount)}
                />
                <Route
                    exact
                    path={routes.CONNECT_AS}
                    component={props => ensureAuth(props, ConnectAs, null, ConnectAs, ConnectAs)}
                />
                <Route
                    exact
                    path={routes.MEMBER_INFO}
                    component={props => ensureAuth(props, null, null, Members, Members)}
                />
                <Route
                    exact
                    path="/"
                    component={props => ensureAuth(props, Requests, null, AdminRequests, WorkerRequests)}
                />
                <Route component={props => ensureAuth(props, PageNotFound, PageNotFound, PageNotFound, PageNotFound)} />
            </Switch>
        </Router>
    );
};
export default Routes;
