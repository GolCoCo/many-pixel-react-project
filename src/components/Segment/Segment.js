import { memo, useEffect } from 'react';
import withLoggedUser from '../WithLoggedUser';

const Segment = memo(({ viewer }) => {
    useEffect(() => {
        if (viewer && viewer.role === 'customer' && window && window.analytics) {
            const { id, email, firstname, lastname } = viewer;

            window.analytics.identify(id, {
                email,
                firstName: firstname,
                lastName: lastname,
            });
        }
    }, [viewer]);

    return null;
});

export default withLoggedUser(Segment);
