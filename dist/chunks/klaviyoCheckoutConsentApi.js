/*! Copyright 2025 Adobe
All Rights Reserved. */
import{FetchGraphQL as c}from"@dropins/tools/fetch-graphql.js";const{setEndpoint:o,setFetchGraphQlHeader:l,removeFetchGraphQlHeader:p,setFetchGraphQlHeaders:h,fetchGraphQl:s,getConfig:m}=new c().getMethods(),d=async(a,n)=>{let e={};const r=`
  query GetProfileByEmail($email: String!) {
    GetProfileByEmail(email: $email)
  }
 `,i={variables:{email:a}};return o(n),await s(r,i).then(t=>t.data).then(t=>{e=t}).catch(t=>{console.error("Error executing GraphQL mutation:",t)}),e},f=async(a,n)=>{let e={};const r=`
  mutation CreateProfile($input: mutationInput_sendConsent_input_Input!) {
    createProfile(
    input: $input
    )
  }`,i={variables:{input:a}};return o(n),await s(r,i).then(t=>t.data).then(t=>{e=t}).catch(t=>{console.error("Error executing GraphQL mutation:",t)}),e},G=(a,n)=>{let e={};const r=`
  mutation SendConsent($input: mutationInput_sendConsent_input_Input!) {
    sendConsent(
    input: $input
    )
  }`,i={variables:{input:a}};return o(n),s(r,i).then(t=>t.data).then(t=>{e=t}).catch(t=>{console.error("Error executing GraphQL mutation:",t)}),e};export{f as a,o as b,d as c,l as d,h as e,s as f,m as g,p as r,G as s};
//# sourceMappingURL=klaviyoCheckoutConsentApi.js.map
