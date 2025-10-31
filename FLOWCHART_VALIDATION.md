# Flowchart Validation System

## Overview

This system implements comprehensive validation for the Spin&Play No-Code Web-App flowchart editor, ensuring that challenge flowcharts meet the requirements specified in the Software Requirements Specification (SWRS).

## Validation Requirements (FR-3.27)

The validation system enforces the following core requirements:

### ✅ Structural Requirements

- **Exactly one Start node** - Each challenge must have one and only one start node
- **At least one Success & one Fail node** - End nodes connected as success/failure transitions
- **All nodes must be reachable via edges** - No orphaned or disconnected nodes
- **Transition definitions validated for presence** - All intermediate nodes must have success/failure transitions defined

### ⚠️ What We DON'T Validate (By Design)

Per FR-3.27, the system does **NOT** prevent:

- User-defined loops
- Circular paths
- Overlapping conditions
- Logical coherence of transitions

This is intentional - the validation focuses on structural completeness rather than logical validation.

## Validation Categories

### Errors (Must Fix)

- Missing start node
- Missing success/failure end nodes
- Unreachable nodes
- Missing transition definitions
- Invalid node structure
- Duplicate node IDs

### Warnings (Recommendations)

- Missing node descriptions
- No events defined on intermediate nodes
- Very long titles/descriptions (>100/500 characters)
- Node overlapping (UX improvement)**Note**: Node overlap validation was added back as a warning (not error) for UX improvement, though not required by documentation.

## Components

### FlowchartValidator Class

Located: `src/utils/validation/flowchartValidation.ts`

Main validation engine that:

- Analyzes challenge structure
- Checks node connectivity
- Validates transition definitions
- Returns structured validation results

### ValidationPanel Component

Located: `src/components/ValidationPanel/`

UI component that:

- Displays validation results
- Categorizes errors vs warnings
- Provides click-to-navigate functionality
- Shows suggestions for fixing issues

### Integration

The validation system is integrated into the Flowchart component:

- Manual validation via "Validate" button
- Automatic validation on challenge changes
- Real-time error highlighting
- Click navigation to problematic nodes

## Usage

### Triggering Validation

1. **Manual**: Click the "Validate" button in the flowchart editor
2. **Automatic**: Validation runs when challenge content changes

### Understanding Results

- **Green checkmark**: All validation passed
- **Red warning icon**: Issues found that must be fixed
- **Error count**: Shows total number of errors and warnings

### Fixing Issues

1. Click on any error/warning in the ValidationPanel
2. If the issue is associated with a specific node, clicking will navigate to that node
3. Follow the suggestions provided with each validation message

## Technical Details

### Validation Flow

1. Start node validation (exactly one required)
2. End nodes validation (success/failure nodes required)
3. Intermediate nodes validation (structure and transitions)
4. Reachability analysis (all nodes accessible)
5. Transition definitions check (presence validation)
6. Position and content warnings

### Data Structure

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

interface ValidationError {
  id: string;
  type: "error" | "warning";
  message: string;
  nodeId?: string;
  suggestion?: string;
}
```

### Node Type Detection

- **Success End Nodes**: End nodes connected as success transitions from intermediate nodes
- **Failure End Nodes**: End nodes connected as failure transitions from intermediate nodes
- **Reachability**: Determined by traversing connections from start node

## Examples

### Valid Challenge Structure

```
[Start Node] → [Intermediate Node] → [Success End Node]
                      ↓
                [Failure End Node]
```

### Invalid Examples

- Missing start node
- No success or failure end nodes
- Intermediate node without transitions
- Unreachable nodes

## Customization

To add new validation rules:

1. Add new validation method to `FlowchartValidator` class
2. Call the method in the `validate()` method
3. Use `addError()` or `addWarning()` to report issues
4. Update ValidationPanel styling if needed for new error types

## Performance Considerations

- Validation runs automatically but is debounced
- Large flowcharts (100+ nodes) may experience slight delays
- Validation results are cached until challenge structure changes
- Click navigation uses React Flow's built-in positioning

## Future Enhancements

Potential future improvements:

- Real-time validation feedback during editing
- Advanced logical validation options (opt-in)
- Export validation reports
- Custom validation rule configuration
- Integration with challenge testing framework
