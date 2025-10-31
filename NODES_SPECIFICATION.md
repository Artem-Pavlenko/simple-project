# Node Structure Specification

## Overview

This document describes the complete structure of nodes in the Spin&Play No-Code Web-App flowchart system. The flowchart data is designed to be exported as JSON and compiled by a C++ programmer into executable code for the hardware platform.

## Type Definitions

### Core Types

```typescript
// Node variant types
type NodeVariants = IStartNode | IntermediateNode | IEndNode;

// Node type identifiers
type NodeType = "start" | "node" | "end";
```

### Key Constants

#### RESTART Identifier

```typescript
const RESTART_NODE_ID = "RESTART";
```

**Important**: The RESTART mechanism is identified by the exact string constant `"RESTART"` in the `failure.id` property. This constant is used by the flowchart system to distinguish between:

- Regular intermediate node transitions
- RESTART behavior (self-loop)

When `failure.id === "RESTART"`, the system knows this is not a regular transition to another node, but a restart instruction.

## Node Types

### 1. Start Node (IStartNode)

**Purpose**: Entry point of the challenge execution

```typescript
interface IStartNode {
  id: string; // Unique identifier
  type: "start"; // Node type identifier
  x: number; // Position X coordinate
  y: number; // Position Y coordinate
  width: number; // Node width in pixels
  height: number; // Node height in pixels
}
```

**Characteristics**:

- Only one Start node per challenge
- No incoming connections
- Has one outgoing connection to the first Intermediate node
- No configuration parameters

**JSON Example**:

```json
{
  "id": "start-node",
  "type": "start",
  "x": 100,
  "y": 100,
  "width": 120,
  "height": 60
}
```

### 2. Intermediate Node (IntermediateNode)

**Purpose**: Main logic units containing triggers, effects, and transitions

```typescript
interface IntermediateNode {
  id: string; // Unique identifier
  type: "node"; // Node type identifier
  x: number; // Position X coordinate
  y: number; // Position Y coordinate
  width: number; // Node width in pixels
  height: number; // Node height in pixels
  title: string; // Human-readable node name
  description: string; // Detailed description
  entryEffects: Effect[]; // Effects executed on node entry
  exitEffects: Effect[]; // Effects executed on node exit
  timeOut: TimeOut | null; // Optional timeout configuration
  events: EventType[]; // Trigger-effect pairs
  success: NodeVariants; // Success transition target
  failure: NodeVariants; // Failure transition target
}
```

**Key Features**:

- Contains the main challenge logic
- Has both success and failure transitions
- Supports timeout with associated effects
- Can have multiple trigger-effect pairs

### 3. End Node (IEndNode)

**Purpose**: Terminal points representing success or failure outcomes

```typescript
interface IEndNode {
  id: string; // Unique identifier
  type: "end"; // Node type identifier
  x: number; // Position X coordinate
  y: number; // Position Y coordinate
  width: number; // Node width in pixels
  height: number; // Node height in pixels
}
```

**Characteristics**:

- Terminal nodes with no outgoing connections
- Can be either success or failure endpoints
- Determined by connection type from intermediate nodes

## Flow Control Mechanisms

### Success/Failure Transitions

Every Intermediate node has two possible outcomes:

1. **Success Transition** (`success` property)
2. **Failure Transition** (`failure` property)

Both can point to:

- End nodes (terminal outcomes)
- Other Intermediate nodes (continued flow)
- Special RESTART identifier

### RESTART Mechanism

**Purpose**: Allows a node to restart itself on failure

**Key Constant**: The RESTART mechanism is based on the special identifier constant `"RESTART"`

```typescript
// RESTART failure configuration
const RESTART_FAILURE = {
  id: "RESTART", // ← This exact string triggers restart behavior
  type: "node",
  // Other properties are placeholder/unused
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  title: "",
  description: "",
  entryEffects: [],
  exitEffects: [],
  timeOut: null,
  events: [],
  success: {
    /* placeholder */
  },
  failure: {
    /* placeholder */
  },
};
```

**Implementation Details**:

- When `failure.id === "RESTART"`, the node restarts itself instead of transitioning
- The string `"RESTART"` is a special constant recognized by the flowchart system
- This distinguishes restart behavior from regular intermediate node transitions
- Visually indicated by a red curved arrow in the UI
- Entry effects are re-executed on restart

## Effects System

### Effect Types

Effects are actions executed by the hardware platform:

#### 1. Play Sound Effect

```typescript
{
  type: "play-sound";
  sound: string;           // Sound file identifier
  pitchModifier?: number;  // Pitch modification (default: 1)
}
```

#### 2. Set Rod Speed Effect

```typescript
{
  type: "set-rod-speed";
  speed: number; // Absolute speed value
}
```

#### 3. Change Rod Speed Effect

```typescript
{
  type: "change-rod-speed";
  speed: number; // Relative speed change (+/-)
}
```

#### 4. Blink LED Effect

```typescript
{
  type: "blink-led";
  led: LedType; // LED identifier ("L1" to "L8")
  seconds: number; // Blink duration
  color: `#${string}`; // Hex color code
}
```

#### 5. Set LED Effect

```typescript
{
  type: "set-led";
  led: LedType;           // LED identifier ("L1" to "L8")
  on: boolean;            // LED state (on/off)
  color?: `#${string}`;   // Hex color code (when on)
}
```

#### 6. Success/Failure Effects

```typescript
{
  type: "success" | "failure";
  // No additional parameters
}
```

### LED Types

```typescript
type LedType = "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7" | "L8";
```

## Triggers System

### Trigger Types

Triggers define when events should fire:

#### 1. Pad Press Trigger

```typescript
{
  type: "pad-press";
  pad: string; // Pad identifier (e.g., "P3")
}
```

#### 2. Pad Release Trigger

```typescript
{
  type: "pad-release";
  pad: string; // Pad identifier
}
```

#### 3. Timer Once Trigger

```typescript
{
  type: "timer-once";
  seconds: number; // Delay before firing
}
```

#### 4. Timer Periodic Trigger

```typescript
{
  type: "timer-periodic";
  seconds: number; // Interval between firings
}
```

#### 5. Rod Hit Trigger

```typescript
{
  type: "rod-hit";
  // No additional parameters
}
```

### Event Structure

Events pair triggers with effects:

```typescript
interface EventType {
  trigger: Trigger; // When to fire
  effects: Effect[]; // What to execute
}
```

## Timeout System

### Timeout Configuration

```typescript
interface TimeOut {
  type: "timer-once"; // Always timer-once for timeouts
  seconds: number; // Timeout duration
  effects: Effect[]; // Effects to execute on timeout
}
```

**Behavior**:

- Timer starts when node is entered
- If timeout expires, associated effects are executed
- Node behavior after timeout depends on implementation
- Can be used for automatic progression or failure handling

## Flow Execution Model

### Node Lifecycle

1. **Entry**:

   - Execute `entryEffects`
   - Start timeout timer (if configured)
   - Begin monitoring for triggers

2. **Active State**:

   - Wait for trigger events
   - Execute associated effects when triggers fire
   - Monitor for success/failure conditions

3. **Exit**:
   - Execute `exitEffects`
   - Stop timeout timer
   - Transition to next node or restart

### Execution Priority

1. **Entry Effects**: Immediate execution on node entry
2. **Trigger Events**: Execute when conditions are met
3. **Timeout Effects**: Execute when timeout expires
4. **Exit Effects**: Execute before leaving node

## JSON Export Structure

### Complete Challenge Structure

```json
{
  "id": "challenge-uuid",
  "title": "Challenge Name",
  "description": "Challenge description",
  "startNode": {
    "id": "start-node",
    "type": "start",
    "x": 100,
    "y": 100,
    "width": 120,
    "height": 60
  },
  "nodes": {
    "node-1": {
      "id": "node-1",
      "type": "node",
      "x": 300,
      "y": 150,
      "width": 180,
      "height": 120,
      "title": "Main Challenge",
      "description": "Primary challenge logic",
      "entryEffects": [
        {
          "type": "play-sound",
          "sound": "start-beep",
          "pitchModifier": 1
        }
      ],
      "exitEffects": [],
      "timeOut": {
        "type": "timer-once",
        "seconds": 30,
        "effects": [
          {
            "type": "failure"
          }
        ]
      },
      "events": [
        {
          "trigger": {
            "type": "pad-press",
            "pad": "P3"
          },
          "effects": [
            {
              "type": "success"
            }
          ]
        }
      ],
      "success": {
        "id": "success-end",
        "type": "end",
        "x": 550,
        "y": 100,
        "width": 120,
        "height": 60
      },
      "failure": {
        "id": "RESTART",
        "type": "node",
        "x": 0,
        "y": 0,
        "width": 0,
        "height": 0,
        "title": "",
        "description": "",
        "entryEffects": [],
        "exitEffects": [],
        "timeOut": null,
        "events": [],
        "success": {},
        "failure": {}
      }
    }
  },
  "endNodes": [
    {
      "id": "success-end",
      "type": "end",
      "x": 550,
      "y": 100,
      "width": 120,
      "height": 60
    }
  ]
}
```

## RESTART Mechanism - Detailed Description

### Overview

The RESTART mechanism is a special failure handling feature that allows an intermediate node to restart itself instead of transitioning to another node when a failure occurs. This is particularly useful when players fail to complete the challenge or when the timeout expires.

### When RESTART is Triggered

RESTART can be triggered by several failure conditions:

1. **Timeout Expiration**: When the timeout configured in the intermediate node expires
2. **Explicit Failure Effects**: When a trigger-effect pair executes a "failure" effect
3. **Wrong Actions**: When players perform incorrect actions that trigger failure logic
4. **Challenge Not Completed**: When players don't meet the success criteria within the time limit

### How RESTART Works

#### Configuration

When configuring a node's failure action, you can choose:

- **"Go to End Node"**: Normal behavior - transition to a failure end node
- **"Restart This Node"**: Special behavior - restart the current node

#### Technical Implementation

When RESTART is selected, the node's `failure` property is set to a special object with `id: "RESTART"`:

```json
{
  "id": "RESTART",
  "type": "node",
  "x": 0,
  "y": 0,
  "width": 0,
  "height": 0,
  "title": "",
  "description": "",
  "entryEffects": [],
  "exitEffects": [],
  "timeOut": null,
  "events": [],
  "success": {},
  "failure": {}
}
```

**Critical Implementation Detail**:

- The flowchart system detects RESTART by checking: `failure.id === "RESTART"`
- This exact string constant `"RESTART"` is the identifier that triggers restart behavior
- All other properties in the RESTART failure object are placeholders and unused
- The system recognizes this as a special instruction, not a regular node transition

#### Visual Indication

- A red curved arrow is displayed on the node
- The arrow starts from the failure handle (right side, bottom)
- Curves around the node and points back to the bottom center
- Indicates the failure-to-restart flow visually

#### Execution Behavior

1. **Normal Operation**: Node executes as usual with triggers and effects
2. **Failure Condition**: When a failure event occurs:
   - **Timeout expires**: The timeout set in node settings (e.g., 30 seconds) runs out
   - **Failure effect triggered**: A trigger-effect pair executes a "failure" effect
   - **Wrong action**: Player performs an incorrect action that leads to failure
3. **Restart Process**:
   - Execute `exitEffects` (if any)
   - **DO NOT** transition to another node
   - Return to the same node's entry point
   - Execute `entryEffects` again
   - Reset timeout timer (if configured) - timer starts from beginning
   - Begin monitoring triggers again
   - Give player another chance to complete the challenge

#### Use Cases

- **Retry Logic**: Give players multiple attempts when they fail the challenge
- **Timeout Recovery**: When players don't respond or complete the task within the time limit
- **Learning Mode**: Allow practice without penalizing failures - players can try again
- **Complex Challenges**: Multi-step tasks where failure should reset the entire sequence
- **Mistake Forgiveness**: Players can recover from wrong actions without ending the game

#### Example Scenario

```
Node: "Hit the correct pad sequence within 10 seconds"
- Entry Effect: Play instruction sound "Hit pads P1, P2, P3 in order"
- Timeout: 10 seconds → Failure effect (RESTART)
- Events:
  - Correct sequence (P1→P2→P3) → Success effect (go to next challenge)
  - Wrong sequence → Failure effect (RESTART)
  - No action for 10 seconds → Timeout triggers failure (RESTART)

Behavior:
1. Player enters node → instruction sound plays → 10-second timer starts
2. Player hits wrong sequence (P2 first) → node restarts → instruction plays again → timer resets to 10s
3. Player doesn't respond in 10s → timeout triggers → node restarts → instruction plays again → timer resets to 10s
4. Player hits correct sequence (P1→P2→P3) → success → proceeds to next challenge
```

#### Real-World Example

```
Challenge: "Memory Game - Repeat the LED sequence"
- Entry Effect: Show LED sequence (L1→L3→L2 blinks)
- Timeout: 15 seconds
- Success: Player presses correct pad sequence
- Failure (RESTART): Wrong sequence OR timeout

Flow:
1. LEDs blink the pattern → 15-second timer starts
2. If player presses wrong pads → RESTART → LEDs show pattern again
3. If 15 seconds pass without response → RESTART → LEDs show pattern again
4. If player repeats correct sequence → Success → move to next level
```

#### Important Notes

- Entry effects are **re-executed** on each restart
- Exit effects are executed before each restart
- Timers are **reset** on restart
- RESTART creates a local loop without affecting the overall flow structure
- Players can potentially stay in a RESTART node indefinitely until they succeed
- **The constant `"RESTART"` is the key identifier** - the system checks `failure.id === "RESTART"` to determine restart behavior
- Only intermediate nodes can have RESTART failure behavior

### Comparison: RESTART vs Normal Failure

| Aspect        | Normal Failure                    | RESTART Failure              |
| ------------- | --------------------------------- | ---------------------------- |
| Target        | Different node (usually end node) | Same node                    |
| Entry Effects | Not re-executed                   | Re-executed on restart       |
| Exit Effects  | Executed once                     | Executed before each restart |
| Timer         | Stops                             | Resets on restart            |
| Flow          | Progresses forward                | Loops locally                |
| Visual        | Red arrow to target node          | Red curved arrow to self     |
| Use Case      | Definitive failure/success        | Retry mechanism              |

## Validation Requirements

Before JSON export, ensure:

1. **Structural Validity**:

   - Exactly one start node
   - At least one success and one failure end node
   - All nodes reachable from start node
   - Valid transition targets

2. **Data Integrity**:

   - All required fields present
   - Valid effect parameters
   - Consistent node references
   - Proper coordinate values

3. **Hardware Constraints**:
   - LED identifiers within valid range
   - Sound files exist in asset library
   - Speed values within motor limits
   - Timer values within reasonable bounds

## Version History

- **v1.0**: Initial node structure definition
- **v1.1**: Added RESTART mechanism
- **v1.2**: Enhanced effect and trigger systems
- **v1.3**: Timeout functionality implementation
- **v1.4**: Complete JSON export specification

---
