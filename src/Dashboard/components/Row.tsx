import React, {Fragment} from "react";
import Cell from "./Cell";
import useRow from "../hooks/useRow";
import {CellType} from "../types";
import "../styles/index.css"

type Props = {
    row: CellType[],
    quantity: number,
    rowIndex: number,
    rowLength: number,
    removeRow: (rowIndex: number) => void,
    matrix: CellType[][]
}
const Row = ({ row, quantity, rowIndex, rowLength, removeRow, matrix }: Props) => {
    const { maxValue, sum } = useRow({rowIndex, matrix, row, rowLength})

    return (
        <tr>
            {row.map((cell, cellIndex) => (
                <Fragment key={cellIndex}>
                    <Cell cell={cell}  quantity={quantity} rowIndex={rowIndex} maxValue={maxValue} sum={sum}/>
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

export default Row