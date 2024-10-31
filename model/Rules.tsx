// Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

type Party = string;
type ContractId<T> = string; // Replace with your ContractId implementation
type Update<T> = Promise<T>; // Replace with your Update implementation

// Types for EncounterDetails and DisclosedPolicy
interface EncounterDetails {
  procedureCode: string;
  diagnosisCode: string;
}

interface DisclosedPolicy {
  id: string;
  policyEndDate: Date;
  isPolicyInGoodStanding: boolean;
  procedureList: Record<string, ContractId<DisclosedPolicy>>;
}

interface ProviderNetworkContract {
  payer: Party;
  demographics: {
    providerType: 'Specialist' | 'Generalist'; // Define your provider types
  };
}

// Represents a function that returns true if the checks match the expectations
type RuleFunc = (party: Party, ruleParameters: RuleParameters) => Update<boolean>;

// Data used to run the rules check
interface RuleParameters {
  policy: ContractId<DisclosedPolicy>;
  encounterDetails: EncounterDetails;
  networkContract: ContractId<ProviderNetworkContract>;
  referral?: ContractId<Referral>; // Optional referral
}

// Update the policy parameter with a given value
function updatePolicyParam(ruleParams: RuleParameters, newPolicy: ContractId<DisclosedPolicy>): RuleParameters {
  return {
    ...ruleParams,
    policy: newPolicy,
  };
}

// Update the referral with a given value
function updateReferralParam(ruleParams: RuleParameters, newReferral: ContractId<Referral>): RuleParameters {
  return {
    ...ruleParams,
    referral: newReferral,
  };
}

// Update the encounterDetails with a given value
function updateEncounterParam(ruleParams: RuleParameters, newEncounterDetails: EncounterDetails): RuleParameters {
  return {
    ...ruleParams,
    encounterDetails: newEncounterDetails,
  };
}

// Utility functions
async function withText(f: RuleFunc, errorMessage: string, party: Party, ruleParams: RuleParameters): Update<string | null> {
  const isValid = await f(party, ruleParams);
  return isValid ? null : errorMessage;
}

async function getFirst(updates: Promise<string | null>[]): Update<string | null> {
  for (const update of updates) {
    const result = await update;
    if (result) return result; // Return the first non-null error message
  }
  return null;
}

async function listF(a: Party, b: RuleParameters, functions: RuleFunc[]): Update<boolean[]> {
  const results = await Promise.all(functions.map((f) => f(a, b)));
  return results;
}

async function validator(party: Party, ruleParams: RuleParameters, functions: RuleFunc[]): Update<string | null> {
  return getFirst(await listF(party, ruleParams, functions));
}

// Rule checks
async function runEligibilityRules(party: Party, ruleParams: RuleParameters): Update<string | null> {
  return validator(party, ruleParams, [
    goodStanding,
    policyDate,
    procedureCount,
    providerNetwork,
    procedureAllowed,
  ]);
}

async function runPreauthorizationRules(party: Party, ruleParams: RuleParameters): Update<string | null> {
  return validator(party, ruleParams, [referralStatus]);
}

async function runAdjudicationRules(party: Party, ruleParams: RuleParameters): Update<string | null> {
  return validator(party, ruleParams, [
    goodStanding,
    policyDate,
    procedureCount,
    providerNetwork,
    procedureAllowed,
    referralStatus,
  ]);
}

// Individual rule check functions
async function goodStanding(party: Party, ruleParams: RuleParameters): Update<boolean> {
  const policy = await fetch(ruleParams.policy); // Fetch the policy data
  return policy.isPolicyInGoodStanding;
}

async function policyDate(party: Party, ruleParams: RuleParameters): Update<boolean> {
  const now = new Date(); // Current time
  const policy = await fetch(ruleParams.policy); // Fetch the policy data
  return policy.policyEndDate >= now;
}

async function procedureCount(party: Party, ruleParams: RuleParameters): Update<boolean> {
  const policy = await fetch(ruleParams.policy); // Fetch the policy data
  const procedureCid = policy.procedureList[ruleParams.encounterDetails.procedureCode];
  if (procedureCid) {
    const procedure = await fetch(procedureCid); // Fetch the procedure data
    return (procedure.scheduledProcedures + procedure.receivedProcedures) <= procedure.maxProcedures;
  }
  return false;
}

async function providerNetwork(party: Party, ruleParams: RuleParameters): Update<boolean> {
  const network = await fetch(ruleParams.networkContract); // Fetch the network contract
  const policy = await fetch(ruleParams.policy); // Fetch the policy data
  return network.payer === policy.payer;
}

async function procedureAllowed(party: Party, ruleParams: RuleParameters): Update<boolean> {
  const policy = await fetch(ruleParams.policy); // Fetch the policy data
  return ruleParams.encounterDetails.procedureCode in policy.procedureList;
}

async function referralStatus(party: Party, ruleParams: RuleParameters): Update<boolean> {
  const maybeReferral = ruleParams.referral;
  if (maybeReferral) {
    const referral = await fetch(maybeReferral); // Fetch the referral data
    return referral.referringProvider === party || referral.renderingProvider === party;
  }
  return false;
}

// Example of fetch function (this needs to be replaced with your actual fetch implementation)
async function fetch<T>(contractId: ContractId<T>): Promise<T> {
  // Replace with your data-fetching logic
  throw new Error("Fetch function not implemented.");
}

// Define your Referral type as needed
interface Referral {
  referringProvider: Party;
  renderingProvider: Party;
}

export {
  RuleParameters,
  runEligibilityRules,
  runPreauthorizationRules,
  runAdjudicationRules,
  updatePolicyParam,
  updateReferralParam,
  updateEncounterParam,
};
