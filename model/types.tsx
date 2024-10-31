// Copyright (c) 2019, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

// Import necessary types
import { Map } from 'immutable'; // Using Immutable.js for Map type
import { Optional } from './Optional'; // Adjust import according to your structure

// In the workflow, a primary provider creates a referral for the patient and sends them to a specialist
export enum ProviderType {
  Primary = 'Primary',
  Specialist = 'Specialist',
}

// Reference data for patients
export interface PatientDemographics {
  patientGender: string;
  patientSocialSecurityNumber: string;
  patientDateOfBirth: string;
  patientAddressLine1: string;
  patientAddressLine2: string;
  patientCity: string;
  patientState: string;
  patientZipCode: string;
}

// Reference data for healthcare providers (either primary or specialist)
export interface ProviderDemographics {
  providerHIN: string;
  providerTaxID: string;
  providerBankDFINumber: string;
  providerBankAccountNumber: string;
  providerType: ProviderType;
  providerAddressFirstLine: string;
  providerAddressSecondLine: string;
  providerCity: string;
  providerState: string;
  providerZipCode: string;
}

// Reference data for insurance companies
export interface PayerDemographics {
  payerHIN: string; // HIN: Health Industry Number
  payerTaxID: string;
  payerBankDFINumber: string;
  payerBankAccountNumber: string;
  payerAddressFirstLine: string;
  payerAddressSecondLine: string;
  payerCity: string;
  payerState: string;
  payerZipCode: string;
}

// Type of the policy between the patient and the insurance company
export enum PolicyType {
  Gold = 'Gold',
  Bronze = 'Bronze',
}

// Mapping between procedure codes and fees
export type FeeSchedule = Map<ProcedureCode, number>;

export enum ProcedureCode {
  Preventive_Care = 'Preventive_Care',
  Physicals = 'Physicals',
  Sick_Visits = 'Sick_Visits',
  X_Ray_Wrist_2_Views = 'X_Ray_Wrist_2_Views',
  X_Ray_Wrist_3_Views = 'X_Ray_Wrist_3_Views',
}

// Function to read enum values
export function readEnum<T>(name: string, enumObj: { [key: string]: T }, value: string): T {
  const enumEntries = Object.entries(enumObj) as [string, T][];
  const found = enumEntries.find(([key]) => key === value);
  if (!found) {
    throw new Error(`Error reading ${name}: ${value}`);
  }
  return found[1];
}

export enum DiagnosisCode {
  Fracture_of_scaphoid_bone_right_wrist_S62_001 = 'Fracture_of_scaphoid_bone_right_wrist_S62_001',
  Closed_fracture_of_scaphoid_bone_right_wrist_S62_001A = 'Closed_fracture_of_scaphoid_bone_right_wrist_S62_001A',
  Open_fracture_of_scaphoid_bone_right_wrist_S62_001B = 'Open_fracture_of_scaphoid_bone_right_wrist_S62_001B',
  Fracture_of_scaphoid_bone_left_wrist_S62_002 = 'Fracture_of_scaphoid_bone_left_wrist_S62_002',
  Closed_fracture_of_scaphoid_bone_left_wrist_S62_002A = 'Closed_fracture_of_scaphoid_bone_left_wrist_S62_002A',
  Open_fracture_of_scaphoid_bone_left_wrist_S62_002B = 'Open_fracture_of_scaphoid_bone_left_wrist_S62_002B',
  Fracture_of_scaphoid_bone_unspecified_S62_009 = 'Fracture_of_scaphoid_bone_unspecified_S62_009',
  Closed_fracture_of_scaphoid_bone_unspecified_S62_009A = 'Closed_fracture_of_scaphoid_bone_unspecified_S62_009A',
  Open_fracture_of_scaphoid_bone_unspecified_S62_009B = 'Open_fracture_of_scaphoid_bone_unspecified_S62_009B',
  Pain_in_right_arm_M79_601 = 'Pain_in_right_arm_M79_601',
  Pain_in_left_arm_M79_602 = 'Pain_in_left_arm_M79_602',
  Pain_in_arm_unspecified_M79_603 = 'Pain_in_arm_unspecified_M79_603',
}

// The encounter parameters of an appointment
export interface EncounterDetails {
  patient: Party; // Assuming Party is defined elsewhere
  encounterId: string;
  procedureCode: ProcedureCode;
  diagnosisCode: DiagnosisCode;
  allowedAmount?: Optional<number>; // Optional value
  coPay?: Optional<number>; // Optional value
  patientResponsibility?: Optional<number>; // Optional value
  siteServiceCode: string;
  appointmentPriority: string;
}
