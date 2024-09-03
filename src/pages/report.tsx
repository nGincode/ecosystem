import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Input, Button } from "@material-tailwind/react";
import axios from "axios";
import XLSX from 'xlsx';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';

import Select from "../components/reactSelect";
import LoadingPage from "../components/loadingPage";
import DebouncedInput from "../components/debouncedInput";
import moment from "moment";

export default function Report({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [search, setsearch] = useState('');
    const [loading, setloading] = useState(false);
    const URLAPI = "/api";
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
        setloading(true)
        if (url === 'create') {
            let url = '';
            if (data.type == 'stock') {
                url = '/stock'
            } else if (data.type == 'pk') {
                url = '/api/efaktur/out'
            } else if (data.type == 'pm') {
                url = '/api/efaktur/in'
            }
            try {
                await axios({
                    method: "POST",
                    url: URLAPI + url + '/export',
                    data: {
                        ...data, company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    ConvertToXLXS(res.data);
                    setloading(false)
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
                setloading(false)
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

        let data = {
            type: event.target.type_val.value,
            first_date: values[0],
            end_date: values[1],
        };
        handleApi('create', data);


    };

    const [values, setvalue] = useState([moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);

    return (
        <>

            <LoadingPage process={loading} label="Downloading" />
            <div className="col-12 mb-5">
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
                                                    },
                                                    {
                                                        label: 'Report PK',
                                                        value: 'pk'
                                                    },
                                                    {
                                                        label: 'Report PM',
                                                        value: 'pm'
                                                    }
                                                ]}
                                                required={true}
                                                label={`Type Report`}
                                            />
                                        </div>

                                        <div className="input-group align-items-center">
                                            <DateRangePicker
                                                onCallback={(start, end) => {
                                                    setvalue([moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')])

                                                }}
                                                initialSettings={{ startDate: moment(values?.[0]).format('DD/MM/YYYY'), endDate: moment(values?.[1]).format('DD/MM/YYYY') }}
                                            >
                                                <input type="text" className="form-control text-center rounded-none ps-8 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2" />
                                            </DateRangePicker>
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