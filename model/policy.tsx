import { context, ContractPromise } from 'near-sdk-as';
import { PersistentMap, PersistentVector } from 'near-sdk-as';

// Data Structures
@nearBindgen
class ProcedureMap {
    // Implement a mapping of procedure codes to procedure contract IDs
    procedures: Map<string, string>; // Key: ProcedureCode, Value: Procedure Contract ID

    constructor() {
        this.procedures = new Map<string, string>();
    }
}

@nearBindgen
class InsurancePolicy {
    operator: string; // Public key of the operator
    payer: string; // Public key of the payer
    patient: string; // Public key of the patient
    patientName: string;
    insuranceID: string;
    policyType: string; // PolicyType can be an enum or string
    annualDeductible: f64;
    currentDeductible: f64;
    procedureList: ProcedureMap;
    policyEndDate: u64; // Use timestamp for the end date
    isPolicyInGoodStanding: bool;

    constructor(
        operator: string,
        payer: string,
        patient: string,
        patientName: string,
        insuranceID: string,
        policyType: string,
        annualDeductible: f64,
        currentDeductible: f64,
        procedureList: ProcedureMap,
        policyEndDate: u64,
        isPolicyInGoodStanding: bool
    ) {
        this.operator = operator;
        this.payer = payer;
        this.patient = patient;
        this.patientName = patientName;
        this.insuranceID = insuranceID;
        this.policyType = policyType;
        this.annualDeductible = annualDeductible;
        this.currentDeductible = currentDeductible;
        this.procedureList = procedureList;
        this.policyEndDate = policyEndDate;
        this.isPolicyInGoodStanding = isPolicyInGoodStanding;
    }

    // Lock procedure on appointment creation
    lockProcedureOnAppointmentCreation(procedureCode: string): void {
        const procedureCid = this.procedureList.procedures.get(procedureCode);
        if (procedureCid) {
            // Logic to lock the procedure
            // Example: Call some method on the procedure contract
            // exerciseProcedureLock(procedureCid);

            // Update the procedure list
            this.procedureList.procedures.set(procedureCode, procedureCid); // Update logic here
        }
    }

    // Unlock procedure on appointment cancellation
    unlockProcedureOnAppointmentCancellation(procedureCode: string): void {
        const procedureCid = this.procedureList.procedures.get(procedureCode);
        if (procedureCid) {
            // Logic to unlock the procedure
            // Example: Call some method on the procedure contract
            // exerciseProcedureUnlock(procedureCid);

            // Update the procedure list
            this.procedureList.procedures.set(procedureCode, procedureCid); // Update logic here
        }
    }

    // Update policy on treatment completion
    updatePolicyOnTreatmentCompletion(patientResponsibility: f64, procedureCode: string): void {
        const procedureCid = this.procedureList.procedures.get(procedureCode);
        if (procedureCid) {
            // Logic to update the procedure state
            // Example: Call some method on the procedure contract
            // exerciseProcedureUnlockAndIncrement(procedureCid);

            // Update the deductible and procedure list
            this.currentDeductible = Math.max(0.0, this.currentDeductible - patientResponsibility);
            this.procedureList.procedures.set(procedureCode, procedureCid); // Update logic here
        }
    }
}

// Policy details disclosed to a list of receivers
@nearBindgen
class DisclosedPolicy {
    operator: string; // Public key of the operator
    payer: string; // Public key of the payer
    patient: string; // Public key of the patient
    receivers: PersistentVector<string>; // List of public keys of receivers
    patientName: string;
    insuranceID: string;
    policyType: string; // PolicyType can be an enum or string
    annualDeductible: f64;
    currentDeductible: f64;
    procedureList: ProcedureMap;
    policyEndDate: u64; // Use timestamp for the end date
    isPolicyInGoodStanding: bool;

    constructor(
        operator: string,
        payer: string,
        patient: string,
        receivers: PersistentVector<string>,
        patientName: string,
        insuranceID: string,
        policyType: string,
        annualDeductible: f64,
        currentDeductible: f64,
        procedureList: ProcedureMap,
        policyEndDate: u64,
        isPolicyInGoodStanding: bool
    ) {
        this.operator = operator;
        this.payer = payer;
        this.patient = patient;
        this.receivers = receivers;
        this.patientName = patientName;
        this.insuranceID = insuranceID;
        this.policyType = policyType;
        this.annualDeductible = annualDeductible;
        this.currentDeductible = currentDeductible;
        this.procedureList = procedureList;
        this.policyEndDate = policyEndDate;
        this.isPolicyInGoodStanding = isPolicyInGoodStanding;
    }

    // Disclose policy to a new receiver
    disclose(newReceiver: string): void {
        // Update the receivers list
        this.receivers.push(newReceiver);
        // Logic to disclose the procedure list to the new receiver
        const newProcedureMap = discloseProcedureMap([newReceiver], this.procedureList);
        this.procedureList = newProcedureMap; // Update with the new procedure list
    }
}

// Function to disclose procedure map (stub for logic)
function discloseProcedureMap(receivers: string[], procedureList: ProcedureMap): ProcedureMap {
    // Implement logic to disclose the procedure list to the receivers
    return procedureList; // Return the updated procedure list for now
}
