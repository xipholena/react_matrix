import React, {Fragment, useState} from "react";
import Form from "./Form";
import Row from "./Row";
import {useMatrix} from "../hooks/useMatrix";
import {CellType, inputValues} from "../types";
import DashboardContext from "../context/dashboardContext";
import "../styles/index.css"

const Dashboard= () => {

    const [values, setValues] = useState<inputValues>({
        M: 0,
        N: 0,
        X: 0,
    });

    const [matrix, setMatrix] = useState<CellType[][] | null>(null)

    const {addRow, removeRow ,generateMatrix, dashboardContext} = useMatrix({matrix, setMatrix, values, })


    return (
        <DashboardContext.Provider value={dashboardContext}>
            <div className="dashboard">
                <div className="info">
                    <p>Rows (M): {values.M}</p>
                    <p>Columns (N):{values.N}</p>
                    <p>Nearest values to find (X): {values.X}</p>
                </div>

                <Form values={values} setValues={setValues} generateMatrix={generateMatrix} setMatrix={setMatrix} matrixLength={matrix?.length}/>
                {!matrix?.length ?  <p>Dataset is Empty! Create a new dataset</p> : (
                    <>
                    <table>
                        <tbody>
                        {matrix?.length > 1 && matrix?.map((row, rowIndex) => (
                            <Fragment key={rowIndex}>
                                <Row row={row} quantity={values.X} rowLength={values.N} rowIndex={rowIndex} removeRow={removeRow} matrix={matrix}/>
                            </Fragment>
                        ))}
                        </tbody>
                    </table>
                        {matrix?.length > 1 && <button  onClick={addRow}>Add row</button>}
                    </>
                )}
            </div>
        </DashboardContext.Provider>

    );
};

export default Dashboard;
