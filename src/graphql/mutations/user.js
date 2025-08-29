import { gql } from '@apollo/client';

export const CHANGE_USER_ROLE = gql`
    mutation UpdateUserRole($id: ID!, $role: String!) {
        updateUser(id: $id, data: { role: $role }) {
            id
            role
        }
    }
`;

export const UPDATE_SUBSCRIBE_NEWSLETTER = gql`
    mutation UpdateSubscribeNewsletter($id: ID!, $subscribeNewsletter: Boolean!) {
        updateUser(id: $id, data: { subscribeNewsletter: $subscribeNewsletter }) {
            id
            subscribeNewsletter
        }
    }
`;

export const UPDATE_USER_PICTURE = gql`
    mutation UpdateUserPicture($fileId: ID!, $userId: ID!) {
        setUserPicture(fileId: $fileId, id: $userId) {
            id
        }
    }
`;

export const DELETE_USER_PICTURE = gql`
    mutation DeleteUserPicture($userId: ID!) {
        setUserPicture(fileId: null, id: $userId) {
            id
        }
    }
`;

export const UPDATE_PROFILE = gql`
    mutation UpdateUserProfile($userId: ID!, $firstname: String!, $lastname: String!, $email: String!, $jobtitle: String) {
        updateUserProfile(id: $userId, firstname: $firstname, lastname: $lastname, email: $email, job: $jobtitle) {
            id
            firstname
            lastname
            email
            job
            companyRole
        }
    }
`;

export const UPDATE_USER_PASSWORD = gql`
    mutation UpdateUserPassword($userId: ID!, $currentpassword: String!, $newpassword: String!) {
        updateUserPassword(id: $userId, oldPassword: $currentpassword, newPassword: $newpassword) {
            id
        }
    }
`;

export const UPDATE_COMPANY_INFORMATION = gql`
    mutation updateUserCompany(
        $userId: ID
        $name: String
        $website: String
        $nbEmployees: String
        $industry: String
        $timezone: String
        $logoId: ID
        $companyId: ID
    ) {
        updateUserCompany(
            companyId: $companyId
            id: $userId
            name: $name
            website: $website
            nbEmployees: $nbEmployees
            industry: $industry
            timezone: $timezone
            logoId: $logoId
        ) {
            id
        }
    }
`;

export const SET_COMPANY_INFORMATION = gql`
    mutation SetCompanyInformation($id: ID!, $userInfo: UserInfoInput!) {
        setCompanyInformation(id: $id, userInfo: $userInfo) {
            id
        }
    }
`;

export const USER_UPDATE_SPECIALITIES = gql`
    mutation USER_UPDATE_SPECIALITIES($id: ID!, $specialitiesIds: [ID!]!) {
        updateUserSpecialities(id: $id, specialitiesIds: $specialitiesIds) {
            id
            specialities {
                id
                name
            }
        }
    }
`;

export const SET_USER_ARCHIVED = gql`
    mutation SetUserArchived($id: ID!, $archived: Boolean) {
        updateUser(id: $id, data: { isArchived: $archived }) {
            id
            archived
        }
    }
`;

export const CUSTOMER_JOIN_TEAM = gql`
    mutation customerJoinTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { customers: { connect: { id: $id } } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const CUSTOMER_LEAVE_TEAM = gql`
    mutation customerLeaveTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { customers: { disconnect: { id: $id } } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const DELETE_USER_FROM_TEAM = gql`
    mutation deleteUserFromTeam($email: String!) {
        deleteUserFromTeam(email: $email) {
            id
        }
    }
`;

export const DESIGNER_JOIN_TEAM = gql`
    mutation designerJoinTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { designers: { create: { designerId: $id } } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const DESIGNER_LEAVE_TEAM = gql`
    mutation designerLeaveTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { designers: { delete: { teamId_designerId: { designerId: $id, teamId: $teamId } } } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const TEAM_LEADER_LEAVE_TEAM = gql`
    mutation teamLeaderLeaveTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { teamLeaders: { deleteMany: [{ teamId: $teamId, teamLeaderId: $id }] } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const TEAM_LEADER_JOIN_TEAM = gql`
    mutation teamLeaderJoinTeam($id: ID!, $teamId: ID!) {
        updateTeam(data: { teamLeaders: { create: { teamLeaderId: $id } } }, where: { id: $teamId }) {
            id
            name
        }
    }
`;

export const UPDATE_USER_DESIGN_TYPE = gql`
    mutation updateUserByPrisma($id: ID!, $specialitiesIds: [DesignTypeToUserCreateData!]) {
        updateUser(id: $id, data: { specialities: { create: $specialitiesIds } }) {
            id
            firstname
        }
    }
`;

export const UPDATE_USER_ACTIVATION = gql`
    mutation updateUserByPrisma($id: ID!, $activated: Boolean) {
        updateUser(id: $id, data: { isActivated: $activated, isArchived: $activated }) {
            id
        }
    }
`;

export const DISCONNECT_USER_DESIGN_TYPE = gql`
    mutation updateUserByPrisma($id: ID!, $specialitiesIds: [DesignTypeIdUserId!]) {
        updateUser(id: $id, data: { specialities: { deleteMany: $specialitiesIds } }) {
            id
            firstname
        }
    }
`;

export const DISCONNECT_ASSIGN_ORDERS = gql`
    mutation updateUserByPrisma($id: ID!) {
        updateUser(id: $id, data: { workProjects: { set: null } }) {
            id
            firstname
        }
    }
`;

export const DISCONNECT_ASSIGN_COMPANIES = gql`
    mutation updateUser($id: ID!, $assignedCompaniesIds: [AssignmentWhereUniqueInput!]) {
        updateUser(id: $id, data: { assignedCustomers: { delete: $assignedCompaniesIds } }) {
            id
            firstname
        }
    }
`;

export const DELETE_USER_ACCOUNT = gql`
    mutation deleteUserAccount($userId: ID!, $companyId: ID!) {
        deleteAccount(userId: $userId, companyId: $companyId) {
            id
        }
    }
`;
