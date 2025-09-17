import React from "react";
import {CellType, InputValues} from "../types";

type Props = {
    values: InputValues;
    setValues: React.Dispatch<React.SetStateAction<InputValues>>;
    generateMatrix:  () => CellType[][];
    setMatrix: React.Dispatch<React.SetStateAction<CellType[][] | null>>
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>
    matrixLength?: number;
}
const useForm = ({setValues, setIsDisabled, setMatrix, values, generateMatrix, matrixLength}: Props) => {
    const handleChange = (key: "M" | "N" | "X", value: string) => {
        setValues((prev: InputValues) => ({
            ...prev,
            [key]: Number(value),
        }));
    };

    const handleEnabling = () => {
        setIsDisabled(false)
        setValues({
            M: 0,
            N: 0,
            X: 0,
        })
        setMatrix(null)
    }

    const handleDisabling = () => {

        if(values.M === 0 || values.N === 0 ) return alert(
            "Please fill M and N fields"
        )
        if(values.M > 100 || values.N > 100 ) return alert(
            "The maximum number of rows and columns is 100"
        )
        setIsDisabled(true)
        generateMatrix()
    }
    return { handleChange, handleEnabling, handleDisabling }
}

export default useForm;