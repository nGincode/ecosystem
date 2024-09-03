import React, { Component, useEffect, useState, useMemo } from "react"
import Link from "next/link";

import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import moment from "moment"
import {
    Button, Badge, Input, Textarea,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { read, utils, writeFile } from 'xlsx';
import * as PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;
import Swal from "sweetalert2";
import Image from "next/image";

// import * as GC from '@grapecity/spread-sheets';
// import ExcelIO from "@grapecity/spread-excelio";
// import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
// import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';

import Select from "../components/reactSelect";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';


export default function StockData({ userData, setuserData }: any) {
    const [dateData, setdateData] = useState<any>([moment().add(-30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
    const [pagePermission, setpagePermission] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const [modalData, setmodalData] = useState([
        {
            name: 'detail',
            label: 'Detail Transaction',
            type: 'reactSelect',
            select: [
                { label: 'Kepada Pihak Yang Bukan Pemungut', value: '010' },
                { label: 'Kepada Pemungut Bendaharawan', value: '020' },
                { label: 'Kepada Pemungut Selain Bendaharawan', value: '030' },
                { label: 'DPP Nilai Lain', value: '040' },
                { label: 'Besaran Tertentu', value: '050' },
                { label: 'Penyerahan Lainnya', value: '060' },
                { label: 'Penyerahan Yang PPN-nya Tidak Dipungut', value: '070' },
                { label: 'Penyerahan Yang PPN-nya Dibebaskan', value: '080' },
            ],
            required: true
        },
        {
            name: 'jenis',
            label: 'Jenis Faktur',
            type: 'reactSelect',
            select: [
                { label: 'Faktur Pajak', value: '0' },
                { label: 'Faktur Pajak Pengganti', value: '1' },
            ],
            required: true
        },
        {
            label: 'Tanggal Dokument',
            name: 'date',
            type: 'date',
            required: true
        },
        {
            name: 'Nomor Seri Faktur Pajak',
            type: 'group',
            group: [
                { name: 'seri2', type: 'number' },
                { name: 'seri3', type: 'number' },
                { name: 'seri4', type: 'number' },
            ],
            required: true
        },
        {
            type: 'nik/npwp',
            required: true
        },
        {
            name: 'referensi',
            label: 'Referensi Faktur',
            type: 'textarea',
        },
        {
            full: true,
            type: 'efaktur',
            required: true
        }
    ]);
    const [npwp, setnpwp] = useState([]);
    const [tabIdentitas, settabIdentitas] = useState('');
    const [itemInputEfak, setitemInputEfak] = useState<any>([{ delete: false }]);
    const URLAPI = "/api/stock";
    const Subject = "Stock";

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create') {
            data.company_id = JSON.parse(localStorage.getItem('companyActive') as string)?.value;
            try {
                await axios({
                    method: "POST",
                    url: URLAPI,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (res.data.status == '500') {
                        toast.error(res.data.error.map((value: any) => {
                            return value + '\n'
                        }, {
                            duration: 6000,
                        }));
                    } else {
                        setdataCreate(res.data.status);
                        toast.success(res.data.massage);
                        ($('.btn-close') as any).trigger("click");
                    }

                })
            } catch (error: any) {
                toast.error(error.response?.data.massage);
            }
        } else if (url === 'view_npwp') {
            let companyActive = JSON.parse(localStorage.getItem('companyActive') as string)?.value;
            if (userData.company.length && companyActive) {
                try {
                    await axios({
                        method: "GET",
                        url: '/api/npwp?company_id=' + companyActive,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res: any) => {
                        let arr = res.data.data.map((val: any) => { return { label: val.npwp + ' (' + val.name + ')', value: val.npwp, data: val } })
                        setnpwp(arr)
                    });
                } catch (error: any) {
                    toast.error(error.response.data.massage);
                }
            }
        } else if (url === 'proof') {
            try {
                await axios({
                    method: "POST",
                    url: '/api/efaktur/out/proof',
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (res.data?.success.length) {
                        toast.success(res.data.success.map((val: any) => `No Faktur : ${val.Efaktur} Berhasil\n`), {
                            duration: 6000,
                        });
                        setdataCreate(res.data.success)
                    }
                    if (res.data?.error.length) {
                        toast.error(res.data.error.map((val: any) => `No Faktur : ${val.Efaktur} Tidak ditemukan\n`), {
                            duration: 6000,
                        });
                    }

                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (url === 'export') {
            try {
                await axios({
                    method: "POST",
                    url: '/api/efaktur/out/export',
                    data: { company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    ConvertToCSV(res.data);
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }

    const ConvertToCSV = (objArray: any) => {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }


        const csvFile = str;
        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);

        var pom = document.createElement('a');
        pom.href = url;

        pom.setAttribute('download', (localStorage.getItem('companyActive') ? (JSON.parse(localStorage.getItem('companyActive') as string)?.label) + '_' : '') + 'PK.csv');
        pom.click();
    }

    useEffect(() => {
        const handleApiFirst = async (url: any, data: any = null) => {
            if (url === 'view_npwp') {
                let companyActive = JSON.parse(localStorage.getItem('companyActive') as string)?.value;
                if (userData.company.length && companyActive) {
                    try {
                        await axios({
                            method: "GET",
                            url: '/api/npwp?company_id=' + companyActive,
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }).then((res: any) => {
                            let arr = res.data.data.map((val: any) => { return { label: val.npwp + ' (' + val.name + ')', value: val.npwp, data: val } })
                            setnpwp(arr)
                        });
                    } catch (error: any) {
                        toast.error(error.response.data.massage);
                    }
                }
            }
        }
        handleApiFirst('view_npwp');
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            let array: any = [];
            let perm: any = val.data.find((vall: any) => {
                if (vall.data) {
                    return vall.data.find((valll: any) => {
                        if (valll.label == Subject) {
                            array.push(valll);
                        }
                    });
                }
                if (vall.label == Subject) {
                    return vall;
                }
            });
            if (array.length) {
                return array[0];
            } else {
                return perm;
            }
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
    }, [userData]);

    const importFile = (val: any, convert: any) => {
        const files = val.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], { raw: false });


                    let file = Object.keys(rows?.[0] ?? []);
                    let format = [
                        "no_faktur",
                        "costumer_name",
                        "address",
                        "area",
                        "product_code",
                        "product_name",
                        "packaging",
                        "varian",
                        "invoice_date",
                        "invoice_no",
                        "qty",
                        "price",
                        "gross_amount",
                        "net_amount",
                        "qty_last"
                    ]

                    if (JSON.stringify(file) == JSON.stringify(format)) {
                        Swal.fire({
                            icon: "info",
                            title: "Import data !!!",
                            text: `Are you sure want to import data to ${JSON.parse(localStorage.getItem('companyActive') as string)?.label ?? ""} ?`,
                            showCancelButton: true,
                            cancelButtonColor: "#686868",
                            confirmButtonText: "Import",
                        }).then((result: any) => {
                            if (result.isConfirmed) {
                                handleApi('create', { excel: rows });
                            }
                        });
                    } else {
                        toast.error('Format no valid', {
                            duration: 6000,
                        });
                    };


                    // if (err.length) {
                    //     toast.error(err.filter((value: any, index: any, array: any) => array.indexOf(value) === index).map((val: any) => {
                    //         return val + '\n'
                    //     }, {
                    //         duration: 6000,
                    //     }));

                    // } else {
                    //     if (convert) {
                    //         ConvertToCSV(arrayFinal);
                    //     } else {
                    //         Swal.fire({
                    //             icon: "info",
                    //             title: "Import data !!!",
                    //             text: `Are you sure want to import data to ${JSON.parse(localStorage.getItem('companyActive') as string)?.label ?? ""} ?`,
                    //             showCancelButton: true,
                    //             cancelButtonColor: "#686868",
                    //             confirmButtonText: "Import",
                    //         }).then((result: any) => {
                    //             if (result.isConfirmed) {
                    //                 handleApi('create', { excel: arrayFinal });
                    //             }
                    //         });
                    //     }
                    // }
                }
            }
            reader.readAsArrayBuffer(file);
            val.target.value = '';
        }

    };

    return (
        <>
            <div className="col-12 mb-5">
                <h1 className="hp-mb-0 text-4xl font-bold">{Subject}</h1>
            </div>
            <div className="row mb-32 gy-32">

                {JSON.parse(localStorage.getItem('companyActive') as string)?.value && userData.company.length ? <>
                    <div className="col-12 mt-15">
                        <div className="row g-16 align-items-center justify-content-end">

                            <div className="col-12 col-md-3 col-xl-3">
                                <div className="input-group align-items-center">
                                    <DebouncedInput
                                        value={search ?? ''}
                                        onChange={value => setsearch(String(value))}
                                        className="form-control ps-8"
                                        placeholder="Search all columns..."
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="input-group align-items-center">
                                    <DateRangePicker
                                        onCallback={(start, end) => {
                                            setdateData([moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')])

                                        }}
                                        initialSettings={{ startDate: moment(dateData?.[0]).format('DD/MM/YYYY'), endDate: moment(dateData?.[1]).format('DD/MM/YYYY') }}
                                    >
                                        <input type="text" className="form-control text-center rounded-none ps-8 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2" />
                                    </DateRangePicker>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-15 -mt-3  shadow-md border-gray-300">
                            <div className="card-body px-0">
                                <ReactTable
                                    search={search}
                                    action={{
                                        delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null,
                                        edit: pagePermission.find((val: any) => val == "edit") ? null : null
                                    }}
                                    urlFatch={URLAPI}
                                    modalData={modalData}
                                    Subject={Subject}
                                    date={dateData}
                                    reload={dataCreate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-15 -mt-3 shadow-md">
                            <div className="card-body px-0 text-center flex justify-center flex-wrap">

                                <div className="mb-5">
                                    <label htmlFor="fileFormat">
                                        <span className="dropdown-item text-center rounded-lg  cursor-pointer" aria-hidden="true">Import Format to Database
                                            <div className="flex justify-center mt-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" viewBox="0 0 303.188 303.188" className="w-12 h-12">
                                                    <g>
                                                        <polygon style={{ fill: "#E8E8E8" }} points="219.821,0 32.842,0 32.842,303.188 270.346,303.188 270.346,50.525  " />
                                                        <g>
                                                            <rect x="90.902" y="61.704" style={{ fill: "007934" }} width="119.89" height="119.89" />
                                                            <rect x="101.303" y="72.105" style={{ fill: "#FFFFFF" }} width="99.088" height="99.088" />
                                                            <polygon style={{ fill: "#007934" }} points="192.62,137.423 162.041,137.423 171.073,148.703 162.041,159.982 192.62,159.982     183.588,148.703   " />
                                                            <polygon style={{ fill: "#007934" }} points="183.875,97.886 154.609,97.886 148.122,105.987 141.635,97.886 112.369,97.886     133.489,124.262 112.369,150.638 183.875,150.638 162.755,124.262   " />
                                                            <polygon style={{ fill: "#FFFFFF" }} points="124.911,101.616 120.676,101.616 156.944,146.908 161.178,146.908   " />
                                                        </g>
                                                        <polygon style={{ fill: "#007934" }} points="227.64,25.263 32.842,25.263 32.842,0 219.821,0  " />
                                                        <g>
                                                            <path style={{ fill: "#A4A9AD" }} d="M135.998,273.871H121l-9.353-14.997l-9.254,14.997h-14.67l15.917-24.547l-14.965-23.432h14.374    l8.664,14.834l8.336-14.834h14.801l-15.194,24.449L135.998,273.871z" />
                                                            <path style={{ fill: "#A4A9AD" }} d="M141.38,273.871v-47.979h12.963v37.511h18.477v10.469h-31.44V273.871z" />
                                                            <path style={{ fill: "#A4A9AD" }} d="M211.872,259.3c0,2.976-0.755,5.617-2.265,7.925c-1.509,2.309-3.687,4.102-6.53,5.382    c-2.845,1.28-6.181,1.92-10.01,1.92c-3.194,0-5.874-0.225-8.04-0.673s-4.42-1.23-6.761-2.346v-11.552    c2.473,1.269,5.043,2.259,7.713,2.97c2.669,0.711,5.119,1.067,7.351,1.067c1.925,0,3.336-0.333,4.233-1.001    c0.897-0.667,1.346-1.526,1.346-2.576c0-0.656-0.181-1.231-0.541-1.723c-0.361-0.492-0.941-0.99-1.739-1.493    c-0.8-0.503-2.927-1.531-6.384-3.085c-3.129-1.422-5.475-2.8-7.039-4.135c-1.564-1.334-2.724-2.866-3.479-4.595    c-0.755-1.728-1.132-3.774-1.132-6.137c0-4.419,1.607-7.865,4.823-10.337c3.217-2.472,7.636-3.708,13.259-3.708    c4.966,0,10.031,1.148,15.194,3.446l-3.971,10.009c-4.485-2.056-8.357-3.085-11.617-3.085c-1.686,0-2.91,0.295-3.676,0.886    c-0.767,0.591-1.148,1.324-1.148,2.199c0,0.941,0.486,1.784,1.46,2.527c0.974,0.744,3.615,2.101,7.926,4.07    c4.135,1.859,7.007,3.856,8.614,5.989C211.068,253.376,211.872,256.063,211.872,259.3z" />
                                                        </g>
                                                        <polygon style={{ fill: "#D1D3D3" }} points="219.821,50.525 270.346,50.525 219.821,0  " />
                                                    </g>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                                                    <path d="M10 7L15 12L10 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <svg xmlns="http://purl.org/dc/elements/1.1/" viewBox="-1.61 0 70 70" className="w-12 h-12">
                                                    <path d="m -68.256041,544.14439 c -3.2225,-0.64097 -6.0047,-2.84478 -7.3573,-5.82793 -0.595,-1.31236 -0.8482,-2.55217 -0.8438,-4.13316 0.012,-4.5438 2.8692,-8.33798 7.3079,-9.70579 0.8177,-0.25196 1.3573,-0.31847 2.611,-0.32182 0.8692,-0.002 1.8277,0.0437 2.1301,0.10227 l 0.5497,0.10649 0.6765,-1.31365 c 1.3815,-2.68242 3.5345,-4.78981 6.3178,-6.18379 2.2961,-1.15 3.739,-1.48443 6.4043,-1.48443 1.8668,0 2.2999,0.045 3.5043,0.36412 5.2011,1.37813 9.255,5.45998 10.5309,10.60353 0.3195,1.2879 0.4789,4.17568 0.293,5.30849 l -0.1269,0.77355 0.7284,0.163 c 1.8256,0.40854 3.4011,1.68396 4.2066,3.40532 0.7966,1.70226 0.6508,3.90495 -0.3651,5.51414 -0.5185,0.82136 -1.535,1.73424 -2.3832,2.14031 -0.4348,0.20813 -0.8979,0.43475 -1.0292,0.50361 -0.2947,0.15465 -32.3751,0.14085 -33.155,-0.0143 z m 33.351,-1.89876 c 0.9026,-0.44879 1.7953,-1.45217 2.1662,-2.43497 0.7697,-2.03891 -0.2571,-4.40792 -2.3055,-5.31934 -0.5173,-0.23017 -0.9037,-0.28342 -1.9824,-0.27321 -0.737,0.007 -1.3399,-0.0395 -1.3399,-0.10328 0,-0.0638 0.1369,-0.66194 0.3042,-1.32926 0.428,-1.70717 0.4237,-4.42927 -0.01,-6.09178 -0.9556,-3.66584 -3.4332,-6.72357 -6.8221,-8.4192 -1.4892,-0.74512 -2.9056,-1.08594 -4.841,-1.16493 -2.8639,-0.11687 -4.8633,0.33445 -7.0666,1.59507 -2.5693,1.47003 -4.784,4.13385 -5.6425,6.78661 -0.1651,0.51018 -0.3653,0.9268 -0.4449,0.92583 -0.08,-9.6e-4 -0.5467,-0.13408 -1.038,-0.29579 -1.3668,-0.44991 -3.6978,-0.42255 -5.0619,0.0594 -1.3731,0.48513 -2.3616,1.10694 -3.3908,2.13292 -1.5427,1.53788 -2.3996,3.63391 -2.3996,5.86959 0,3.32007 1.8288,6.23059 4.8041,7.64574 1.71,0.81331 1.1183,0.78892 18.4849,0.76186 l 15.941,-0.0248 0.6444,-0.32043 z m -45.9938,-6.42576 c -5.7671,-0.78155 -10.2061,-2.22963 -13.4896,-4.40056 -1.3548,-0.89576 -2.2902,-1.89766 -2.8176,-3.01787 l -0.3929,-0.83466 0.036,-22.59585 0.036,-22.59585 0.3281,-0.61562 c 0.8294,-1.55619 2.4465,-2.88407 5.0211,-4.12288 3.2554,-1.56646 7.0095,-2.54578 12.2408,-3.19328 2.1543,-0.26664 9.47,-0.21948 11.6809,0.0753 8.1415,1.08546 14.4594,3.74551 16.4734,6.93577 0.7936,1.25717 0.7731,0.80148 0.7731,17.22791 l 0,15.08135 -0.4466,0.0692 c -0.2456,0.038 -0.8021,0.10712 -1.2366,0.15352 -4.4834,0.47873 -9.1329,3.57818 -11.5162,7.67699 l -0.488,0.8391 -1.9169,0.0905 c -2.265,0.10697 -3.4191,0.39711 -5.1411,1.29243 -2.9567,1.53725 -5.0699,4.20232 -5.9316,7.48077 -0.238,0.90554 -0.3084,1.56192 -0.3132,2.92023 l -0.01,1.75213 -0.7594,-0.0162 c -0.4176,-0.009 -1.3777,-0.1 -2.1335,-0.20243 z m 11.7239,-20.8271 c -1.0818,-0.91805 -2.0174,-1.7137 -2.0791,-1.7681 -0.062,-0.0544 0.1631,-0.2602 0.4994,-0.45733 0.7458,-0.43708 1.7061,-1.48313 2.1139,-2.30274 0.9965,-2.00287 0.9743,-4.49403 -0.058,-6.47634 -1.135,-2.1802 -3.5103,-3.3239 -6.2014,-2.986 -1.4735,0.18503 -2.3966,0.59832 -3.3701,1.50899 -1.5366,1.4374 -2.0688,2.84774 -1.988,5.26837 0.046,1.37622 0.095,1.62372 0.4886,2.45901 0.8471,1.79787 2.6182,3.14163 4.4225,3.35531 0.6788,0.0804 0.7377,0.1249 2.0865,1.57538 l 1.3881,1.49264 2.3321,0 2.3322,0 -1.9669,-1.66919 z m -5.885,-4.6866 c -0.9451,-0.47951 -1.304,-1.30103 -1.304,-2.98527 0,-1.09589 0.053,-1.41584 0.3224,-1.96387 0.4309,-0.875 1.29,-1.40105 2.1328,-1.30604 0.829,0.0934 1.2599,0.42875 1.6984,1.32149 0.3327,0.67762 0.3808,0.93439 0.3769,2.01347 0,1.33108 -0.2403,2.01354 -0.9098,2.63622 -0.6994,0.65058 -1.42,0.73892 -2.3167,0.284 z m -9.5093,3.18974 c 2.485,-0.57319 3.8348,-2.65434 3.1192,-4.80889 -0.3603,-1.0849 -1.1219,-1.76252 -2.9819,-2.65327 -0.859,-0.41138 -1.6272,-0.83198 -1.7071,-0.93468 -0.3128,-0.40184 -0.3121,-0.66784 0,-1.03351 0.484,-0.56269 1.5858,-0.5896 3.0776,-0.0752 l 1.138,0.39245 -0.039,-1.51877 -0.039,-1.51878 -0.7558,-0.17965 c -1.143,-0.2717 -3.6136,-0.2584 -4.5856,0.0247 -1.949,0.56765 -2.976,1.84152 -2.9696,3.68323 0.01,1.89537 0.8605,2.79385 3.8676,4.06981 1.2722,0.53982 1.4179,1.54865 0.2807,1.94362 -0.5263,0.18278 -0.6761,0.17922 -1.5089,-0.0358 -0.5086,-0.13132 -1.2802,-0.42314 -1.7148,-0.64849 l -0.7902,-0.40974 0,1.64418 0,1.64418 0.7902,0.21996 c 0.4346,0.12098 0.852,0.2415 0.9276,0.26783 0.3141,0.10941 3.3435,0.0524 3.8879,-0.0732 z m 26.5512,-1.4376 0,-1.44294 -2.1988,0 -2.1987,0 0,-4.74107 0,-4.74107 -1.7865,0 -1.7865,0 0,6.18401 0,6.184 3.9853,0 3.9852,0 0,-1.44293 z m -10.5815,-24.74151 c 3.5835,-0.41532 6.5241,-1.16648 8.3827,-2.14132 1.2211,-0.64044 1.5139,-0.87116 1.9833,-1.56285 1.4515,-2.13894 -1.7987,-4.28958 -8.0986,-5.35876 -5.9187,-1.0045 -13.7186,-0.77727 -18.7108,0.54509 -10.3005,2.7285 -6.2399,7.74058 7.0717,8.7287 2.1847,0.16217 7.109,0.0514 9.3717,-0.21086 z" fill="#00bcf2" transform="translate(97.599 -474.268)" />
                                                </svg>
                                            </div>
                                        </span>
                                        <input type="file" id="fileFormat" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: "none" }} onChange={(val: any) => importFile(val, false)} />
                                    </label>
                                    <div className="text-center mt-2">
                                        <Link href="/format/Format Import Stock.xlsx">
                                            Download Format Stock
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="col-12  mt-48">
                        <div className="card hp-contact-card mb-15 -mt-3 shadow-md">
                            <div className="card-body px-0 text-center flex justify-center flex-wrap">
                                <div className="text-center w-full text-gray-500">
                                    <div className="flex justify-center -mt-10 -mb-7 ">
                                        <Image src="/img/noResult.gif" width={200} height={200} alt="noResult" /> </div>
                                    <div className="text-lg">{!userData.company.length ? "Requires company data" : !JSON.parse(localStorage.getItem('companyActive') as string)?.value ? "Please select company" : null}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            </div >
        </>
    )
}