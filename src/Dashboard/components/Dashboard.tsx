import React, {Fragment, useState} from "react";
import Form from "./Form";
import Row from "./Row";
import {useMatrix} from "../hooks/useMatrix";
import {CellType, InputValues, RowCalculations} from "../types";
import "../styles/index.css"

const Dashboard= () => {

    const [values, setValues] = useState<InputValues>({
        M: 0,
        N: 0,
        X: 0,
    });

    const [matrix, setMatrix] = useState<CellType[][] | null>(null)
    const [rowCalculations, setRowCalculations] = useState<RowCalculations | null>(null)
    const {addRow, removeRow ,generateMatrix, handleMouseOver, handleClick} = useMatrix({matrix, setMatrix, inputValues: values, setRowCalculations})

    return (
            <div className="dashboard">
                <div className="info">
                    <p>Rows (M): {values.M}</p>
                    <p>Columns (N):{values.N}</p>
                    <p>Nearest values to find (X): {values.X}</p>
                </div>

                <Form values={values} setValues={setValues} generateMatrix={generateMatrix} setMatrix={setMatrix} matrixLength={matrix?.length}/>
                {!matrix?.length ?  <p>Dataset is Empty! Create a new dataset</p> : (
                    <>
                    <table
                        onMouseOver={(e)=> handleMouseOver(e)}
                        onClick={(e)=>handleClick(e)}
                    >
                        <tbody>
                        {matrix?.length > 1 && matrix?.map((row, rowIndex) => (
                            <Fragment key={rowIndex}>
                                <Row rowCalculations={rowIndex === rowCalculations?.rowIndex ? rowCalculations : null} row={row} rowIndex={rowIndex} removeRow={removeRow} matrix={matrix}/>
                            </Fragment>
                        ))}
                        </tbody>
                    </table>
                        {matrix?.length > 1 && <button  onClick={addRow}>Add row</button>}
                    </>
                )}
            </div>

    );
};

export default Dashboard;
