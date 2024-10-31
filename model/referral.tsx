// Import necessary types
import { Party, RuleParameters, Update, Optional } from './types'; // Adjust import based on your types file

// Function to run a check and return either None or an error message
const withText = (f: (p: Party, rp: RuleParameters) => Update<boolean>, message: string) => 
    async (requestingParty: Party, ruleParams: RuleParameters): Promise<Optional<string>> => {
        const result = await f(requestingParty, ruleParams);
        return result ? null : message;
    };

// Function to get the first non-empty optional value, or return None
const getFirst = async (updates: Promise<Optional<string>>[]): Promise<Optional<string>> => {
    const results = await Promise.all(updates);
    for (const result of results) {
        if (result) return result; // Return first non-empty value
    }
    return null; // All were None
};

// Function to evaluate a list of validation functions
const validator = async (requestingParty: Party, ruleParams: RuleParameters, checks: Array<(requestingParty: Party, ruleParams: RuleParameters) => Update<Optional<string>>>): Promise<Optional<string>> => {
    const updates = checks.map(check => check(requestingParty, ruleParams));
    return getFirst(updates);
};

// Eligibility rules check
const runEligibilityRules = async (requestingParty: Party, ruleParams: RuleParameters): Promise<Optional<string>> => {
    return validator(requestingParty, ruleParams, [
        goodStanding,
        policyDate,
        procedureCount,
        providerNetwork,
        procedureAllowed,
    ]);
};

// Preauthorization rules check
const runPreauthorizationRules = async (requestingParty: Party, ruleParams: RuleParameters): Promise<Optional<string>> => {
    return validator(requestingParty, ruleParams, [
        referralStatus,
    ]);
};

// Adjudication rules check
const runAdjudicationRules = async (requestingParty: Party, ruleParams: RuleParameters): Promise<Optional<string>> => {
    return validator(requestingParty, ruleParams, [
        goodStanding,
        policyDate,
        procedureCount,
        providerNetwork,
        procedureAllowed,
        referralStatus,
    ]);
};

// List of functions to run the checks
const goodStanding = withText(checkPolicyActive, "Policy is not in good standing");
const policyDate = withText(checkPolicyDate, "Policy end date is in the past");
const procedureCount = withText(checkProcedureCount, "Maximum number of procedures reached");
const providerNetwork = withText(checkProviderNetwork, "Provider out of network");
const procedureAllowed = withText(checkProcedureAllowed, "Procedure not allowed");
const referralStatus = withText(checkReferral, "No referral for procedure");

// Class representing the rules check
class RulesCheck {
    constructor(
        public requestingParty: Party,
        public ruleParams: RuleParameters
    ) {}

    async checkEligibility(): Promise<Optional<string>> {
        return runEligibilityRules(this.requestingParty, this.ruleParams);
    }

    async checkPreAuthorization(): Promise<Optional<string>> {
        return runPreauthorizationRules(this.requestingParty, this.ruleParams);
    }

    async checkAdjudication(): Promise<Optional<string>> {
        return runAdjudicationRules(this.requestingParty, this.ruleParams);
    }
}

// Check referral validity
const checkReferral = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    const maybeReferral = ruleParams.referral;
    if (maybeReferral) {
        const r = await fetch(maybeReferral);
        return r.referringProvider === requestingParty || r.renderingProvider === requestingParty;
    }
    return false;
};

// Check if provider is in network
const checkProviderNetwork = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    const n = await fetch(ruleParams.networkContract);
    const p = await fetch(ruleParams.policy);
    return n.payer === p.payer;
};

// Check policy date
const checkPolicyDate = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    const now = await getTime(); // Implement getTime according to your needs
    const today = toDateUTC(now);
    const p = await fetch(ruleParams.policy);
    return p.policyEndDate >= today;
};

// Check policy active status
const checkPolicyActive = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    const p = await fetch(ruleParams.policy);
    return p.isPolicyInGoodStanding;
};

// Check procedure count
const checkProcedureCount = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    const p = await fetch(ruleParams.policy);
    const maybeProcedureCid = ruleParams.encounterDetails.procedureCode in p.procedureList ? p.procedureList[ruleParams.encounterDetails.procedureCode] : null;
    if (maybeProcedureCid) {
        const procedure = await fetch(maybeProcedureCid);
        return (procedure.scheduledProcedures + procedure.receivedProcedures <= procedure.maxProcedures);
    }
    return false;
};

// Check if the procedure is valid for diagnosis
const checkValidProcedureForDiagnosis = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    return diagnosisToProcedureMapping(ruleParams.encounterDetails.diagnosisCode, ruleParams.encounterDetails.procedureCode);
};

// Check if referral to specialist is valid
const checkReferralToSpecialist = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    const n = await fetch(ruleParams.networkContract);
    const maybeReferral = ruleParams.referral;
    if (maybeReferral) {
        const r = await fetch(maybeReferral);
        if (r.renderingProvider !== n.provider) {
            throw new Error("Rendering provider does not match network provider");
        }
        return n.demographics.providerType === "Specialist"; // Adjust based on actual type
    }
    return false;
};

// Check if procedure is allowed
const checkProcedureAllowed = async (requestingParty: Party, ruleParams: RuleParameters): Promise<boolean> => {
    const p = await fetch(ruleParams.policy);
    const maybeProcedureCid = ruleParams.encounterDetails.procedureCode in p.procedureList ? p.procedureList[ruleParams.encounterDetails.procedureCode] : null;
    return maybeProcedureCid !== null;
};
