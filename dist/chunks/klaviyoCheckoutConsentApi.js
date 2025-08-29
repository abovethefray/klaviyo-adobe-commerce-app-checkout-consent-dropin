/*! Copyright 2025 Adobe
All Rights Reserved. */
import{FetchGraphQL as c}from"@dropins/tools/fetch-graphql.js";const{setEndpoint:s,setFetchGraphQlHeader:u,removeFetchGraphQlHeader:p,setFetchGraphQlHeaders:h,fetchGraphQl:o,getConfig:m}=new c().getMethods(),d=async(a,r)=>{let t={};const n=`
  query GetProfileByEmail($email: String!) {
    GetProfileByEmail(email: $email)
  }
 `,i={variables:{email:a}};return s(r),await o(n,i).then(e=>e.data).then(e=>{t=e}).catch(e=>{console.error("Error executing GraphQL check email:",e)}),t},f=async(a,r)=>{let t={};const n=`
  mutation CreateProfile($input: mutationInput_sendConsent_input_Input!) {
    createProfile(
    input: $input
    )
  }`,i={variables:{input:a}};return s(r),await o(n,i).then(e=>e.data).then(e=>{t=e}).catch(e=>{console.error("Error executing GraphQL create profile:",e)}),t},b=async(a,r)=>{let t={};const n=`
  mutation SendConsent($input: mutationInput_sendConsent_input_Input!) {
    sendConsent(
    input: $input
    )
  }`,i={variables:{input:a}};return s(r),await o(n,i).then(e=>e.data).then(e=>{t=e}).catch(e=>{console.error("Error executing GraphQL subscribe profile:",e)}),t};export{f as a,s as b,d as c,u as d,h as e,o as f,m as g,p as r,b as s};
//# sourceMappingURL=klaviyoCheckoutConsentApi.js.map
