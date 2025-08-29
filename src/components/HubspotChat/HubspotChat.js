import { withResponsive } from '@components/ResponsiveProvider';
import { memo, useEffect } from 'react';
import withLoggedUser from '../WithLoggedUser';

const HubspotChat = memo(({ viewer, windowWidth }) => {
    const isMobile = windowWidth <= 768;
    useEffect(() => {
        if (viewer && viewer.role === 'customer' && process.env.NODE_ENV === 'production') {
            if (isMobile) {
                if (window && window.HubSpotConversations && window.HubSpotConversations.widget) {
                    const status = window.HubSpotConversations.widget.status();
                    if (status.loaded) {
                        window.HubSpotConversations.widget.remove();
                    }
                }
            } else {
                const { email, tokenHubspot } = viewer;

                if (tokenHubspot) {
                    window.hsConversationsSettings = {
                        identificationEmail: email,
                        identificationToken: tokenHubspot,
                    };
                }
                if (window && window.HubSpotConversations && window.HubSpotConversations.widget) {
                    window.HubSpotConversations.widget.load();
                }

                return () => {
                    if (window && window.HubSpotConversations && window.HubSpotConversations.widget) {
                        window.HubSpotConversations.widget.remove();
                    }
                };
            }
        }
        return () => {};
    }, [viewer, isMobile]);

    return null;
});

export default withResponsive(withLoggedUser(HubspotChat));
