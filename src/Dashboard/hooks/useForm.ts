import React from "react";
import {CellType, inputValues} from "../types";

type Props = {
    values: inputValues;
    setValues: React.Dispatch<React.SetStateAction<inputValues>>;
    generateMatrix:  () => CellType[][];
    setMatrix: React.Dispatch<React.SetStateAction<CellType[][] | null>>
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>
    matrixLength?: number;
}
const useForm = ({setValues, setIsDisabled, setMatrix, values, generateMatrix, matrixLength}: Props) => {
    const handleChange = (key: "M" | "N" | "X", value: string) => {
        setValues((prev: inputValues) => ({
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
        setIsDisabled(true)
        generateMatrix()
    }
    return { handleChange, handleEnabling, handleDisabling }
}

export default useForm;