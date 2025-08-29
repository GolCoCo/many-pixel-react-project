import React from 'react';
import { Link } from 'react-router-dom';
import { Basepage } from '@components/Basepage';
import DocumentTitle from '@components/DocumentTitle';
import T1 from '@pages/Public/PageNotFound/T1/T1';
import { HOME } from '@constants/routes';
import { Container, Text } from './style.js';

const PageNotFound = props => {
    if (props.viewer) {
        return (
            <DocumentTitle title="404 Error">
                <Basepage>
                    <Container>
                        <T1>Oh no! We couldn't find the page you were looking for.</T1>
                        <Text>
                            Let me help you coming back on the <Link to={HOME}>homepage</Link>
                        </Text>
                    </Container>
                </Basepage>
            </DocumentTitle>
        );
    }

    return (
        <Container>
            <T1>Oh no! We couldn't find the page you were looking for.</T1>
            <Text>
                Let me help you by coming back on the <Link to="/">homepage</Link>
            </Text>
        </Container>
    );
};

export default PageNotFound;
