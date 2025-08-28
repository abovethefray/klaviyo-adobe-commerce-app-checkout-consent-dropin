/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/
  
import { FunctionComponent } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { classes } from '@adobe-commerce/elsie/lib';
import { Checkbox } from '@adobe-commerce/elsie/components/Checkbox';
import '@/klaviyocheckoutconsent/components/KlaviyoCheckoutConsentComponent/KlaviyoCheckoutConsentComponent.css';

export interface KlaviyoCheckoutConsentComponentProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  label: string;
}

export const KlaviyoCheckoutConsentComponent: FunctionComponent<KlaviyoCheckoutConsentComponentProps> = ({
    className,
    checked,
    name,
    label,
    ...props
}) => {
  return (
    <div {...props} className={classes(['klaviyocheckoutconsent-klaviyo-checkout-consent-component', className])}>
      <Checkbox name={name} label={label} checked={checked} />
    </div>
  );
};
