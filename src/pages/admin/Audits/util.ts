export const getExportDataRenderFunction = <T>(
  cols: { label: string; exportRender: (o: T) => string }[],
  logs: T[]
) => {
  return () => {
    return [
      cols.map(c => c.label),
      ...logs.map(row => cols.map(col => col.exportRender(row))),
    ]
  }
}
