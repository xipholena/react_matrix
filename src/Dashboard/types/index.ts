export type CellType = {
    id: number,
    amount: number,
    isNearest?: boolean,
    isPercentile?: boolean,
    isSum?: boolean,

}

export type InputValues = { M: number; N: number; X: number }

export type RowCalculations = {
    heat: string[],
    percentage: string[],
    rowIndex: number | null,
}