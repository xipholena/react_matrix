import React, {useCallback, useMemo, useRef, MouseEvent} from "react";
import {max, min, percentile} from "../constants";
import {CellType, InputValues, RowCalculations} from "../types";

type Params = {
    matrix?: CellType[][] | null,
    setMatrix?: React.Dispatch<React.SetStateAction<CellType[][] | null>>,
    inputValues?: InputValues
    setRowCalculations: React.Dispatch<React.SetStateAction<RowCalculations | null>>
}

export const useMatrix = ({matrix, setMatrix, inputValues, setRowCalculations}: Params) => {
    const matrixSize = useMemo(()=> matrix?.length ? matrix.length * ((inputValues?.N || 0) + 1) : 0,  [matrix, inputValues?.N])
    const transposedMatrix = useRef<number[][]>([]);
    let idCount = matrixSize;

    const generateObject = (value?: number, isPercentile?: boolean, isSum?: boolean):CellType => {

        return isPercentile ? {
            id: idCount++,
            amount: value || Math.floor(Math.random() * (max - min + 1)) + min,
            isPercentile: true,
            isSum: isSum,
        } : {
            id: idCount++,
            amount: value || Math.floor(Math.random() * (max - min + 1)) + min,
            isSum: isSum,
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
            .map((_: unknown, colIndex: number) =>
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
        const row =  Array.from({length: inputValues?.N || 0 },  (_element, cellIndex) => {
            const cell = generateObject();
            sum += cell.amount;
            buildTransposeMatrix(cellIndex, cell.amount)

            return cell
        })
        row.push(generateObject(sum, false, true))

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
                    if (item.isPercentile) {
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

    const increaseCell = (isPercentile: boolean, isSum:boolean, id: number | null, rowIndex: number | null) => {
        if (isPercentile || isSum) return;

        setMatrix && setMatrix(prev => {
            if (!prev) return prev;

            const nextMatrix = prev.map((row, index) => {

                if(index === rowIndex) {
                    return row.map((item, index) => {
                        if(index === row.length - 1){
                            return {...item, amount: item.amount + 1}
                        }
                        return item.id === id
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

        const newMatrix = Array.from({length: inputValues?.M || 0}, (_element, rowIndex) => {

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
        inputValues,
        matrix,
        transposedMatrix,
        setMatrix
    ]);

    const  percentageColor = (maxValue: number, amount: number) => {
        if(maxValue) {
            const persentageMax = amount * 100 / maxValue
            return `hsl(${60 - 0.6 * persentageMax }deg, 90%, 50%)`
        }

        return "#fff"

    };
    const  percentageSum = (sum: number, amount: number) => {
        return sum ? Math.round(amount * 100 / sum) + '%' : "Not Available"
    };

    const calculateMaxValue = (row: number[]) => Math.max(...row)


    const handleMouseOver = (e: MouseEvent<HTMLTableElement>) => {
        if (!(e.target instanceof Element)) return;
        const cell = e.target.closest("td") as HTMLTableCellElement | null;

        const fromTd = (e.relatedTarget instanceof Element)
            ? (e.relatedTarget.closest("td") as HTMLTableCellElement | null)
            : null;

        if(cell?.dataset?.id !== fromTd?.dataset?.id) {
            setRowCalculations(null)
            findNearestValue()
        }

        if (cell) {
            const amount = cell.dataset.amount ? Number(cell.dataset.amount) : null;
            const isSum = !!cell.dataset.isSum
            const isPercentile = !!cell.dataset.isPercentile
            if(amount && inputValues?.X && !isSum && !isPercentile) return findNearestValue(amount, inputValues.X)

            if(isSum && amount ) {

                const tr = cell.closest("tr") as HTMLTableRowElement | null;
                const rowIndex = tr?.dataset?.rowIndex ? Number(tr.dataset.rowIndex) : null;

                const rowValues = tr
                    ? Array.from(tr.querySelectorAll<HTMLTableCellElement>('td[data-amount]'))
                        .filter(td =>
                            td.dataset.isPercentile !== "true" &&
                            td.dataset.isSum !== "true"
                        )
                        .map(td => Number(td.dataset.amount))
                    : [];
                const sum = tr ? Number(Array.from(tr.querySelectorAll<HTMLTableCellElement>('td[data-is-sum]'))[0]?.dataset?.amount) : 0
                const maxValue = calculateMaxValue(rowValues);

                 setRowCalculations({
                         heat: maxValue
                             ? rowValues.map(amount => percentageColor(maxValue, amount))
                             : [],
                        percentage: sum ? rowValues.map(amount => percentageSum(sum, amount)) : [],
                        rowIndex,
                 })
            }

        }
    }

    const handleClick = (e: MouseEvent<HTMLTableElement>) => {
        if (!(e.target instanceof Element)) return;
        const cell = e.target.closest("td") as HTMLTableCellElement | null;
        if (cell) {
            const tr = cell.closest("tr") as HTMLTableRowElement | null;
            const rowIndex = tr?.dataset?.rowIndex ? Number(tr.dataset.rowIndex) : null;
            const isSum = !!cell.dataset.isSum
            const isPercentile = !!cell.dataset.isPercentile
            const id = cell.dataset.id ? Number(cell.dataset.id) : null;
            increaseCell(isPercentile, isSum, id, rowIndex)
        }
    }
    return {
        addRow,
        removeRow,
        generateMatrix,
        generateRow,
        calculatePercentile,
        generateObject,
        findNearestValue,
        increaseCell,
        handleMouseOver,
        handleClick
    }
};