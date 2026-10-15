---
name: optimize
description: Profile a measured performance problem, compare variants, and commit verified improvements. Save experiment reports under .cartoons/optimize/. Use for systematic latency, throughput, memory, or cost work; use debug for regressions and execute for a known small fix.
disable-model-invocation: true
---

# Optimize

Measure-driven performance optimization loop: profile → attribute → generate variants → test → keep best → repeat.

## Prerequisites

Before starting:
- **Baseline measurement**: Know current performance (how slow? how much memory?)
- **Target**: What's acceptable? (e.g., "reduce API latency from 800ms to <200ms")
- **Measurement harness**: Can you measure the target metric reliably?
- **Representative workload**: Real data, realistic conditions
- **Decision thresholds**: Minimum worthwhile gain above measurement noise, acceptable complexity, and a time or iteration budget. Propose workload-based defaults if unspecified and report them; let the user adjust them.

Establish missing measurements and targets before changing code. A percentage threshold is not universal: a smaller gain can matter if it reliably meets the target.

## Process

### Phase 1: Profile and Attribute

Identify where time/memory/resources are actually spent.

**Profile first**:
```bash
# Examples - use appropriate tool for the stack
# Node.js
node --prof app.js
node --prof-process isolate-*.log

# Python
python -m cProfile -o profile.stats app.py
python -m pstats profile.stats

# Ruby
ruby-prof app.rb

# Go
go test -cpuprofile cpu.prof -memprofile mem.prof
go tool pprof cpu.prof
```

**Attribute cost**:
- Which function/module consumes most time/memory?
- Is it I/O-bound (network, disk) or CPU-bound (computation)?
- What's the call frequency? (expensive but rare vs cheap but frequent)
- Are there obvious inefficiencies? (N+1 queries, unnecessary allocations, blocking calls)

**Document baseline**:
Choose the unused run directory described under Output before writing the first report. Create `<run-dir>/baseline.md`:
```markdown
# Optimization: [Feature/Component]

## Baseline (YYYYMMDD HH:MM)

**Metric**: [latency / throughput / memory / cost]
**Current**: [measurement with units]
**Target**: [target with units]
**Gap**: [how far from target]

## Profile Results

**Top contributors**:
1. [function/module]: [% of time/memory] - [why expensive]
2. [function/module]: [% of time/memory] - [why expensive]
3. ...

**Attribution**:
- **Bottleneck type**: [I/O-bound / CPU-bound / memory-bound]
- **Root cause**: [N+1 queries / inefficient algorithm / excessive allocations / etc]
- **Evidence**: [profile output or specific measurements]
```

**Stop if**:
- No clear bottleneck found → measurement might be wrong, or optimization not worth it
- Bottleneck is external (third-party API, database on other team) → escalate, don't optimize here

### Phase 2: Generate Variants

Create optimization candidates based on attribution.

**Common strategies by bottleneck type**:

**I/O-bound (network, disk)**:
- Cache frequently accessed data
- Batch requests (reduce round trips)
- Async/parallel instead of sequential
- Connection pooling
- Compression

**CPU-bound (computation)**:
- Better algorithm (O(n²) → O(n log n))
- Memoization/caching computed results
- Reduce work (skip unnecessary calculations)
- SIMD/vectorization (if available)
- Move to native code (C extension, Rust, etc.)

**Memory-bound (allocations, GC pressure)**:
- Object pooling
- Reduce allocations (reuse buffers)
- Streaming instead of loading all at once
- Lazy evaluation
- Smaller data structures

**For each variant**:
- Describe the change
- Estimate impact (how much faster?)
- Estimate risk (how likely to break?)

Rank by (impact / risk) ratio. Start with highest ratio.

### Phase 3: Implement and Test Variants

One variant at a time.

**Workflow**:
1. Before the first variant, inspect the branch and working tree and record existing changes. On the default branch, get the user's consent to work there or create `feature/YYYYMMDD-optimize-<name>`. Reuse that branch for later variants.
2. Implement the variant
3. Run tests (ensure correctness)
4. Measure performance with same harness as baseline
5. Document results in `<run-dir>/variant-N.md`, using the directory selected for the baseline

**Variant results template**:
```markdown
# Variant N: [variant name]

**Branch**: `<current-feature-branch>`
**Commit**: [commit hash]

## Change

[description of what was changed]

## Measurement

**Before**: [current kept version, measured with the baseline harness]
**After**: [variant measurement under the same conditions]
**Improvement**: [% or absolute difference]

## Trade-offs

- **Pros**: [benefits beyond performance, if any]
- **Cons**: [added complexity, dependencies, maintenance burden]

## Correctness

- [ ] All tests pass
- [ ] Manual verification: [what you checked]
- [ ] Edge cases tested: [list any specific edge cases]

## Decision

[keep / revert / needs more work]
```

**Keep or revert**:
- **Keep** if tests pass, complexity is acceptable, and the measured gain exceeds noise and either meets the agreed minimum gain or reaches the target
- **Revert** if correctness fails, cost is unacceptable, or the gain does not meet those criteria
- **Iterate** if promising but needs refinement

For keeps: commit only the verified variant's code on the current branch, following `./references/git-commit.md`. Include the actual run directory in the commit body.
For reverts: record why and undo only this variant's code changes. Preserve existing user changes and every experiment report. If the changes cannot be separated safely, stop and ask. Do not delete a branch or merge without the user's decision.

### Phase 4: Stopping Criteria

Iterate (Phase 1 → Phase 2 → Phase 3) until one of:

1. **Target met**: Performance now meets or exceeds target
2. **Plateau**: Last 2-3 variants failed to deliver the agreed worthwhile gain
3. **Budget exhausted**: Time/effort limit reached
4. **Diminishing returns**: Further optimization requires disproportionate effort

**Final report** in `<run-dir>/summary.md`, in the same selected directory:
```markdown
# Optimization Summary: [Feature/Component]

**Date**: YYYYMMDD
**Iterations**: [N variants tested]

## Results

**Baseline**: [original measurement]
**Final**: [current measurement]
**Improvement**: [% or absolute difference]
**Target**: [target] - [met / not met]

## Variants Applied

1. [Variant name] - [improvement] - [commit hash]
2. [Variant name] - [improvement] - [commit hash]
...

## Variants Rejected

1. [Variant name] - [reason: insufficient improvement / too complex / broke tests]
...

## Stopping Reason

[Target met / Plateau / Budget / Diminishing returns]

## Next Steps

[If target not met: recommend next actions or escalation]
[If target met: monitoring recommendations]
```

### Phase 5: Commit

Kept variants are committed individually. Commit any remaining verified optimization changes on the current branch, staging only this work's code and tests and checking `git diff --staged`. Reports under `.cartoons/` stay uncommitted. Do not create an empty final commit, merge, or push; report the branch and let the user decide integration.

Commit message:
```
perf(<scope>): <summary of improvement>

Improved [metric] from [before] to [after] ([X%] improvement).

Optimizations applied:
- [variant 1 description]
- [variant 2 description]

Measurement methodology: [how you measured]
Target: [target] - [met/not met]
Experiment: [actual run directory]
```

Reference `./references/git-commit.md` for commit conventions.

## Output

- **Run directory**: default `.cartoons/optimize/YYYYMMDD-HHMM/`. If it exists, use the next unused `-2`, `-3`, or later suffix for the entire new run, even if one expected report is absent. Never overwrite an earlier run. Keep that actual directory for all reports, links, summaries, and commit messages.
  - `baseline.md`: initial profile and attribution
  - `variant-N.md`: each tested variant
  - `summary.md`: final results
- **Committed**: optimization code changes (not the `.cartoons/` reports)
- **Branch**: the current approved branch or `feature/YYYYMMDD-optimize-<name>`; left for the user's integration decision

## Principles

- **Measure first**: Never optimize without profiling
- **Attribute correctly**: Optimize the actual bottleneck, not a guess
- **One change at a time**: Test variants independently
- **Keep it correct**: Tests must pass
- **Know when to stop**: Don't over-optimize
- **Document experiments**: Failed variants teach as much as successes

## Examples

### Example 1: API latency optimization

**Baseline**: API response time 800ms (target: <200ms)

**Profile**: 
- Database queries: 600ms (75%)
- Business logic: 150ms (19%)
- Serialization: 50ms (6%)

**Variants tested**:
1. Add database indexes → 800ms → 350ms (56% improvement) ✓ Keep
2. Cache common queries → 350ms → 180ms (49% improvement) ✓ Keep

**Result**: Target met (180ms < 200ms), 2 variants tested and kept; stop without another variant.

### Example 2: Memory usage optimization

**Baseline**: Worker process uses 2GB RAM (target: <500MB)

**Profile**:
- Large objects in memory cache: 1.5GB (75%)
- Application state: 400MB (20%)
- Overhead: 100MB (5%)

**Variants tested**:
1. Reduce cache TTL → 2GB → 1.2GB (40% improvement) ✓ Keep
2. LRU eviction with size limit → 1.2GB → 600MB (50% improvement) ✓ Keep
3. Stream processing instead of buffering → 600MB → 450MB (25% improvement) ✓ Keep

**Result**: Target met (450MB < 500MB), 3 iterations, stopped after target met.

### Example 3: Build time optimization

**Baseline**: CI build takes 25 minutes (target: <10 minutes)

**Profile**:
- Test suite: 15 minutes (60%)
- Compilation: 8 minutes (32%)
- Linting: 2 minutes (8%)

**Variants tested**:
1. Parallel test execution → 25min → 12min (52% improvement) ✓ Keep
2. Incremental compilation → 12min → 9min (25% improvement) ✓ Keep

**Result**: Target met (9min < 10min), 2 variants tested and kept; stop without another variant.

## Integration with Other Skills

- **Before optimize**: Use `debug` if it's a regression (performance used to be better)
- **Before optimize**: Use `execute` if it's a simple known fix (add an index, fix N+1 query)
- **After optimize**: Recommend `capture` for non-obvious insights, if any
- **If a risky approach needs a spike**: Stop and recommend `clarify` for validation

Report the saved summary, measurements, checks, commits, and current branch, then stop. Do not invoke another skill.
