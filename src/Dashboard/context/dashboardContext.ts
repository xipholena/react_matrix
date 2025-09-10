import {createContext} from "react";
import {CellType} from "../types";

export type DashboardContextType = {
    findNearestValue: (arg0?: number, arg1?: number)=> void,
    increaseCell: (cell: CellType, rowIndex: number) => void;
}
const DashboardContext = createContext<DashboardContextType | null>(null);

export default DashboardContext;