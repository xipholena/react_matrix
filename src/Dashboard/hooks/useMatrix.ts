import {useCallback, useMemo, useRef} from "react";
import {max, min, percentile} from "../constants";
import {CellType, inputValues} from "../types";
import {DashboardContextType} from "../context/dashboardContext";

type Params = {
    matrix?: CellType[][] | null,
    setMatrix?: React.Dispatch<React.SetStateAction<CellType[][] | null>>,
    values?: inputValues
}
export const useMatrix = ({matrix, setMatrix, values}: Params) => {
    const matrixSize = useMemo(()=> matrix?.length ? matrix.length * ((values?.N || 0) + 1) : 0,  [matrix, values?.N])
    const transposedMatrix = useRef<number[][]>([]);
    let idCount = matrixSize;

    const generateObject = (value?: number, isBlocked?: boolean):CellType => {

        return isBlocked ? {
            id: idCount++,
            amount: value || Math.floor(Math.random() * (max - min + 1)) + min,
            isBlocked: true
        } : {
            id: idCount++,
            amount: value || Math.floor(Math.random() * (max - min + 1)) + min
        }

    }

    const buildTransposeMatrix = (cellIndex: number, amount: number) => {
        transposedMatrix.current[cellIndex]
            ? transposedMatrix.current[cellIndex].push(amount)
            : transposedMatrix.current[cellIndex] = [amount]

        return transposedMatrix
    }

    const updateTransposedMatrix = useCallback((matrix: CellType[][])=> {
        if (!matrix) return [];

        return matrix[0]
            .map((_: any, colIndex: number) =>
                matrix
                    .map(row => row[colIndex]).slice(0, -1))
            .slice(0, -1);
    }, [])

    const calculatePercentile = (arr: number[], k: number) => {

        const sorted = [...arr].sort((a, b) => a - b);
        const N = sorted.length;

        const pos = (k / 100) * (N - 1);

        const lowerIndex = Math.floor(pos);
        const fraction = pos - lowerIndex;

        if (fraction === 0) {
            return sorted[lowerIndex];
        }

        const lowerValue = sorted[lowerIndex];
        const upperValue = sorted[lowerIndex + 1];

        return Number((lowerValue + fraction * (upperValue - lowerValue)).toFixed(2));
    }

    const updatePercentiles = (nextMatrix: CellType[][]) => {
        const updatedPercentiles = updateTransposedMatrix(nextMatrix)
            .map((column) => calculatePercentile(
                column.map((value) => value.amount),
                percentile))
            .map((value) => generateObject(value, true))

        return [
            ...nextMatrix.slice(0, -1),
            updatedPercentiles
        ]

    }

    const generateRow =() => {
        let sum = 0
        const row =  Array.from({length: values?.N || 0 },  (_element, cellIndex) => {
            const cell = generateObject();
            sum += cell.amount;
            buildTransposeMatrix(cellIndex, cell.amount)

            return cell
        })
        row.push(generateObject(sum, true))

        return row
    }

    const addRow = () => {
        if (matrix?.length === 101) return alert("Maximum number of rows reached")
        if (setMatrix) {
            setMatrix(prev => {
                if (!prev) return prev;
                const nextMatrix = [
                    ...prev.slice(0, prev.length - 1),
                    generateRow(),
                    ...prev.slice(prev.length - 1),
                ]

                return updatePercentiles(nextMatrix)
            });
        }

    }

    const removeRow = (rowIndex: number) => {
        if (matrix?.length === 2) return alert("Removing the last row is not allowed. You can generate new rows or new matrix")
        if (setMatrix) {
            setMatrix(prev => {
                if (!prev) return prev;
                const nextMatrix = [
                    ...prev.slice(0, rowIndex),
                    ...prev.slice(rowIndex + 1),
                ]

                return updatePercentiles(nextMatrix)
            });
        }

    }

    const findNearestValue  = (target?: number, length?: number): CellType[] | undefined  => {
        if (!matrix) return;

        const updateMatrix = (prevMatrix: CellType[][], matches?: CellType[]) => {
            return prevMatrix.map(row =>
                row.map(item => {
                    if (item.isBlocked) {
                        return {...item, isNearest: false};
                    }
                    return matches ? (
                            matches.map(element => element.id).includes(item.id)
                                ? {...item, isNearest: true}
                                : {...item}
                        ) : (
                            {...item, isNearest: false}
                        )
                    }
                )
            )


        }
        if (length) {
            const matches = matrix
                .slice(0, -1)
                .reduce((acc, row) => {
                    const rowToAdd = row.slice(0, -1);
                    return acc.concat(rowToAdd);
                }, [])
                .sort((a, b) => Math.abs(a?.amount - (target ?? 0)) - Math.abs(b?.amount - (target ?? 0)))
                .slice(0, length);

                setMatrix &&  setMatrix(prev => prev ? updateMatrix(prev, matches) : prev)

        } else {
                setMatrix && setMatrix(prev => prev ? updateMatrix(prev) : prev)
        }
    }

    const increaseCell = (cell: CellType, rowIndex: number) => {
        if (cell.isBlocked) return;

        setMatrix && setMatrix(prev => {
            if (!prev) return prev;

            const nextMatrix = prev.map((row, index) => {

                if(index === rowIndex) {
                    return row.map((item, index) => {
                        if(index === row.length - 1){
                            return {...item, amount: item.amount + 1}
                        }
                        return item.id === cell.id
                            ? {...item, amount: item.amount + 1}
                            : item
                    })
                }
                return row
            });

            return updatePercentiles(nextMatrix);
        });
    }

    const generateMatrix = useCallback(() => {
        transposedMatrix.current = [];

        const newMatrix = Array.from({length: values?.M || 0}, (_element, rowIndex) => {

            return generateRow()
        })
        newMatrix.push(
            transposedMatrix.current
                .map((column) => calculatePercentile(column, percentile))
                .map((value) => generateObject(value, true))
        )

        setMatrix && setMatrix(newMatrix)
        return newMatrix

    },[
        values,
        matrix,
        transposedMatrix,
        setMatrix
    ]);
    const dashboardContext: DashboardContextType = {
        findNearestValue,
        increaseCell
    };
    return {
        addRow,
        removeRow,
        generateMatrix,
        generateRow,
        calculatePercentile,
        generateObject,
        findNearestValue,
        increaseCell,
        dashboardContext,
    }
};