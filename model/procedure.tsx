import { context, ContractPromise } from 'near-sdk-as';
import { PersistentMap, PersistentVector } from 'near-sdk-as';

// Type Definitions
type ProcedureCode = string; // Define as per your needs
type PolicyType = 'Gold' | 'Bronze'; // Example of enum for policy types

@nearBindgen
class ProcedureFields {
    copay: f64;
    maxProcedures: i32;
    scheduledProcedures: i32;
    receivedProcedures: i32;

    constructor(copay: f64, maxProcedures: i32, scheduledProcedures: i32, receivedProcedures: i32) {
        this.copay = copay;
        this.maxProcedures = maxProcedures;
        this.scheduledProcedures = scheduledProcedures;
        this.receivedProcedures = receivedProcedures;
    }
}

@nearBindgen
class Procedure {
    owner: string; // Public key of the owner
    procedureCode: ProcedureCode;
    copay: f64;
    maxProcedures: i32;
    scheduledProcedures: i32;
    receivedProcedures: i32;
    observers: PersistentVector<string>; // List of observers

    constructor(
        owner: string,
        procedureCode: ProcedureCode,
        copay: f64,
        maxProcedures: i32,
        scheduledProcedures: i32,
        receivedProcedures: i32,
        observers: PersistentVector<string>
    ) {
        this.owner = owner;
        this.procedureCode = procedureCode;
        this.copay = copay;
        this.maxProcedures = maxProcedures;
        this.scheduledProcedures = scheduledProcedures;
        this.receivedProcedures = receivedProcedures;
        this.observers = observers;
        this.ensureValidState();
    }

    ensureValidState(): void {
        if (this.receivedProcedures + this.scheduledProcedures > this.maxProcedures) {
            throw new Error('Total procedures exceed maximum allowed');
        }
    }

    lock(): void {
        this.scheduledProcedures += 1;
        // Logic to update state in persistent storage if necessary
    }

    unlock(): void {
        this.scheduledProcedures -= 1;
        // Logic to update state in persistent storage if necessary
    }

    unlockAndIncrement(): void {
        this.receivedProcedures += 1;
        this.scheduledProcedures -= 1;
        // Logic to update state in persistent storage if necessary
    }

    discloseProcedure(newObservers: string[]): void {
        for (let observer of newObservers) {
            this.observers.push(observer);
        }
        // Logic to update state in persistent storage if necessary
    }
}

// Function to create a procedure
function createProcedure(owner: string, policyType: PolicyType, procedureCode: ProcedureCode): Procedure {
    let fields: ProcedureFields;

    switch (policyType) {
        case 'Gold':
            fields = new ProcedureFields(15.0, 20, 0, 0);
            break;
        case 'Bronze':
            fields = new ProcedureFields(40.0, 10, 0, 0);
            break;
        default:
            throw new Error('Invalid Policy Type');
    }

    return new Procedure(owner, procedureCode, fields.copay, fields.maxProcedures, fields.scheduledProcedures, fields.receivedProcedures, new PersistentVector<string>());
}

// Function to create a list of procedures
function createProcedureList(owner: string, policyType: PolicyType, procedureCodes: ProcedureCode[]): Procedure[] {
    let procedures: Procedure[] = [];

    for (let code of procedureCodes) {
        procedures.push(createProcedure(owner, policyType, code));
    }

    return procedures;
}

// Function to disclose a procedure to new observers
function discloseProcedure(newObservers: string[], procedure: Procedure): void {
    procedure.discloseProcedure(newObservers);
}

// Function to disclose a procedure map to new observers
function discloseProcedureMap(newObservers: string[], procedureMap: Map<ProcedureCode, Procedure>): Map<ProcedureCode, Procedure> {
    const disclosedProcedures: Map<ProcedureCode, Procedure> = new Map();

    for (let [code, procedure] of procedureMap.entries()) {
        discloseProcedure(newObservers, procedure);
        disclosedProcedures.set(code, procedure);
    }

    return disclosedProcedures;
}
