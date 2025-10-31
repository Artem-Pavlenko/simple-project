/**
 * Validation Configuration
 *
 * This file contains configuration options for the flowchart validatio  MISSING_FAILURE_END_NODE: {
    id: "MISSING_FAILURE_END_NODE",
    severity: ValidationSeverity.ERROR,
    message: "Ch  // Content Length (Warnings)
  LONG_NODE_TITLE: {t least one Fail end node",
    suggestion: "Add an end node and connect it as a failure transition",
    enabled: true
  },

  IMPLICIT_SUCCESS_END_NODE: {
    id: "IMPLICIT_SUCCESS_END_NODE",
    severity: ValidationSeverity.WARNING,
    message: "Success end node connections not explicitly defined",
    suggestion: "Ensure proper success transitions are configured",
    enabled: true
  },

  IMPLICIT_FAILURE_END_NODE: {
    id: "IMPLICIT_FAILURE_END_NODE", 
    severity: ValidationSeverity.WARNING,
    message: "Failure end node connections not explicitly defined",
    suggestion: "Ensure proper failure transitions are configured",
    enabled: true
  },

  MISSING_SUCCESS_TRANSITIONS: {
    id: "MISSING_SUCCESS_TRANSITIONS",
    severity: ValidationSeverity.ERROR,
    message: "Intermediate nodes must have success transitions defined",
    suggestion: "Add success transitions to your intermediate nodes",
    enabled: true
  },

  MISSING_FAILURE_TRANSITIONS: {
    id: "MISSING_FAILURE_TRANSITIONS", 
    severity: ValidationSeverity.ERROR,
    message: "Intermediate nodes must have failure transitions defined",
    suggestion: "Add failure transitions to your intermediate nodes",
    enabled: true
  },

  INSUFFICIENT_END_NODES: {
    id: "INSUFFICIENT_END_NODES",
    severity: ValidationSeverity.ERROR,
    message: "Challenge with intermediate nodes needs at least 2 end nodes",
    suggestion: "Add more end nodes to support success and failure paths",
    enabled: true
  },m.
 * Modify these settings to customize validation behavior.
 */

export interface ValidationConfig {
  // Core validation settings
  enforceStartNode: boolean;
  enforceEndNodes: boolean;
  enforceReachability: boolean;
  enforceTransitions: boolean;

  // Content validation settings
  maxTitleLength: number;
  maxDescriptionLength: number;
  requireDescriptions: boolean;
  requireEvents: boolean;

  // Position validation settings
  allowNegativePositions: boolean;
  checkNodeOverlaps: boolean;
  minNodeSize: { width: number; height: number };

  // Performance settings
  maxValidationTime: number; // milliseconds
  enableRealTimeValidation: boolean;
  debounceDelay: number; // milliseconds

  // UI settings
  showWarnings: boolean;
  enableClickNavigation: boolean;
  autoShowValidationPanel: boolean;
}

export const defaultValidationConfig: ValidationConfig = {
  // Core validation - aligned with FR-3.27 requirements
  enforceStartNode: true,
  enforceEndNodes: true,
  enforceReachability: true,
  enforceTransitions: true,

  // Content validation
  maxTitleLength: 100,
  maxDescriptionLength: 500,
  requireDescriptions: false, // Warning only
  requireEvents: false, // Warning only

  // Position validation
  allowNegativePositions: true, // Warning only
  checkNodeOverlaps: true, // Warning only
  minNodeSize: { width: 1, height: 1 },

  // Performance
  maxValidationTime: 5000, // 5 seconds max
  enableRealTimeValidation: true,
  debounceDelay: 500, // 500ms

  // UI
  showWarnings: true,
  enableClickNavigation: true,
  autoShowValidationPanel: false, // Show only on manual validation
};

/**
 * Validation severity levels
 */
export const ValidationSeverity = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type ValidationSeverity =
  (typeof ValidationSeverity)[keyof typeof ValidationSeverity];

/**
 * Validation rule definitions
 */
export interface ValidationRule {
  id: string;
  severity: ValidationSeverity;
  message: string;
  suggestion?: string;
  enabled: boolean;
}

export const validationRules: Record<string, ValidationRule> = {
  // FR-3.27 Core Requirements (Errors)
  MISSING_START_NODE: {
    id: "MISSING_START_NODE",
    severity: ValidationSeverity.ERROR,
    message: "Challenge must have exactly one start node",
    suggestion: "Add a start node to your flowchart",
    enabled: true,
  },

  MISSING_SUCCESS_END_NODE: {
    id: "MISSING_SUCCESS_END_NODE",
    severity: ValidationSeverity.ERROR,
    message: "Challenge must have at least one Success end node",
    suggestion: "Add an end node and connect it as a success transition",
    enabled: true,
  },

  MISSING_FAILURE_END_NODE: {
    id: "MISSING_FAILURE_END_NODE",
    severity: ValidationSeverity.ERROR,
    message: "Challenge must have at least one Fail end node",
    suggestion: "Add an end node and connect it as a failure transition",
    enabled: true,
  },

  UNREACHABLE_NODE: {
    id: "UNREACHABLE_NODE",
    severity: ValidationSeverity.ERROR,
    message: "Node is not reachable from start node",
    suggestion:
      "Connect this node to the flow by adding edges from other nodes",
    enabled: true,
  },

  MISSING_SUCCESS_TRANSITION: {
    id: "MISSING_SUCCESS_TRANSITION",
    severity: ValidationSeverity.ERROR,
    message: "Node must have a success transition defined",
    suggestion: "Connect a success node to this intermediate node",
    enabled: true,
  },

  MISSING_FAILURE_TRANSITION: {
    id: "MISSING_FAILURE_TRANSITION",
    severity: ValidationSeverity.ERROR,
    message: "Node must have a failure transition defined",
    suggestion: "Connect a failure node to this intermediate node",
    enabled: true,
  },

  // Structural Issues (Errors)
  INVALID_NODE_SIZE: {
    id: "INVALID_NODE_SIZE",
    severity: ValidationSeverity.ERROR,
    message: "Node must have positive width and height",
    suggestion: "Ensure node dimensions are greater than 0",
    enabled: true,
  },

  DUPLICATE_NODE_IDS: {
    id: "DUPLICATE_NODE_IDS",
    severity: ValidationSeverity.ERROR,
    message: "Duplicate node IDs found",
    suggestion: "Ensure all nodes have unique identifiers",
    enabled: true,
  },

  // Content Issues (Warnings)
  MISSING_NODE_TITLE: {
    id: "MISSING_NODE_TITLE",
    severity: ValidationSeverity.ERROR, // Title is required
    message: "Node must have a title",
    suggestion: "Add a descriptive title to this node",
    enabled: true,
  },

  MISSING_NODE_DESCRIPTION: {
    id: "MISSING_NODE_DESCRIPTION",
    severity: ValidationSeverity.WARNING,
    message: "Node should have a description for better documentation",
    suggestion: "Add a description explaining this node's purpose",
    enabled: true,
  },

  NO_EVENTS: {
    id: "NO_EVENTS",
    severity: ValidationSeverity.WARNING,
    message:
      "Node has no events defined - consider adding triggers and effects",
    suggestion: "Add events to define node behavior during gameplay",
    enabled: true,
  },

  // Position Issues (Warnings)
  NODE_NEGATIVE_POSITION: {
    id: "NODE_NEGATIVE_POSITION",
    severity: ValidationSeverity.WARNING,
    message: "Node has negative position",
    suggestion: "Consider moving node to positive coordinates",
    enabled: true,
  },

  OVERLAPPING_NODES: {
    id: "OVERLAPPING_NODES",
    severity: ValidationSeverity.WARNING,
    message: "Nodes are overlapping",
    suggestion: "Reposition nodes to avoid overlap for better visibility",
    enabled: true,
  },

  // Content Length (Warnings)
  LONG_NODE_TITLE: {
    id: "LONG_NODE_TITLE",
    severity: ValidationSeverity.WARNING,
    message: "Node title is very long",
    suggestion: "Consider shortening the title for better readability",
    enabled: true,
  },

  LONG_NODE_DESCRIPTION: {
    id: "LONG_NODE_DESCRIPTION",
    severity: ValidationSeverity.WARNING,
    message: "Node description is very long",
    suggestion:
      "Consider shortening the description or breaking it into multiple parts",
    enabled: true,
  },
};

/**
 * Get validation configuration
 */
export const getValidationConfig = (): ValidationConfig => {
  // In the future, this could load from user preferences or environment settings
  return defaultValidationConfig;
};

/**
 * Check if validation rule is enabled
 */
export const isRuleEnabled = (ruleId: string): boolean => {
  const rule = validationRules[ruleId];
  return rule ? rule.enabled : false;
};

/**
 * Get validation rule configuration
 */
export const getValidationRule = (ruleId: string): ValidationRule | null => {
  return validationRules[ruleId] || null;
};
