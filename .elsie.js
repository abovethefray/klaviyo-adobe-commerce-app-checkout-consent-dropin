/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/

module.exports = {
  name: 'KlaviyoCheckoutConsent',
  api: {
    root: './src/api',
    importAliasRoot: '@/klaviyocheckoutconsent/api',
  },
  components: [
    {
      id: 'Components',
      root: './src/components',
      importAliasRoot: '@/klaviyocheckoutconsent/components',
      cssPrefix: 'klaviyocheckoutconsent',
      default: true,
    },
  ],
  containers: {
    root: './src/containers',
    importAliasRoot: '@/klaviyocheckoutconsent/containers',
  },
  schema: {
    endpoint: process.env.ENDPOINT,
    headers: {}
  }
};
