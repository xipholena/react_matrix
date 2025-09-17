import React from "react";
import {CellType} from "../types";
import "../styles/index.css"

type Props = {
    cell: CellType;
    heat: string,
    percentage: string,
}

const Cell = ({cell,  heat, percentage}: Props) => {
    return (
        <td
            data-id={cell.id}
            data-amount={cell.amount}
            data-is-sum={cell.isSum}
            data-is-percentile={cell.isPercentile}

            className={cell.isPercentile ? "" : "percentage"}
             style={{
                     border: "1px solid #333", padding: "8px", textAlign: "center", cursor: cell.isPercentile ? "default" : "pointer",
                     background: cell?.isNearest
                         ? 'cornflowerblue'
                         :  heat
                             ? heat
                             : "initial",
             }}
        >
            {percentage || cell?.amount}
        </td>
    )
}

export default React.memo(Cell)