import {useMemo} from "react";
import {CellType} from "../types";

type Params = {
    maxValue?: number,
    cell: CellType,
    sum?: number
}
const useCell = ({maxValue, cell, sum}: Params) => {
    const  percentageColor = useMemo(() => {
        if(maxValue && !cell?.isBlocked) {
            const persentageMax = cell?.amount * 100 / maxValue
            return `hsl(${60 - 0.6 * persentageMax }deg, 90%, 50%)`
        }
        return "#fff"

    } ,[maxValue, cell]);

    const  percentageSum = useMemo(() => {
        return sum ? Math.round(cell?.amount * 100 / sum) + '%' : "Not Available"
    },[sum, cell]);

    return {
        percentageColor,
        percentageSum
    }
}

export default useCell