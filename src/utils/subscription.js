export function computeStatusFinal(subscription) {
    if (!subscription?.status) return null;

    const { status, endAt, willPause, plan } = subscription;

    if (typeof endAt === 'string') {
        const nowISO = new Date().toISOString();

        if (endAt < nowISO) {
            if (status === 'canceled') {
                return 'inactive';
            }
        } else {
            return 'canceled';
        }
    }

    if (status === 'active') {
        if (plan?.type) {
            if (plan.type === 'PAUSE') {
                return 'paused';
            }

            if (willPause === false && endAt === null) {
                return 'active';
            }
        }
    }

    return status;
}
