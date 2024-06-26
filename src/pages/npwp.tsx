import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { Input, Button } from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";

import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"

export default function Npwp({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/npwp";
    const Subject = "NPWP";


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
    }, [userData]);

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create') {
            try {
                await axios({
                    method: "POST",
                    url: URLAPI,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataCreate(res.data.data)
                    toast.success(res.data.massage);
                    ($('.btn-close') as any).trigger("click");
                    (document.getElementById('formCreate') as HTMLFormElement).reset();
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }

    const submitAdd = (event: any) => {
        event.preventDefault();

        let address = {
            jalan: event.target.jalan.value,
            block: event.target.block.value,
            no: event.target.no.value,
            rt: event.target.rt.value,
            rw: event.target.rw.value,
            kel: event.target.kel.value,
            kec: event.target.kec.value,
            kabkot: event.target.kabkot.value,
            prov: event.target.prov.value,
            kodepos: event.target.kodepos.value,
        };

        let data = {
            npwp: event.target.npwp.value,
            name: event.target.name.value,
            phone: event.target.phone.value,
            address: address,
            company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value
        };

        handleApi('create', data);
    };

    const modalData = [
        {
            name: 'npwp',
            type: 'number',
            id: 'npwp',
            required: true
        },
        {
            name: 'name',
            type: 'text',
            id: 'name',
            required: true
        },
        {
            name: 'phone',
            type: 'text',
            id: 'byphone',
            required: true
        },
        {
            name: 'email',
            type: 'email',
            id: 'email',
            required: false
        },
        {
            full: true,
            type: 'address',
            required: true
        }
    ];

    const convertCamelCase = (text: any) => {
        if (text) {
            const result = text.replace(/([A-Z])/g, " $1");
            return result.charAt(0).toUpperCase() + result.slice(1);
        } else {
            return '';
        }
    }

    return (
        <>
            <div className="col-12 mb-5">
                <h1 className="hp-mb-0 text-4xl font-bold">{Subject}</h1>
            </div>
            <div className="row mb-32 gy-32">

                {JSON.parse(localStorage.getItem('companyActive') as string)?.value && userData.company.length ? <>
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

                            {pagePermission.find((val: any) => val == "create") ?
                                <div className="col hp-flex-none w-auto">
                                    <Button type="button" className="w-100 px-5" variant="gradient" color="cyan" data-bs-toggle="modal" data-bs-target="#addNew"><i className="ri-add-line remix-icon"></i> Add NPWP</Button>
                                </div> : null}
                            <div className="modal fade -mt-2" id="addNew" tabIndex={-1} aria-labelledby="addNewLabel" aria-hidden="true">
                                <div className="modal-dialog modal-xl modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header py-16 px-24">
                                            <h5 className="modal-title font-bold" id="addNewLabel">Add {Subject}</h5>
                                            <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                                <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                            </button>
                                        </div>

                                        <div className="divider m-0"></div>

                                        <form onSubmit={submitAdd} id="formCreate">
                                            <div className="modal-body">
                                                <div className="row gx-8">
                                                    {modalData.length ? modalData?.map((val: any, i: number) => {
                                                        return <div className={val.full ? "col-12 col-md-12" : "col-12 col-md-6"} key={i}>
                                                            {
                                                                val.type === 'text' || val.type === 'number' || val.type === 'email' || val.type === 'date' ?
                                                                    <div className="mb-24">
                                                                        <Input type={val.type} required={val.required} variant="standard" className="border-b-1" label={val.label ?? val.name === 'npwp' ? "NPWP" : convertCamelCase(val.label ?? val.name)} name={val.name} id={val.id} />
                                                                    </div>
                                                                    : val.type === 'address' ?
                                                                        <div className="w-full">
                                                                            <div className="mb-3">
                                                                                <div className="border-1 border-gray-500 p-2 rounded-lg shadow-sm">
                                                                                    <label className="-mt-5 absolute bg-white px-1 text-gray-500">Address</label>
                                                                                    <div className="xl:flex">
                                                                                        <div className="mt-3 w-full"><Input required name='jalan' className="border-b-1" type="text" variant="standard" label="Jalan" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='block' className="border-b-1" type="text" variant="standard" label="Block" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='no' className="border-b-1" type="number" variant="standard" label="No" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='rt' className="border-b-1" type="number" variant="standard" label="RT" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='rw' className="border-b-1" type="number" variant="standard" label="RW" /></div>
                                                                                    </div>
                                                                                    <div className="xl:flex">
                                                                                        <div className="mt-3 w-full"><Input required name='kec' className="border-b-1" type="text" variant="standard" label="Kecamatan" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='kel' className="border-b-1" type="text" variant="standard" label="Keluarahan" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='prov' className="border-b-1" type="text" variant="standard" label="Provinsi" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='kabkot' className="border-b-1" type="text" variant="standard" label="Kabupaten/Kota" /></div>
                                                                                        <div className="mt-3 w-full"><Input required name='kodepos' className="border-b-1" type="number" variant="standard" label="Kode POS" /></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        : null
                                                            }</div>
                                                    }) : null}
                                                </div>
                                            </div>

                                            <div className="modal-footer pt-0 px-24 pb-24">
                                                <div className="divider"></div>
                                                <Button type="submit" className="w-full" color="blue">Submit</Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-32 -mt-3 shadow-md">
                            <div className="card-body px-0 ">
                                <ReactTable
                                    search={search}
                                    action={{
                                        delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null,
                                        edit: pagePermission.find((val: any) => val == "edit") ? URLAPI : null
                                    }}
                                    urlFatch={URLAPI}
                                    modalData={modalData}
                                    Subject={Subject}
                                    reload={dataCreate}
                                />
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