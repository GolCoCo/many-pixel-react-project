import React from 'react';
import PropTypes from 'prop-types';
import { stripeElementsConfig } from './style';

export const injectContextTypes = {
    getRegisteredElements: PropTypes.func.isRequired,
    elements: PropTypes.object,
};

export const elementContextTypes = {
    addElementsLoadListener: PropTypes.func.isRequired,
    registerElement: PropTypes.func.isRequired,
    unregisterElement: PropTypes.func.isRequired,
};

export const providerContextTypes = {
    tag: PropTypes.string.isRequired,
    stripe: PropTypes.object,
    addStripeLoadListener: PropTypes.func,
};

export default class StripeElements extends React.Component {
    static childContextTypes = {
        ...injectContextTypes,
        ...elementContextTypes,
    };
    static contextTypes = providerContextTypes;
    static defaultProps = {
        children: null,
    };

    constructor(props, context) {
        super(props, context);

        if (this.context?.tag === 'sync') {
            this._elements = this.context.stripe.elements(stripeElementsConfig);
        }

        this.state = {
            registeredElements: [],
        };
    }

    getChildContext() {
        return {
            addElementsLoadListener: fn => {
                // Return the existing elements instance if we already have one.
                if (this.context?.tag === 'sync') {
                    // This is impossible, but we need to make flow happy.
                    if (!this._elements) {
                        throw new Error('Expected elements to be instantiated but it was not.');
                    }

                    fn(this._elements);
                } else {
                    this.context.addStripeLoadListener(stripe => {
                        if (this._elements) {
                            fn(this._elements);
                        } else {
                            this._elements = stripe.elements(stripeElementsConfig);
                            fn(this._elements);
                        }
                    });
                }
            },
            registerElement: this.handleRegisterElement,
            unregisterElement: this.handleUnregisterElement,
            getRegisteredElements: () => this.state.registeredElements,
            elements: this._elements,
        };
    }

    props;
    context;
    _elements = null;

    handleRegisterElement = (element, impliedTokenType, impliedSourceType, impliedPaymentMethodType) => {
        this.setState(prevState => ({
            registeredElements: [
                ...prevState.registeredElements,
                {
                    element,
                    ...(impliedTokenType ? { impliedTokenType } : {}),
                    ...(impliedSourceType ? { impliedSourceType } : {}),
                    ...(impliedPaymentMethodType ? { impliedPaymentMethodType } : {}),
                },
            ],
        }));
    };

    handleUnregisterElement = el => {
        this.setState(prevState => ({
            registeredElements: prevState.registeredElements.filter(({ element }) => element !== el),
        }));
    };

    render() {
        return React.Children.only(this.props.children);
    }
}
