import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'
import { Select as Material, Option } from "@material-tailwind/react";

import Select from "react-select";
import SelectCreate from "react-select/creatable";
import AsyncSelect from "react-select/async";

export default function ReactSelect({
    search,
    create,
    multi,
    id,
    name,
    data,
    defaultValue,
    className,
    csrf_token,
    createUrl,
    method,
    api_token,
    datapost,
    setSearchValue,
    required,
    label,
    mergeDataValue
}: any) {
    if (defaultValue && multi) {
        if (mergeDataValue) {
            var dataSelect: any = [...defaultValue].concat(data);
        } else {
            var dataSelect: any = data;
        }
    } else {
        var dataSelect: any = data;
    }

    const [options, setoptions] = useState<any>(dataSelect);
    const [value, setvalue] = useState<any>('');

    const handleAsync = async (req: any, valueSearch: any) => {
        try {
            await axios({
                method: method,
                url: createUrl,
                data: req,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                    Authorization: `Bearer ${api_token}`,
                    "X-CSRF-TOKEN": csrf_token,
                },
            }).then((res) => {
                if (res.data.response === "success") {
                    toast("success", res.data.message);
                    setoptions((options: any) => [
                        ...options,
                        { value: res.data.id, label: valueSearch },
                    ]);
                    setvalue({ value: res.data.id, label: valueSearch });
                } else {
                    toast("error", res.data.message);
                }
            });
        } catch (error: any) {
            toast("error", error.message);
        }
    };

    useEffect(() => {
        setvalue(defaultValue);
    }, [defaultValue]);

    const handleOnChangeReactSelect = (val: any) => {
        setvalue(val);
        if (setSearchValue) setSearchValue(val);
    };
    const handleOnChangeDefault = (val: any) => {
        if (val) {
            setvalue(val);
            if (setSearchValue) setSearchValue(val);
        } else {
            setvalue(val);
            if (setSearchValue) setSearchValue(val);
        }
    };

    const handleChangeCreate = (val: any) => {
        if (val.__isNew__) {
            Swal.fire({
                icon: "info",
                title: "Create Category",
                text: `Are You sure want to create ${val.value}`,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm",
            }).then((result: any) => {
                if (result.isConfirmed) {
                    handleAsync({ ...datapost, name: val.value }, val.label);
                } else {
                    setvalue("");
                }
            });
        } else {
            setvalue({ value: val.value, label: val.label });
        }
    };

    return (
        <>
            {data?.length ?
                <>
                    {search && create ? (
                        <SelectCreate
                            value={value}
                            name={name}
                            placeholder="Choose..."
                            onChange={handleChangeCreate}
                            options={options}
                            createOptionPosition="first"
                            className="form-control"
                            classNamePrefix="react-select"
                            id={id}
                        />
                    ) : search ? (
                        <Select
                            options={dataSelect}
                            name={name}
                            value={value ? value : ""}
                            onChange={handleOnChangeReactSelect}
                            // className={"form-control " + className}
                            classNamePrefix="react-select"
                            id={id}
                            required={required}
                            isOptionDisabled={(dataSelect: any) => dataSelect.disabled}
                        // styles={{
                        //     input: (base) => ({
                        //         ...base,
                        //         'input': {
                        //             boxShadow: 'none',
                        //             border: 'none',
                        //             padding: '0px'
                        //         }
                        //     }),
                        //     control: (provided: any, state: any) => ({
                        //         ...provided,
                        //         boxShadow: "none",
                        //         border: "black",
                        //         padding: '0px'
                        //     }),
                        //     menu: (provided: any, state: any) => ({
                        //         ...provided,
                        //         // border: "none",
                        //         // boxShadow: "none"
                        //         // borderRadius: '10px'
                        //     }),
                        //     option: (provided: any, state: any) => ({
                        //         ...provided,
                        //         // backgroundColor: state.isFocused && "lightgray",
                        //         // color: state.isFocused && "red"
                        //     })
                        // }}
                        />
                    ) : multi ? (
                        <Select
                            id={id}
                            name={name}
                            isMulti
                            options={dataSelect}
                            value={value}
                            onChange={handleOnChangeReactSelect}

                        />
                    ) : (
                        <>
                            <input required={required} name={name + '_val'} value={value ? value.value ? `${value.value}` : `${value}` : ''} type="hidden" />
                            <input required={required} name={name} value={value ? value.value ? `${value.value}` : `${value}` : ''} type="hidden" />
                            <Material
                                name={name}
                                id={id}
                                value={value ? value.value ? `${value.value}` : `${value}` : ''}
                                onChange={handleOnChangeDefault}
                                variant="standard"
                                label={label}
                            >
                                {data.map((val: any, i: number) => {
                                    return (
                                        <Option key={i} className="mb-1" value={`${val.value}`}>
                                            {val.label}
                                        </Option>
                                    );
                                })}
                            </Material>
                        </>
                    )}
                </>
                : null}
        </>
    );

}