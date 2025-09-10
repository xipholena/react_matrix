import {useMemo} from "react";
import {CellType} from "../types";

type Params = {
    rowIndex: number,
    matrix: CellType[][],
    row: CellType[],
    rowLength: number
}
const useRow = ({rowIndex, matrix, row, rowLength}: Params) => {
    const maxValue = useMemo(() => {

        return rowIndex === matrix.length - 1
            ? undefined
            : Math.max(...row.map(item => item.amount).slice(0, -1))
    }, [row, rowIndex, matrix])

    const sum = useMemo(() => {

        return rowIndex === matrix.length - 1
            ? undefined
            : row[rowLength].amount
    }, [row, rowLength, rowIndex, matrix])

    return {
        maxValue,
        sum
    }
}

export default useRow