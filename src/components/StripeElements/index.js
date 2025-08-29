import { createStripeElement } from './createStripeElement';

export * from './style';
export * from './StripeElements';

export const StripeCardNumber = createStripeElement('cardNumber', {
    impliedTokenType: 'card',
    impliedSourceType: 'card',
    impliedPaymentMethodType: 'card',
});
export const StripeCardExpiry = createStripeElement('cardExpiry');
export const StripeCardCvc = createStripeElement('cardCvc');
