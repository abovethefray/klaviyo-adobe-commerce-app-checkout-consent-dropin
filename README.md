# Klaviyo Checkout Consent Drop-in

Klaviyo Checkout Consent drop-in is an extension drop-in of Klaviyo Adobe Commerce app builder app.

This drop-in adds 2 consent checkboxes (email and sms) in the checkout page which will then submit an API call to Klaviyo for profile update/create. This drop-in requires the Klaviyo Adobe Commerce app builder app as this drop-in utilizes the apps API mesh integration.

---

## Requirements

- Adobe Commerce Storefront - built from [Adobe Commerce Storefront Boilerplate](https://github.com/hlxsites/aem-boilerplate-commerce)
- Klaviyo Adobe Commerce App Builder app
- Klaviyo Account

> [!NOTE]
> Make sure that your Klaviyo app builder is set up and working properly before installing this drop-in (e.g. API mesh and Klaviyo credentials re working properly). Refer to the app builder installation instructions.

## Workflow

1. After proceeding to checkout, the user can opt-in to check the consent boxes; email or sms.
2. After placing order, the drop-in will check if the email currently has an existing profile, if none, it will create the profile based on your email and billing address details.
3. After profile creation, the drop-in will subscribe the profile based on the consent checkboxes the user filled in. 

> [!NOTE]
> The workflow doesn’t interrupt the place order process. If one Klaviyo related API call fails, the order will still be processed.

## Installation Steps

### Follow these steps to set up the drop-in in your Adobe Commerce Storefront

### 1. Update config.json

In your Adobe Commerce Storefront boilerplate repo, locate config.json and add the following values under <b>default</b>.

```json
"api-mesh-endpoint": "https://edge-sandbox-graph.adobe.io/api/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/graphql",
"klaviyo": {
   "profileList": {
      "sms": "XXXXXX",
      "email": "YYYYYY"
   },
   "consent": {
      "checked": false,
      "enable_sms_consent": true,
      "enable_email_consent": true,
      "sms_consent_label": "Subscribe for SMS updates ",
      "email_consent_label": "Subscribe for email updates",
      "sms_consent_name": "klaviyo_sms_consent",
      "email_consent_name": "klaviyo_email_consent",
      "sms_disclosure": "* By checking this box and entering your phone number above, you consent to receive marketing text messages (e.g. promos, cart reminders)."
   }
}
```

1. **api-mesh-endpoint**: The endpoint URL provided by the Klaviyo Adobe Commerce App Builder app.
   - In the App builder side, there will be another instructions on how to setup the Klaviyo credentials 
2. **klaviyo.profileList.sms** & **klaviyo.profileList.email**: identifier of SMS and email list in the Klaviyo admin. **Admin** > **List & segments** > *Select SMS or email list > *See the URL for the identifier ```https://www.klaviyo.com/list/XXXXXX```.
3. **klaviyo.consent.enable_sms_consent** & **klaviyo.consent.enable_email_consent**: disables either email or SMS checkbox based on the value provided.

### 2. Install the Drop-in

The drop-in package is currently only available via [GitHub packages](https://github.com/abovethefray/klaviyo-adobe-commerce-app-checkout-consent-dropin/pkgs/npm/klaviyo-adobe-commerce-app-checkout-consent-dropin) and not in npmjs. Because of this, you will have to setup the following.

1. In your GitHub, go to **Settings** > **Developer Settings** > **Personal Access Token** > **Tokens (classic)**.
2. Generate a new personal access token (classic) with atleast the scope of **read:packages** 
3. Copy the generated token 
4. In your terminal, run
   ```bash
   npm login --scope=@abovethefray --auth-type=legacy --registry=https://npm.pkg.github.com
   ```
5. It will ask for your GitHub username and password which will be your **GENERATED PERSONAL TOKEN**.
6. After success you should be able to run
   ```bash
   npm install @abovethefray/klaviyo-adobe-commerce-app-checkout-consent-dropin
   ```

### 3. Update commerce checkout block JS file from the boilerplate

Currently, there is no other way to install the drop-in without updating the file where you want the drop-in to display. You have to manually import and configure the file. Locate the file ```blocks/commerce-checkout/commerce-checkout.js```.

1. Import the drop-in container
   - ```js
     // Klaviyo
     import { KlaviyoCheckoutConsentContainer, KlaviyoApiCreateUpdate } from '../../node_modules/@abovethefray/klaviyo-adobe-commerce-app-checkout-consent-dropin/dist/containers/KlaviyoCheckoutConsentContainer.js';
     ```
2. Add an element to hook the container into. In **line 148** you will see the element structure. Insert the code below between **checkout__billing-form** & **checkout__terms-and-conditions**
   - ```html
     <div class="checkout__block checkout__billing-form"></div> // native element
     <div class="checkout__block checkout__checkout-consent"></div>
     <div class="checkout__block checkout__terms-and-conditions"></div> // native element
     ``` 
3. Declare a variable that targets the created element. You can add this line below **line 213**
   - ```js
     const $termsAndConditions = checkoutFragment.querySelector('.checkout__terms-and-conditions'); //native code
     const $checkoutConsent = checkoutFragment.querySelector('.checkout__checkout-consent');
     ```
4. Declare a variable that targets the config updates from ```config.json```. You can add below **line 232**.
   - ```js
     // Klaviyo endpoint
     const klaviyoVariables = await getConfigValue('klaviyo');
     ```
5. Add the drop-in renderer. You can add this above the **TermsAndConditions** render / below **line 459**
   - ```js
     CheckoutProvider.render(KlaviyoCheckoutConsentContainer, {
       checked: klaviyoVariables.consent.checked,
       enable_sms_consent: klaviyoVariables.consent.enable_sms_consent,
       enable_email_consent: klaviyoVariables.consent.enable_email_consent,
       sms_consent_label: klaviyoVariables.consent.sms_consent_label,
       email_consent_label: klaviyoVariables.consent.email_consent_label,
       sms_consent_name: klaviyoVariables.consent.sms_consent_name,
       email_consent_name: klaviyoVariables.consent.email_consent_name,
       sms_disclosure: klaviyoVariables.consent.sms_disclosure,
     })($checkoutConsent),
     
     CheckoutProvider.render(TermsAndConditions, { // native line of code
     ```
6. Add the function to be included on the native ```handlePlaceOrder()```. You can declare this function after the renderers.
   - ```js
     async function initKlaviyo() {
       const klaviyoList = klaviyoVariables;
       const apiMeshEndpoint = await getConfigValue('api-mesh-endpoint');
       const klaviyoEmailConsent = document.querySelector('[name="klaviyo_email_consent"]');
       const klaviyoSmsConsent = document.querySelector('[name="klaviyo_sms_consent"]');
       let klaviyoEmailConsentStatus = false;
       let klaviyoSmsConsentStatus = false;

       if (klaviyoEmailConsent?.checked) {
         klaviyoEmailConsentStatus = true;
       }

       if (klaviyoSmsConsent?.checked) {
         klaviyoSmsConsentStatus = true;
       }

       await KlaviyoApiCreateUpdate(
         events.lastPayload('checkout/values'),
         events.lastPayload('checkout/addresses/shipping'),
         klaviyoEmailConsentStatus,
         klaviyoList.profileList.email,
         klaviyoSmsConsentStatus,
         klaviyoList.profileList.sms,
         apiMeshEndpoint,
       );
     }
     ```
7. Declare the function inside ```handlePlaceOrder()```. Insert the code after the **displayOverlaySpinner()** function.
   - ```js
     try {
       await initKlaviyo();
     } catch (error) {
       console.error('Error executing Klaviyo API:', error);
     }
     ```

### 4. Update commerce checkout block CSS file from the boilerplate

You need to add the following styles in order to fix some of the display behavior like no item in checkout / error in checkout. Add the code at the top of the file.

```css
.checkout__content--empty .checkout__checkout-consent,
.checkout__content--error .checkout__checkout-consent {
   display: none !important;
}
```

### 4. Test Changes Localally
   ```bash
   npm start
   ```


## SMS Consent

For the SMS consent subscription to work, you need to configure the SMS settings in the Klaviyo admin. Head to **Klaviyo Admin** > **Settings** > **SMS**

Klaviyo is strick regarding the format/syntax of the number provided in the sms subscribe API call. You might need to add additional validations on the telephone input in the billing form and add address. Sample accepted syntax: ```+12345678900```, ```+12-345-678-900```, ```(+1234) 567 8900```. See https://help.klaviyo.com/hc/en-us/articles/360046055671 for more details.

Wrong format/syntax will result to API call fail of SMS subscribe.

SMS subscribe will only accept countries assigned from the SMS settings in Klaviyo Admin. Wrong country code in the phone number will result to API call fail. 
