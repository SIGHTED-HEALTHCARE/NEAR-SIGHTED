// SPDX-License-Identifier: Apache-2.0

// Import necessary types
import { RuleParameters, EncounterDetails, Procedure, Policy, NetworkContract, EncounterStage } from './types';

class CostCalculation {
  
  static async calculateCosts(ruleParams: RuleParameters, encounterStage: EncounterStage): Promise<EncounterDetails> {
    const policy = await ruleParams.policy;
    const networkContract = await ruleParams.networkContract;

    const encounterDetails = ruleParams.encounterDetails;
    const procedureCode = encounterDetails.procedureCode;
    const maybeProcedure = policy.procedureList.get(procedureCode);
    
    const buildEncounterDetail = (
      allowedAmount: number | null, 
      patientResponsibility: number | null, 
      coPay: number | null
    ): EncounterDetails => ({
      patient: policy.patient,
      encounterId: encounterDetails.encounterId,
      diagnosisCode: encounterDetails.diagnosisCode,
      siteServiceCode: encounterDetails.siteServiceCode,
      appointmentPriority: encounterDetails.appointmentPriority,
      allowedAmount,
      patientResponsibility,
      coPay
    });

    const baseEncounterDetail = buildEncounterDetail(null, null, null);

    const optionalPatientResponsibilityAmount = (procedure: Procedure, allowedAmount: number) => 
      CostCalculation.calculatePatientResp(policy.currentDeductible, procedure.copay, allowedAmount);

    const getEncounterDetail = (procedure: Procedure, allowedAmount: number) => 
      buildEncounterDetail(allowedAmount, optionalPatientResponsibilityAmount(procedure, allowedAmount), procedure.copay);

    switch(encounterStage) {
      case EncounterStage.Referral:
        if (maybeProcedure) {
          const procedure = await maybeProcedure;
          return buildEncounterDetail(null, null, procedure.copay);
        }
        return baseEncounterDetail;

      default:
        if (maybeProcedure) {
          const procedure = await maybeProcedure;
          const maybeAmt = networkContract.feeSchedule.get(procedureCode);
          if (maybeAmt !== undefined) {
            return getEncounterDetail(procedure, maybeAmt);
          }
          return buildEncounterDetail(null, null, procedure.copay);
        }
        return baseEncounterDetail;
    }
  }

  static calculatePatientResp(deductible: number, copay: number, allowedAmount: number): number {
    if (deductible >= allowedAmount) {
      return copay + allowedAmount;
    } else if (deductible > 0 && deductible < allowedAmount) {
      return copay + deductible;
    } else {
      return copay;
    }
  }

  static calculatePayerPayment(allowedAmount: number, patientResp: number): number {
    return Math.max(0, allowedAmount - patientResp);
  }
}

export default CostCalculation;
