import React, { Component, useEffect, useState } from "react";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import XLSX, { read, utils, writeFile } from 'xlsx';

import Select from "../components/reactSelect";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput";
import moment from "moment";

export default function Report({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [userNullCom, setuserNullCom] = useState();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/stock";
    const Subject = "Report";

    if (typeof document !== "undefined") {
        (document as any).title = Subject;
    }

    useEffect(() => {
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
    }, [userData])

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create') {
            try {
                await axios({
                    method: "POST",
                    url: URLAPI + '/export',
                    data: {
                        ...data, company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    ConvertToXLXS(res.data);
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }


    const ConvertToXLXS = (objArray: any) => {
        var worksheet = XLSX.utils.aoa_to_sheet(objArray);
        const wb = { Sheets: { data: worksheet }, SheetNames: ["data"] };

        XLSX.writeFile(wb, 'Report Stock.xlsx');
    }

    const submitAdd = (event: any) => {
        event.preventDefault();

        if (event.target.first_date.value < event.target.end_date.value) {
            toast.error('First Date Not Valid');
        }
        let data = {
            type: event.target.type_val.value,
            first_date: event.target.first_date.value,
            end_date: event.target.end_date.value,
        };


        handleApi('create', data);
    };

    return (
        <>
            <div className="col-12">
                <h1 className="hp-mb-0 text-4xl font-bold">{Subject}</h1>
            </div>
            <div className="row mb-32 gy-32">

                <div className="col-12 mt-10">
                    <div className="row g-16 align-items-center justify-content-end">
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="input-group align-items-center">
                                <DebouncedInput
                                    value={search ?? ''}
                                    onChange={value => setsearch(String(value))}
                                    className="form-control ps-8"
                                    placeholder="Search all columns..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3 shadow-md">
                        <div className="card-body px-0 ">

                            <h3 className="modal-title font-bold text-lg text-center">Report Download</h3>
                            <form id="createForm" onSubmit={submitAdd}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="mb-5">
                                            <Select
                                                id={`report`}
                                                name={`type`}
                                                data={[
                                                    {
                                                        label: 'Report Stock',
                                                        value: 'stock'
                                                    }
                                                ]}
                                                required={true}
                                                label={`Type Report`}
                                            />
                                        </div>
                                        <div className="col-12 mb-5">
                                            <div className="input-group align-items-center">
                                                <Input type="date" id="first_date" name='first_date' label="Start Date" variant="standard" />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="input-group align-items-center">
                                                <Input type="date" id="end_date" name='end_date' label="End Date" variant="standard" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <Button type="submit" className="w-full" color="blue">Download</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}