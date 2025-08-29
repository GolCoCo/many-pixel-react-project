export const PLAN_YEARLY = {
    name: 'YEARLY',
    division: 'yr',
    reduction: 20,
    colorScheme: 'other-pink',
};

export const PLAN_BIANNUALLY = {
    name: 'BIANNUALLY',
    division: 'bn',
    reduction: 15,
    colorScheme: 'other-blue',
};

export const PLAN_QUARTERLY = {
    name: 'QUARTERLY',
    division: 'qtr',
    reduction: 10,
    colorScheme: 'other-yellow',
};

export const PLAN_MONTHLY = {
    name: 'MONTHLY',
    division: 'm',
};

export const PLANS = [PLAN_YEARLY, PLAN_BIANNUALLY, PLAN_QUARTERLY, PLAN_MONTHLY];
export const PLANS_REVERSE = [PLAN_MONTHLY, PLAN_QUARTERLY, PLAN_BIANNUALLY, PLAN_YEARLY];
