/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this 
 * file in accordance with the terms of the Adobe license agreement 
 * accompanying it. 
 *******************************************************************/
  
import { HTMLAttributes } from 'preact/compat';
import { Container } from '@adobe-commerce/elsie/lib';
import { checkIfEmailExist, subscribeProfile, createProfile }  from '@/klaviyocheckoutconsent/api';
import { KlaviyoCheckoutConsentComponent } from '@/klaviyocheckoutconsent/components';

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
    
export const KlaviyoCheckoutConsentContainer: Container<KlaviyoCheckoutConsentContainerProps> = ({
  enable_sms_consent,
  enable_email_consent,
  sms_consent_label,
  email_consent_label,
  sms_consent_name,
  email_consent_name,
  checked,
  sms_disclosure,
  ...props
}) => {
  return (
    <div {...props}>
      <div {...props}>
        {enable_email_consent && (
          <KlaviyoCheckoutConsentComponent label={email_consent_label} name={email_consent_name} checked={checked}/>
        )}
        {enable_sms_consent && (
            <div className="sms-consent">
              <KlaviyoCheckoutConsentComponent label={sms_consent_label} name={sms_consent_name} checked={checked}/>

              <div className="sms-disclosure">
                {sms_disclosure}
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export const KlaviyoApiCreateUpdate = async (
    checkoutData: object,
    addressData: object,
    emailConsent: boolean,
    emailListCode: string,
    smsConsent: boolean,
    smsListCode: string,
    meshApiPoint: string
): Promise<object|null> => {
  let checkIfEmailExists = await checkIfEmailExist(checkoutData.email, meshApiPoint);
  let profile = null;
  let profileId = null;
  let profileNumber = null;

  if (checkIfEmailExists.GetProfileByEmail.data.length <= 0) {
    let data = restructureCustomerObject(checkoutData, addressData, null, null, null, true, profileNumber);
    let newProfile = await createProfile(data, meshApiPoint);

    if (Object.keys(newProfile.createProfile).length > 0) {
      profile = newProfile.createProfile.data;
    }
  } else {
    profile = checkIfEmailExists.GetProfileByEmail.data[0];
  }

  let subscribeData = [];
  if (profile && Object.keys(profile.id).length > 0) {
    profileId = profile.id;

    if (Object.keys(profile.attributes.phone_number).length > 0) {
      profileNumber = profile.attributes.phone_number;
    }
  }

  if (profileId) {
    if (emailConsent) {
      let data = restructureCustomerObject(checkoutData, addressData, 'email', profileId, emailListCode, profileNumber);

      if (Object.keys(data).length > 0) {
        subscribeData.push(data);
      }
    }

    if (smsConsent) {
      let data = restructureCustomerObject(checkoutData, addressData, 'sms', profileId, smsListCode, profileNumber);

      if (Object.keys(data).length > 0) {
        subscribeData.push(data);
      }
    }

    if (subscribeData.length) {
      for (const subscribe of subscribeData) {
        await subscribeProfile(subscribe, meshApiPoint);
      }
    }
  }

  return profile;
};

const convertPhoneFormat = (
    phone: string|null
): string|null => {
  let result = null;

  if (phone) {
    const string = String(phone);
    return string.replace(/^(\d)/, '+$1').replace(/^\((?!\+)/, '(+');
  }

  return result;
}

const restructureCustomerObject = (
    checkoutData: object,
    addressData: object,
    consentIdentifier: null|string,
    profileId: null|string,
    code: null|string,
    create: boolean = false,
    profileNumber: null|string
): object => {
  let subscriptions = {};
  let relationships = {};
  let addressDataAttributes = addressData.data;
  let data = {};
  let phone = profileNumber ?? convertPhoneFormat(addressDataAttributes.telephone);

  if (create) {
    data = {
      data: {
        type: "profile",
        attributes: {
          email: checkoutData.email || null,
          first_name: addressDataAttributes.firstName || null,
          last_name: addressDataAttributes.lastName || null,
          organization: addressDataAttributes.company || null,
          location: {
            address1: addressDataAttributes.street?.[0] || null,
            address2: addressDataAttributes.street?.[1] || null,
            city: addressDataAttributes.city || null,
            country: addressDataAttributes.countryCode || null,
            region: addressDataAttributes.region?.regionCode || null,
            zip: addressDataAttributes.postcode || null
          }
        }
      }
    };
  }

  if (!create) {
    if (consentIdentifier === "email" && profileId) {
      data = {
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  id: profileId,
                  attributes: {
                    email: checkoutData.email || null
                  }
                }
              ]
            }
          }
        }
      };

      subscriptions.email = {
        marketing: {
          consent: "SUBSCRIBED"
        }
      };
    }

    if (consentIdentifier === "sms" && profileId) {
      data = {
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  id: profileId,
                  attributes: {
                    phone_number: phone || null
                  }
                }
              ]
            }
          }
        }
      };

      subscriptions.sms = {
        marketing: {
          consent: "SUBSCRIBED"
        },
        transactional: {
          consent: "SUBSCRIBED"
        }
      };
    }

    if (profileId && Object.keys(subscriptions).length > 0) {
      data.data.attributes.profiles.data[0].attributes.subscriptions = subscriptions;
    }

    if (code) {
      relationships.list = {
        data: {
          type: 'list',
          id: code
        }
      };
    }

    if (profileId && code && Object.keys(relationships.list.data).length > 0) {
      data.data.relationships = relationships;
    }
  }

  return data;
};