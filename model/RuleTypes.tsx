// Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { ContractId } from './Types'; // Adjust import according to your structure
import { EncounterDetails } from './Policy'; // Import necessary types
import { ClaimRequest } from './Claim'; // Import ClaimRequest type
import * as CC from './CostCalculation'; // Adjust import path as needed

// Payment information created after a treatment is finished
interface TreatmentOutput {
  claimReq: ContractId<ClaimRequest>;
  patientReq: ContractId<PatientPaymentRequest>;
}

// A Treatment contract created when the provider checks in the patient
class Treatment {
  operator: Party;
  provider: Party;
  patient: Party;
  policy: ContractId<DisclosedPolicy>;
  encounterDetails: EncounterDetails;

  constructor(operator: Party, provider: Party, patient: Party, policy: ContractId<DisclosedPolicy>, encounterDetails: EncounterDetails) {
    this.operator = operator;
    this.provider = provider;
    this.patient = patient;
    this.policy = policy;
    this.encounterDetails = encounterDetails;
  }

  async completeTreatment(): Promise<TreatmentOutput> {
    const policyContract = await fetchPolicy(this.policy);
    const payer = policyContract.payer;

    if (this.encounterDetails.allowedAmount) {
      const allowedAmount = this.encounterDetails.allowedAmount;

      if (this.encounterDetails.patientResponsibility) {
        const patientResponsibility = this.encounterDetails.patientResponsibility;
        const payerAmt = CC.calculatePayerPayment(allowedAmount, patientResponsibility);

        const claimReq = await createClaimRequest(this.encounterDetails.encounterId, payerAmt);
        const patientReq = await createPatientPaymentRequest(this.encounterDetails.encounterId, patientResponsibility);
        return { claimReq, patientReq };
      } else {
        const claimReq = await createClaimRequest(this.encounterDetails.encounterId, 0.0);
        const patientReq = await createPatientPaymentRequest(this.encounterDetails.encounterId, 0.0);
        return { claimReq, patientReq };
      }
    } else {
      const claimReq = await createClaimRequest(this.encounterDetails.encounterId, 0.0);
      const patientReq = await createPatientPaymentRequest(this.encounterDetails.encounterId, 0.0);
      return { claimReq, patientReq };
    }
  }
}

// Mock implementations of required functions
async function fetchPolicy(policyId: ContractId<DisclosedPolicy>): Promise<DisclosedPolicy> {
  // Implement your logic to fetch policy data
  throw new Error("Fetch policy not implemented.");
}

async function createClaimRequest(claimId: string, amount: number): Promise<ContractId<ClaimRequest>> {
  // Implement your logic to create a claim request
  throw new Error("Create claim request not implemented.");
}

async function createPatientPaymentRequest(paymentId: string, amount: number): Promise<ContractId<PatientPaymentRequest>> {
  // Implement your logic to create a patient payment request
  throw new Error("Create patient payment request not implemented.");
}

interface PatientPaymentRequest {
  // Define your PatientPaymentRequest properties
}

// Export the Treatment class and TreatmentOutput interface
export {
  Treatment,
  TreatmentOutput,
};
