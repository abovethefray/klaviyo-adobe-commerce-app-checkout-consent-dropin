/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/
  
// https://storybook.js.org/docs/7.0/preact/writing-stories/introduction
import type { Meta, StoryObj } from '@storybook/preact';
import { KlaviyoCheckoutConsentComponent as component, KlaviyoCheckoutConsentComponentProps } from '@/klaviyocheckoutconsent/components/KlaviyoCheckoutConsentComponent';

/**
 * Use KlaviyoCheckoutConsentComponents to [replace this text with components purpose].
 */
const meta: Meta<KlaviyoCheckoutConsentComponentProps> = {
  title: 'Components/KlaviyoCheckoutConsentComponent',
  component,
  argTypes: {
    checked: {
      description: 'Set checkbox state',
      table: {
        type: { summary: 'boolean' }
      },
    }
  },
};

export default meta;

type Story = StoryObj<KlaviyoCheckoutConsentComponentProps>;

/**
 * <KlaviyoCheckoutConsentComponent>👋 Hello from your new KlaviyoCheckoutConsentComponent story!</KlaviyoCheckoutConsentComponent>
 */
export const KlaviyoCheckoutConsentComponent: Story = {
  args: {
    label: "Checkbox Label",
    name: "checkbox_name",
    checked: false
  },
};
