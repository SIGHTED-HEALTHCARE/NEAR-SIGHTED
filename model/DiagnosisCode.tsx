// SPDX-License-Identifier: Apache-2.0

// Import types
import { DiagnosisCode, ProcedureCode } from './types';

// Checks if the diagnosisCode - procedureCode pair is valid
function diagnosisToProcedureMapping(diagnosisCode: DiagnosisCode, procedureCode: ProcedureCode): boolean {
  // Check for PCP visit conditions
  if (
    (procedureCode === ProcedureCode.Preventive_Care || 
     procedureCode === ProcedureCode.Physicals || 
     procedureCode === ProcedureCode.Sick_Visits) && 
    (
      diagnosisCode === DiagnosisCode.Pain_in_right_arm_M79_601 || 
      diagnosisCode === DiagnosisCode.Pain_in_left_arm_M79_602 || 
      diagnosisCode === DiagnosisCode.Pain_in_arm_unspecified_M79_603
    )
  ) {
    return true;
  } else {
    return false;
  }
}

export default diagnosisToProcedureMapping;
