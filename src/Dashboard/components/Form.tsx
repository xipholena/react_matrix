import React, {Dispatch, SetStateAction, useState} from 'react';
import useForm from "../hooks/useForm";
import {CellType, InputValues} from "../types";
import "../styles/index.css"

type Props =  {
    values: InputValues;
    setValues: Dispatch<SetStateAction<InputValues>>;
    generateMatrix:  () => CellType[][];
    setMatrix: React.Dispatch<React.SetStateAction<CellType[][] | null>>
    matrixLength?: number;
}
const Form = ({values, setValues, generateMatrix, setMatrix, matrixLength}: Props) => {
    const [isDisabled, setIsDisabled] = useState(true);

    const {handleChange, handleEnabling, handleDisabling} = useForm({setValues, setIsDisabled, setMatrix, values, generateMatrix, matrixLength})

    return (
        <form>
            <p>Table generator</p>
            <label>
                <span>Rows (M): </span>
                <input
                    disabled={isDisabled}
                    placeholder={"values between 0 and 100"}
                    name="rows"
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={values.M}
                    onChange={(e) => handleChange("M", e.target.value)}
                />
            </label>

            <label>
                <span>Columns (N):</span>
                <input
                    disabled={isDisabled}
                    placeholder={"values between 0 and 100"}
                    name="columns"
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={values.N}
                    onChange={(e) => handleChange("N", e.target.value)}
                />
            </label>

            <label>
                <span>Nearest values to find (X):</span>
                <input
                    disabled={isDisabled}
                    name="nearestValues"
                    type="number"
                    value={values.X}
                    min={0}
                    required
                    onChange={(e) => handleChange("X", e.target.value)}
                />
            </label>
            {isDisabled ? (
                <div>
                    <button onClick={handleEnabling}>Enable generator</button>
                </div>

            )  :
                <button onClick={handleDisabling}>Generate!</button>
            }



        </form>
    );
}

export default Form;