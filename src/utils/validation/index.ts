/**
 * Validation util// Validation utilities
export {
  isNodeIdUnique,
  getReferencedNodeIds,
  doNodesOverlap,
  findReachableNodeIds,
  categorizeEndNodes,
  nodeExists,
  getNodeById,
  isValidSize,
  isReasonableTextLength,
  countValidationIssues,
  generateUniqueNodeId,
  hasMinimumViableStructure,
  getFlowchartStats,
  formatValidationMessage
} from "./validationUtils";This file exports all validation-related utilities and configurations
 * for easy importing throughout the application.
 */

// Main validation logic
export { FlowchartValidator, validateFlowchart } from "./flowchartValidation";
export type { ValidationResult, ValidationError } from "./flowchartValidation";

// Validation configuration
export {
  getValidationConfig,
  isRuleEnabled,
  getValidationRule,
  defaultValidationConfig,
  validationRules,
  ValidationSeverity,
} from "./validationConfig";
export type { ValidationConfig, ValidationRule } from "./validationConfig";

// Validation utilities
export {
  isNodeIdUnique,
  getReferencedNodeIds,
  doNodesOverlap,
  findReachableNodeIds,
  categorizeEndNodes,
  nodeExists,
  getNodeById,
  isValidSize,
  isReasonableTextLength,
  countValidationIssues,
  generateUniqueNodeId,
  hasMinimumViableStructure,
  getFlowchartStats,
  formatValidationMessage,
} from "./validationUtils";
