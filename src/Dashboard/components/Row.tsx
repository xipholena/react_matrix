import React, {Fragment} from "react";
import Cell from "./Cell";
import {CellType, RowCalculations} from "../types";
import "../styles/index.css"

type Props = {
    row: CellType[],
    rowIndex: number,
    removeRow: (rowIndex: number) => void,
    matrix: CellType[][]
    rowCalculations: RowCalculations  | null
}

const Row = ({ row, rowIndex, removeRow, matrix, rowCalculations }: Props) => {
    return (
        <tr
        data-row-index={rowIndex}>
            {row.map((cell, cellIndex) => (
                <Fragment key={cellIndex}>
                    <Cell
                        cell={cell}
                        heat={rowCalculations ? rowCalculations?.heat[cellIndex] : ''}
                        percentage={rowCalculations ? rowCalculations?.percentage[cellIndex] : ''}
                    />
                </Fragment>
            ))}
            {rowIndex !== matrix.length - 1 && (
                <td
                >
                    <button onClick={() => removeRow(rowIndex)}>Remove row</button>
                </td>
            )}
        </tr>
    )
}

export default React.memo(Row)