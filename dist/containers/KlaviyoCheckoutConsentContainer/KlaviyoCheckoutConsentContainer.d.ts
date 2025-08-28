import { HTMLAttributes } from 'preact/compat';
import { Container } from '@dropins/tools/types/elsie/src/lib';

export interface KlaviyoCheckoutConsentContainerProps extends HTMLAttributes<HTMLDivElement> {
    checked: boolean;
    enable_sms_consent: boolean;
    enable_email_consent: boolean;
    sms_consent_label: string;
    email_consent_label: string;
    sms_consent_name: string;
    email_consent_name: string;
    sms_disclosure: string;
}
export declare const KlaviyoCheckoutConsentContainer: Container<KlaviyoCheckoutConsentContainerProps>;
export declare const KlaviyoApiCreateUpdate: (checkoutData: object, addressData: object, emailConsent: boolean, emailListCode: string, smsConsent: boolean, smsListCode: string, meshApiPoint: string) => Promise<object | null>;
//# sourceMappingURL=KlaviyoCheckoutConsentContainer.d.ts.map