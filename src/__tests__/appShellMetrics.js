export const WORKSPACE_BUDGETS = {
  desktop: {
    viewportHeight: 900,
    baselineTopbarHeight: 128,
    compactTopbarHeight: 56,
  },
}

export function calculateWorkspaceGainPercent({
  viewportHeight,
  baselineTopbarHeight,
  compactTopbarHeight,
}) {
  const baselineWorkspace = viewportHeight - baselineTopbarHeight
  const compactWorkspace = viewportHeight - compactTopbarHeight

  if (baselineWorkspace <= 0) {
    return 0
  }

  return ((compactWorkspace - baselineWorkspace) / baselineWorkspace) * 100
}

export function calculateP95(samples) {
  if (!Array.isArray(samples) || samples.length === 0) {
    return 0
  }

  const sorted = [...samples].sort((a, b) => a - b)
  const index = Math.max(0, Math.ceil(sorted.length * 0.95) - 1)

  return sorted[index]
}
