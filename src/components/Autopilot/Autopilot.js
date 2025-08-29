import { memo, useEffect } from 'react';
import withLoggedUser from '../WithLoggedUser';

const Autopilot = memo(({ viewer }) => {
    useEffect(() => {
        if (viewer && viewer.role === 'customer') {
            const { email, firstname, lastname } = viewer;

            if (window.Autopilot) {
                window.Autopilot.run('associate', {
                    Email: email,
                    FirstName: firstname,
                    LastName: lastname,
                });
            }
        }
    }, [viewer]);

    return null;
});

export default withLoggedUser(Autopilot);
