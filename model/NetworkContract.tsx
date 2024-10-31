// SPDX-License-Identifier: Apache-2.0

// Import necessary types
import { Party, ProviderDemographics, FeeSchedule } from './types';

/**
 * Contract between an insurance company (payer) and a healthcare provider.
 */
class ProviderNetworkContract {
  operator: Party;
  payer: Party;
  payerName: string;
  provider: Party;
  providerName: string;
  demographics: ProviderDemographics;
  feeSchedule: FeeSchedule;

  constructor(
    operator: Party,
    payer: Party,
    payerName: string,
    provider: Party,
    providerName: string,
    demographics: ProviderDemographics,
    feeSchedule: FeeSchedule
  ) {
    this.operator = operator;
    this.payer = payer;
    this.payerName = payerName;
    this.provider = provider;
    this.providerName = providerName;
    this.demographics = demographics;
    this.feeSchedule = feeSchedule;
  }

  // Add methods here if there are actions that should be performed on the contract
}

/**
 * Represents the case when the insurance company rejects the provider's request to create a network contract.
 */
class PayerRejectsNetworkContract {
  operator: Party;
  payer: Party;
  provider: Party;
  reason: string;

  constructor(operator: Party, payer: Party, provider: Party, reason: string) {
    this.operator = operator;
    this.payer = payer;
    this.provider = provider;
    this.reason = reason;
  }

  // Additional methods for handling rejection, if necessary
}

export { ProviderNetworkContract, PayerRejectsNetworkContract };
