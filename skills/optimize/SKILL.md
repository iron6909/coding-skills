---
name: optimize
description: Systematic performance optimization with measurement-driven iteration. Use when performance is inadequate and needs methodical improvement through profiling, attribution, variant testing, and stopping criteria. Not for ad-hoc tweaks—use execute or debug for those.
disable-model-invocation: true
---

# Optimize

Measure-driven performance optimization loop: profile → attribute → generate variants → test → keep best → repeat.

## When to use

- Performance is measurably inadequate (too slow, too much memory, too expensive)
- User explicitly asks for optimization or performance improvement
- Metrics show degradation that needs systematic improvement
- Clear performance target exists (latency < 100ms, throughput > 1000 req/s, memory < 500MB)

**Do not use for**:
- Ad-hoc performance tweaks → use `execute`
- Performance bug (regression) → use `debug`
- Unclear what to optimize → measure first, then come back
- "Make it faster" without baseline or target → establish metrics first

## Prerequisites

Before starting:
- **Baseline measurement**: Know current performance (how slow? how much memory?)
- **Target**: What's acceptable? (e.g., "reduce API latency from 800ms to <200ms")
- **Measurement harness**: Can you measure the target metric reliably?
- **Representative workload**: Real data, realistic conditions

If missing, establish these first before invoking optimize.

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
Create `.cartoons/optimize-YYYYMMDD-HHMM/baseline.md`:
```markdown
# Optimization: [Feature/Component]

## Baseline (YYYY-MM-DD HH:MM)

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
1. Create a feature branch: `optimize/YYYYMMDD-<variant-name>`
2. Implement the variant
3. Run tests (ensure correctness)
4. Measure performance with same harness as baseline
5. Document results in `.cartoons/optimize-YYYYMMDD-HHMM/variant-N.md`

**Variant results template**:
```markdown
# Variant N: [variant name]

**Branch**: `optimize/YYYYMMDD-<variant-name>`
**Commit**: [commit hash]

## Change

[description of what was changed]

## Measurement

**Before**: [baseline measurement]
**After**: [new measurement]
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
- **Keep** if improvement ≥ 10% and tests pass and complexity is acceptable
- **Revert** if improvement < 10% or tests fail or complexity too high
- **Iterate** if promising but needs refinement

For keeps: merge to main branch (or keep on optimization branch if batching).
For reverts: document why, then delete branch.

### Phase 4: Stopping Criteria

Iterate (Phase 1 → Phase 2 → Phase 3) until one of:

1. **Target met**: Performance now meets or exceeds target
2. **Plateau**: Last 2-3 variants showed < 5% improvement each
3. **Budget exhausted**: Time/effort limit reached
4. **Diminishing returns**: Further optimization requires disproportionate effort

**Final report** in `.cartoons/optimize-YYYYMMDD-HHMM/summary.md`:
```markdown
# Optimization Summary: [Feature/Component]

**Date**: YYYY-MM-DD
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

If multiple optimization commits were made, they're already committed individually. No final commit needed.

If all work was on a single optimization branch, merge to main:
```bash
git checkout main
git merge optimize/YYYYMMDD-<name>
```

Commit message for merge or final commit:
```
perf(<scope>): <summary of improvement>

Improved [metric] from [before] to [after] ([X%] improvement).

Optimizations applied:
- [variant 1 description]
- [variant 2 description]

Measurement methodology: [how you measured]
Target: [target] - [met/not met]
```

Reference `./references/git-commit.md` for commit conventions.

## Output

- **Location**: `.cartoons/optimize-YYYYMMDD-HHMM/`
  - `baseline.md`: initial profile and attribution
  - `variant-N.md`: each tested variant
  - `summary.md`: final results
- **Committed**: optimization code changes (not the `.cartoons/` reports)
- **Branches**: may create temporary `optimize/YYYYMMDD-<name>` branches

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
3. Optimize serialization → 180ms → 170ms (6% improvement) ✗ Revert (marginal)

**Result**: Target met (170ms < 200ms), 2 iterations, stopped after target met.

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
3. Cache dependencies → 9min → 8.5min (6% improvement) ✗ Revert (marginal)

**Result**: Target met (9min < 10min), 2 iterations, stopped after target met.

## Integration with Other Skills

- **Before optimize**: Use `debug` if it's a regression (performance used to be better)
- **Before optimize**: Use `execute` if it's a simple known fix (add an index, fix N+1 query)
- **After optimize**: Use `capture` to record non-obvious optimization insights
- **During optimize**: May use `prototype` to test a risky optimization approach before committing

## Notes

Optimization is a specialized workflow. Most performance improvements are simple fixes (add an index, fix obvious inefficiency) that go through `execute`. Use `optimize` only when:
- The bottleneck is unclear (need profiling)
- Multiple approaches might work (need comparison)
- Target is specific and measurable

Avoid premature optimization. Optimize only when:
- Performance is measurably inadequate
- Users/metrics confirm it's a real problem
- You have a clear target

"Make it faster" without measurement is not optimization—it's guessing.
