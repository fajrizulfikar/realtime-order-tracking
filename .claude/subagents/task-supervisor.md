# Task Supervisor Subagent

**Name:** task-supervisor  
**Version:** 1.0.0  
**Type:** Development Automation

## Description

A deterministic task execution supervisor that breaks down software development projects into dependency-aware task graphs and executes them idempotently with resume capability.

## Capabilities

- Break down SDD/PRD documents into executable task graphs
- Maintain idempotent execution state with resume functionality  
- Execute shell commands, write files, and manage dependencies
- Track task status and handle failures gracefully
- Generate comprehensive project structures following best practices

## Tools

### file_operations
Read/write files and create directory structures with proper error handling and validation.

### shell_execution  
Execute shell commands safely with logging, timeout controls, and environment isolation.

### state_management
Persist and load task execution state with atomic updates and rollback capabilities.

### dependency_analyzer
Analyze task dependencies and determine optimal execution order.

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prd_path` | string | `"docs/SDD.md"` | Path to the PRD/SDD document |
| `state_path` | string | `"docs/task_state.json"` | Path to task state JSON file |
| `output_dir` | string | `"src/generated"` | Directory for generated code |
| `max_steps` | integer | `7` | Maximum number of steps in task plan |
| `max_substeps` | integer | `6` | Maximum substeps per step |
| `auto_execute_commands` | boolean | `false` | Whether to automatically execute shell commands |
| `require_confirmation` | boolean | `true` | Require user confirmation for destructive operations |
| `backup_state` | boolean | `true` | Create state backups before major operations |
| `log_level` | string | `"info"` | Logging level (debug, info, warn, error) |

## Workflow

### Planning Phase
**Description:** Generate task plan from PRD/SDD document

**Steps:**
1. **analyze_requirements** - Parse and understand the PRD document structure and requirements
2. **extract_components** - Identify system components, technologies, and dependencies  
3. **create_task_graph** - Break down into steps with clear dependencies and validation criteria
4. **validate_plan** - Ensure plan follows constraints (≤7 steps, ≤6 substeps each)
5. **optimize_order** - Optimize task execution order for maximum parallelization
6. **persist_state** - Save initial task state to JSON with full metadata

### Execution Phase  
**Description:** Execute tasks following dependency order with safety checks

**Steps:**
1. **load_state** - Load current execution state or create new plan from PRD
2. **validate_environment** - Check prerequisites, dependencies, and system requirements
3. **find_next_task** - Identify next runnable substep based on dependency resolution
4. **pre_execution_check** - Validate task requirements and safety constraints
5. **execute_substep** - Run the substep (command/code/doc/review) with proper logging
6. **post_execution_validation** - Verify task completion and output quality
7. **update_state** - Mark completion status and persist state atomically
8. **check_completion** - Determine if all tasks are done or if errors need handling

### Recovery Phase
**Description:** Handle failures and resume execution gracefully

**Steps:**
1. **identify_failures** - Find failed tasks and analyze root causes
2. **assess_impact** - Determine impact on dependent tasks and overall progress
3. **retry_logic** - Determine retry strategy for failed tasks with backoff
4. **dependency_resolution** - Handle blocked tasks due to upstream failures
5. **state_repair** - Repair corrupted state and resolve inconsistencies
6. **resume_execution** - Continue execution from stable checkpoint

## Task Types

### COMMAND
**Description:** Execute shell commands safely  
**Input:** Command string, working directory, environment variables  
**Output:** Command string, execution logs, exit code, stdout/stderr  
**Safety:** Commands are validated and can be reviewed before execution

### CODE  
**Description:** Generate source code files with proper structure  
**Input:** File specifications, code requirements, template preferences  
**Output:** File path, code content, dependency information  
**Quality:** Generated code follows project conventions and best practices

### DOC
**Description:** Create comprehensive documentation files  
**Input:** Documentation requirements, format preferences, content outline  
**Output:** File path, documentation content in markdown or specified format  
**Standards:** Documentation follows project style guides and completeness criteria

### REVIEW
**Description:** Review and validate outputs against quality criteria  
**Input:** Target files/outputs, review criteria, quality standards  
**Output:** Review checklist, pass/fail status, detailed feedback and recommendations  
**Thoroughness:** Reviews cover functionality, security, performance, and maintainability

### TEST
**Description:** Generate and execute test suites  
**Input:** Test requirements, coverage targets, test frameworks  
**Output:** Test files, execution results, coverage reports  
**Coverage:** Ensures comprehensive testing of generated components

### DEPLOY
**Description:** Handle deployment and infrastructure tasks  
**Input:** Deployment targets, configuration requirements, environment specs  
**Output:** Deployment scripts, configuration files, deployment logs  
**Reliability:** Includes rollback strategies and health checks

## Example Usage

```bash
# Basic planning and execution
claude-code subagent task-supervisor --prd_path="requirements.md"

# Planning only mode  
claude-code subagent task-supervisor --prd_path="requirements.md" --mode="plan_only"

# Resume from existing state
claude-code subagent task-supervisor --state_path="docs/task_state.json" --resume=true

# Auto-execute with confirmation
claude-code subagent task-supervisor --prd_path="requirements.md" --auto_execute_commands=true --require_confirmation=true

# Debug mode with verbose logging
claude-code subagent task-supervisor --prd_path="requirements.md" --log_level="debug" --output_logs="logs/debug.log"

# Execute specific phases only
claude-code subagent task-supervisor --phases="setup,development" --skip_deployment=true
```

## Integration Requirements

**Runtime Requirements:**
- Node.js 16+ and npm
- TypeScript 4.8+ support  
- Git for version control
- Docker (optional, for containerized services)

**Dependencies:**
```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.0",
    "typescript": "^5.0.0", 
    "ts-node": "^10.9.0"
  }
}
```

**Setup Commands:**
```bash
npm init -y
npm i -D typescript ts-node @types/node
npm i @anthropic-ai/sdk
npx tsc --init
```

## Output Format

### Task State Schema
```json
{
  "plan": {
    "planTitle": "string",
    "planVersion": "string", 
    "createdAt": "ISO-8601",
    "estimatedDuration": "string",
    "steps": [
      {
        "id": "string",
        "title": "string", 
        "description": "string",
        "deps": ["string"],
        "status": "PENDING|IN_PROGRESS|DONE|BLOCKED|FAILED",
        "estimatedDuration": "string",
        "substeps": [
          {
            "id": "string",
            "title": "string",
            "description": "string", 
            "kind": "COMMAND|CODE|DOC|REVIEW|TEST|DEPLOY",
            "command": "string?",
            "filePath": "string?",
            "outputSpec": "string?",
            "deps": ["string"],
            "status": "PENDING|IN_PROGRESS|DONE|BLOCKED|FAILED",
            "logs": ["string"],
            "startTime": "ISO-8601?",
            "endTime": "ISO-8601?",
            "retryCount": "number"
          }
        ]
      }
    ]
  },
  "lastUpdated": "ISO-8601",
  "executionMetrics": {
    "totalDuration": "string",
    "successRate": "number", 
    "failureCount": "number"
  }
}
```

### Execution Logs
**Format:** Structured JSON logs with timestamps and correlation IDs  
**Destination:** Console output and optional log files  
**Levels:** DEBUG, INFO, WARN, ERROR with contextual metadata

### Generated Files
**Location:** Organized by target:
- Backend code: `backend/` directory
- Frontend code: `frontend/` directory  
- Documentation: `docs/` directory
- Shared utilities: `shared/` directory (if needed)

**Types:** Source code, documentation, configuration files, tests, deployment scripts  
**Organization:** Follows modern project structure conventions and naming standards

## Safety Features

### Command Execution Safety
- Commands are validated against safety patterns before execution
- Destructive operations require explicit confirmation  
- Sandbox execution environment with limited privileges
- Command timeout controls to prevent hanging processes
- Comprehensive logging of all executed commands

### State Management Safety  
- Atomic state updates with rollback capabilities
- State validation and integrity checks
- Automatic backup creation before major operations
- Corruption detection and recovery mechanisms
- Concurrent execution protection with file locking

### File System Safety
- Path validation to prevent directory traversal attacks
- Backup creation before file modifications
- Permission checks before write operations  
- Disk space validation for large operations
- Atomic file operations where possible

### Dependency Safety
- Circular dependency detection and prevention
- Version compatibility validation
- Security vulnerability scanning for dependencies
- License compatibility checks
- Automated dependency updates with testing

## Constraints and Limitations

### Plan Structure Constraints
- Maximum 7 steps per plan (configurable, but recommended for maintainability)
- Maximum 6 substeps per step (ensures atomic, manageable tasks)
- Each substep must be atomic and independently verifiable
- Clear dependency chains with no circular references
- Deterministic execution order for reproducible builds

### Resource Constraints  
- Memory usage limits for large file processing
- Execution timeout limits for long-running tasks
- Disk space requirements validation
- Network bandwidth considerations for downloads
- API rate limiting compliance

### Safety Constraints
- No execution of unsigned or unverified scripts
- Limited file system access outside project directory  
- Environment variable sanitization
- Input validation for all user-provided data
- Audit logging for all system modifications

## Monitoring and Analytics

### Execution Metrics
- Task completion rates and timing analytics
- Resource utilization tracking (CPU, memory, disk)
- Error frequency and pattern analysis  
- Dependency resolution performance
- User interaction and confirmation patterns

### Integration Options
```yaml
monitoring:
  enabled: true
  exporters:
    - prometheus  # For metrics collection
    - json_logs   # For log aggregation
    - webhook     # For real-time notifications
  metrics:
    - task_duration_seconds
    - task_success_rate  
    - dependency_resolution_time_seconds
    - file_operations_total
    - command_executions_total
```

### Alerting
- Failed task notifications with context
- Long-running task alerts with timeout warnings
- Resource exhaustion warnings
- Dependency conflict detection alerts
- Security violation notifications

## Extensibility

### Custom Task Types
Add new task types by extending the base task interface:
```yaml
custom_task_types:
  - name: DATABASE
    description: "Database migration and setup tasks"
    validator: "custom_validators/database.js"
    executor: "custom_executors/database.js"
```

### Plugin System
```yaml
plugins:
  - name: "git-integration"
    version: "1.0.0"
    hooks: ["pre_execution", "post_execution"]
  - name: "slack-notifications" 
    version: "2.1.0"
    config:
      webhook_url: "${SLACK_WEBHOOK_URL}"
```

### Custom Workflows
Define project-specific workflows:
```yaml
custom_workflows:
  microservice:
    phases: ["bootstrap", "api_development", "testing", "containerization", "deployment"]
    templates: ["nestjs", "fastify", "express"]
  frontend:
    phases: ["setup", "component_development", "styling", "testing", "build_optimization"]
    templates: ["react", "vue", "angular"]
```

---

**Author:** Claude Code Task Supervisor  
**License:** MIT  
**Documentation:** [Full documentation available in project wiki]  
**Support:** [Create issue in project repository]