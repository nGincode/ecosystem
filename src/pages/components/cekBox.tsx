import { Checkbox } from "@material-tailwind/react";
import { useState, useEffect, useMemo } from "react"

export default function Cekbox({ id, color, name, checked }: any, loads = true) {
    const [isChecked, setIsChecked] = useState<any>(null);

    const checkHandler = (val: any) => {
        setIsChecked(val.target.checked)
    }

    useEffect(() => {
        console.log(loads);
    }, [loads]);


    return (
        <>
            <Checkbox
                color={color}
                id={id}
                name={name}
                checked={isChecked === null ? checked ? true : false : isChecked}
                onChange={checkHandler}
            />
        </>
    )
}