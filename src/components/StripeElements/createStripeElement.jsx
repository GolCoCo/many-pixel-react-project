import React, { useEffect, useRef } from 'react';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { StripeInput } from './style';
import { isEqual, simpleOmit } from './utils';

const noop = () => {};

const _extractOptions = props => {
    const { id, className, onChange, onFocus, onBlur, onReady, children, value, ...options } = props;
    return simpleOmit(['data-__meta', 'w', 'data-__field'], options);
};

const capitalized = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createStripeElement = (type, hocOptions = {}) => {
    return class extends React.Component {
        static defaultProps = {
            id: undefined,
            className: undefined,
            onChange: noop,
            onBlur: noop,
            onFocus: noop,
            onReady: noop,
        };

        static displayName = `${capitalized(type)}Element`;

        static contextTypes = {
            addElementsLoadListener: PropTypes.func.isRequired,
            registerElement: PropTypes.func.isRequired,
            unregisterElement: PropTypes.func.isRequired,
        };

        constructor(props, context) {
            super(props, context);

            this._element = null;

            const options = _extractOptions(this.props);
            // We keep track of the extracted options on this._options to avoid re-rendering.
            // (We would unnecessarily re-render if we were tracking them with state.)
            this._options = options;
            this.context = context;
        }

        componentDidMount() {
            this.context.addElementsLoadListener(elements => {
                if (!this._ref) {
                    return;
                }

                const element = elements.create(type, this._options);
                this._element = element;

                this._setupEventListeners(element);

                element.mount(this._ref);

                // Register Element for automatic token / source / paymentMethod creation
                this.context.registerElement(element, hocOptions.impliedTokenType, hocOptions.impliedSourceType, hocOptions.impliedPaymentMethodType);
            });
        }

        componentDidUpdate() {
            const options = _extractOptions(this.props);
            if (Object.keys(options).length !== 0 && !isEqual(options, this._options)) {
                this._options = options;
                if (this._element) {
                    this._element.update(options);
                }
            }
        }

        componentWillUnmount() {
            if (this._element) {
                const element = this._element;
                element.destroy();
                this.context.unregisterElement(element);
            }
        }

        handleRef = ref => {
            this._ref = ref;
        };

        context;
        _element;
        _ref;
        _options;

        _setupEventListeners(element) {
            element.on('ready', () => {
                this.props.onReady(this._element);
            });

            element.on('change', ev => {
                // There is no value from stripe-element onchange ev
                // https://stripe.com/docs/js/element/events/on_change?type=cardCvcElement
                if (ev.error) {
                    this.props.onChange({ type: 'error', message: '' });
                } else if (ev.empty) {
                    this.props.onChange({ type: 'error', message: '' });
                } else if (ev.complete) {
                    this.props.onChange({ type: 'success', message: '' });
                } else {
                    this.props.onChange({ type: 'typing', message: '' });
                }
            });

            element.on('blur', (...args) => this.props.onBlur(...args));
            element.on('focus', (...args) => this.props.onFocus(...args));
        }

        render() {
            return <StripeInput id={this.props.id} className={this.props.className} ref={this.handleRef} $w={this.props.$w} />;
        }
    };
};

export const StripeCardInput = ({ type, onChange, onReady, ...props }) => {
    const stripe = useStripe();
    const elements = useElements();
    const elementRef = useRef(null);

    useEffect(() => {
        if (!elements || !stripe) return;

        const element = elements.create(type);
        element.mount(elementRef.current);

        // Set up event listeners
        element.on('ready', () => {
            if (onReady) onReady(element);
        });

        element.on('change', event => {
            if (onChange) onChange(event);
        });

        // Cleanup
        return () => {
            element.destroy();
        };
    }, [elements, stripe, type, onChange, onReady]);

    return <StripeInput ref={elementRef} {...props} />;
};
