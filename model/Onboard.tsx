// SPDX-License-Identifier: Apache-2.0

// Import necessary types or classes
import { Party } from './types';
import { PayerInvitation, ProviderInvitation, PatientInvitation } from './invitations';

/**
 * Master entity for onboarding different roles.
 * This serves as the primary contract in the onboarding workflow created by the operator.
 */
class OnboardEntityMaster {
  operator: Party;

  constructor(operator: Party) {
    this.operator = operator;
  }

  /**
   * Method to invite a payer into the system.
   * @param payer - The party representing the payer to be invited.
   * @returns A new instance of PayerInvitation.
   */
  invitePayer(payer: Party): PayerInvitation {
    return new PayerInvitation(this.operator, payer);
  }

  /**
   * Method to invite a provider into the system.
   * @param provider - The party representing the provider to be invited.
   * @returns A new instance of ProviderInvitation.
   */
  inviteProvider(provider: Party): ProviderInvitation {
    return new ProviderInvitation(this.operator, provider);
  }

  /**
   * Method to invite a patient into the system.
   * @param patient - The party representing the patient to be invited.
   * @returns A new instance of PatientInvitation.
   */
  invitePatient(patient: Party): PatientInvitation {
    return new PatientInvitation(this.operator, patient);
  }
}

// Example Invitation class definitions for reference
class PayerInvitation {
  constructor(public operator: Party, public payer: Party) {}
}

class ProviderInvitation {
  constructor(public operator: Party, public provider: Party) {}
}

class PatientInvitation {
  constructor(public operator: Party, public patient: Party) {}
}

export { OnboardEntityMaster, PayerInvitation, ProviderInvitation, PatientInvitation };
