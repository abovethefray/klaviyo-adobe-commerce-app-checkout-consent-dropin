/********************************************************************
 *  Copyright 2025 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this
 * file in accordance with the terms of the Adobe license agreement
 * accompanying it.
 *******************************************************************/

import {setEndpoint, fetchGraphQl} from '../fetch-graphql/index'

export const checkIfEmailExist = async (
    email: string,
    meshApiPoint: string
) => {
  let result = {};
  const query = `
  query GetProfileByEmail($email: String!) {
    GetProfileByEmail(email: $email)
  }
 `;

  const variable = {
    variables: {
      "email": email
    }
  }

  setEndpoint(meshApiPoint);
  await fetchGraphQl(query, variable).then(
      response => response.data
  ).then(data => {
    result = data;
  }).catch(error => {
    console.error("Error executing GraphQL check email:", error);
  });

  return result;
}

export const createProfile = async (
    data: object,
    meshApiPoint: string
) => {
  let result = {};
  const mutation = `
  mutation CreateProfile($input: mutationInput_sendConsent_input_Input!) {
    createProfile(
    input: $input
    )
  }`;

  const variable = {
    variables: {
      "input": data
    }
  }

  setEndpoint(meshApiPoint);
  await fetchGraphQl(mutation, variable).then(
      response => response.data
  ).then(data => {
    result = data;
  }).catch(error => {
    console.error("Error executing GraphQL create profile:", error);
  });

  return result;
}

export const subscribeProfile = async (
    data: object,
    meshApiPoint: string
) => {
  let result = {};
  const mutation = `
  mutation SendConsent($input: mutationInput_sendConsent_input_Input!) {
    sendConsent(
    input: $input
    )
  }`;

  const variable = {
    variables: {
      "input": data
    }
  }

  setEndpoint(meshApiPoint);
  await fetchGraphQl(mutation, variable).then(
      response => response.data
  ).then(data => {
    result = data;
  }).catch(error => {
    console.error("Error executing GraphQL subscribe profile:", error);
  });

  return result;
}
