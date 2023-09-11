import { Checkbox } from "@material-tailwind/react";
import { useState, useEffect, useMemo } from "react"

export default function Cekbox({ id, color, name, checked }: any) {
    const [isChecked, setIsChecked] = useState<any>(null);
    useEffect(() => {
        setIsChecked(null)
    }, [id]);

    const checkHandler = (val: any) => {
        setIsChecked(val.target.checked)
    }

    return (
        <>
            <Checkbox
                color={color}
                id={id}
                checked={isChecked === null ? checked : isChecked}
                onChange={checkHandler}
            />
            <input type="hidden" name={name} value={isChecked === null ? checked : isChecked} />
        </>
    )
}