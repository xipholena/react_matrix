import React, {useContext} from "react";
import useCell from "../hooks/useCell";
import {CellType} from "../types";
import "../styles/index.css"

import DashboardContext from "../context/dashboardContext";

type Props = {
    cell: CellType;
    quantity: number;
    rowIndex: number,
    maxValue?: number,
    sum?: number,
}
const Cell = ({cell, quantity, rowIndex, maxValue, sum}: Props) => {

    const {percentageSum, percentageColor} = useCell({maxValue, cell, sum})
    const ctx = useContext(DashboardContext);
    const findNearestValue = ctx?.findNearestValue ?? (() => undefined);
    const increaseCell = ctx?.increaseCell ?? (() => undefined);

    return (
        <td className={cell.isBlocked ? "" : "percentage"}
            onMouseEnter={() => cell.isBlocked ? null : findNearestValue(cell?.amount, quantity)}
            onMouseLeave={()  => findNearestValue() }
            onClick={()=>increaseCell(cell, rowIndex)}
             style={{
                 border: "1px solid #333", padding: "8px", textAlign: "center", cursor: cell.isBlocked ? "default" : "pointer",
                 background: cell?.isNearest ? 'cornflowerblue' : percentageColor,
        }}
        >
            {cell?.amount}
            {cell.isBlocked ? '' : <span>{percentageSum}</span>}
        </td>
    )
}

export default Cell