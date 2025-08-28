/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/
  
import { klaviyoCheckoutConsentApi } from '@/klaviyocheckoutconsent/api/klaviyoCheckoutConsentApi';

describe('KlaviyoCheckoutConsent/api/klaviyoCheckoutConsentApi', () => {
  test('returns value', () => {
    const value = klaviyoCheckoutConsentApi();

    expect(value).toEqual('Howdy!');
  });
});
