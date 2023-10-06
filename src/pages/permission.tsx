/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState } from "react"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button, Checkbox, IconButton } from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";

import Select from "../components/reactSelect";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"
import ReactSelect from "../components/reactSelect";
import AccessData from "../components/accessData";

export default function Permission({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const URLAPI = "/api/permission";
    const Subject = "Permission";

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
                toast.error(error?.response?.data?.massage);
            }
        }
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

    const PermissionData = AccessData();

    const modalData = [
        {
            name: 'name',
            type: 'text',
            id: 'name',
            full: true,
            required: true
        },
        {
            full: true,
            type: 'permission',
            required: true,
            data: PermissionData
        }, {
            name: 'view',
            label: 'View Data',
            type: 'reactSelect',
            select: [
                { label: "All", value: "all" }, { label: "User", value: "user" }
            ],
            full: true,
            required: true
        }
    ];

    const submitAdd = (event: any) => {
        event.preventDefault();

        let data = PermissionData.map((val: any) => {
            let check = false;
            let dataCheck = val.data.map((vall: any) => {
                if (vall.option) {
                    let checkOption = false;
                    let dataOption = vall.option.map((valll: any) => {
                        let view = event.target[valll.name][0].checked ? 'view' : null;
                        let create = event.target[valll.name][1].checked ? 'create' : null;
                        let edit = event.target[valll.name][2].checked ? 'edit' : null;
                        let del = event.target[valll.name][3].checked ? 'delete' : null;
                        if (view) {
                            checkOption = true;
                        }
                        return {
                            label: valll.label,
                            name: valll.name,
                            link: valll.link,
                            checklist: [view, create, edit, del]
                        }

                    });
                    if (checkOption) {
                        check = true;
                    }
                    return {
                        label: vall.label,
                        check: checkOption,
                        data: dataOption,
                    }
                } else {
                    let view = event.target[vall.name][0].checked ? 'view' : null;
                    let create = event.target[vall.name][1].checked ? 'create' : null;
                    let edit = event.target[vall.name][2].checked ? 'edit' : null;
                    let del = event.target[vall.name][3].checked ? 'delete' : null;
                    if (view) {
                        check = true;
                    }
                    return {
                        label: vall.label,
                        name: vall.name,
                        link: vall.link,
                        checklist: [view, create, edit, del]
                    }
                }
            });

            return {
                label: val.label,
                check: check,
                data: dataCheck,
            }
        })

        handleApi('create', { name: event.target.name.value, view: event.target.view_val.value, perm: data });
    };

    return (
        <>
            <div className="row mb-32 gy-32">
                <div className="col-12">
                    <div className="row justify-content-between gy-32">
                        <div className="col hp-flex-none w-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link href="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {Subject}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

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
                                <Button type="button" className="w-100 px-5" variant="gradient" color="cyan" data-bs-toggle="modal" data-bs-target="#addNew"><i className="ri-add-line remix-icon"></i> Add {Subject}</Button>
                            </div> : null}
                        <div className="modal fade -mt-2 " id="addNew" tabIndex={-1} aria-labelledby="addNewLabel" aria-hidden="true">
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
                                                <div className="mb-5">
                                                    <Input label="Name Permission" variant="standard" required type="text" className="border-b-1" name="name" autoComplete="" />
                                                </div>
                                                <div className="flex mb-3">
                                                    <div className="w-1/2"></div>
                                                    <div className="w-1/6 justify-center flex">
                                                        <IconButton size="sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </IconButton>
                                                    </div>
                                                    <div className="w-1/6 justify-center flex">
                                                        <IconButton color="blue" size="sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                                            </svg>
                                                        </IconButton>
                                                    </div>
                                                    <div className="w-1/6  justify-center flex">
                                                        <IconButton color="green" size="sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                                                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                                            </svg>
                                                        </IconButton>
                                                    </div>
                                                    <div className="w-1/6  justify-center flex">
                                                        <IconButton color="red" size="sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </IconButton>
                                                    </div>
                                                </div>
                                                {PermissionData.map((val: any, i: number) => {
                                                    return (<div key={i}>
                                                        <div className="flex mt-3 font-bold">
                                                            <div className="w-1/2">{val.label}</div>
                                                        </div>
                                                        {val.data.map((vall: any, ii: number) => {
                                                            if (vall.checklist) {
                                                                return (
                                                                    <div key={ii} className="flex mt-1 ml-2">
                                                                        <div className="w-1/2 ml-2 m-auto"> {vall.label}</div>
                                                                        <div className="w-1/6 justify-center flex">
                                                                            {vall.checklist.find((fil: any) => fil === 'view') ?
                                                                                <Checkbox name={vall.name} /> : <Checkbox hidden name={vall.name} />}
                                                                        </div>
                                                                        <div className="w-1/6 justify-center flex">
                                                                            {vall.checklist.find((fil: any) => fil === 'create') ?
                                                                                <Checkbox color="blue" name={vall.name} /> : <Checkbox hidden name={vall.name} />}
                                                                        </div>
                                                                        <div className="w-1/6  justify-center flex">
                                                                            {vall.checklist.find((fil: any) => fil === 'edit') ?
                                                                                <Checkbox color="green" name={vall.name} /> : <Checkbox hidden name={vall.name} />}
                                                                        </div>
                                                                        <div className="w-1/6  justify-center flex">
                                                                            {vall.checklist.find((fil: any) => fil === 'delete') ?
                                                                                <Checkbox color="red" name={vall.name} /> : <Checkbox hidden name={vall.name} />}
                                                                        </div>
                                                                    </div>)
                                                            } else {
                                                                return (
                                                                    <div key={ii} className="ml-2" >
                                                                        <div className="flex my-2 font-semibold">
                                                                            <div className="w-1/2">{vall.label}</div>
                                                                        </div>

                                                                        {vall.option.map((valll: any, iii: number) => {
                                                                            return (
                                                                                <div key={iii} className="flex mt-1 ml-2">
                                                                                    <div className="w-1/2 ml-2 m-auto"> {valll.label}</div>
                                                                                    <div className="w-1/6 justify-center flex">
                                                                                        {valll.checklist.find((fil: any) => fil === 'view') ?
                                                                                            <Checkbox name={valll.name} /> : <Checkbox hidden name={valll.name} />}
                                                                                    </div>
                                                                                    <div className="w-1/6 justify-center flex">
                                                                                        {valll.checklist.find((fil: any) => fil === 'create') ?
                                                                                            <Checkbox color="blue" name={valll.name} /> : <Checkbox hidden name={valll.name} />}
                                                                                    </div>
                                                                                    <div className="w-1/6  justify-center flex">
                                                                                        {valll.checklist.find((fil: any) => fil === 'edit') ?
                                                                                            <Checkbox color="green" name={valll.name} /> : <Checkbox hidden name={valll.name} />}
                                                                                    </div>
                                                                                    <div className="w-1/6  justify-center flex">
                                                                                        {valll.checklist.find((fil: any) => fil === 'delete') ?
                                                                                            <Checkbox color="red" name={valll.name} /> : <Checkbox hidden name={valll.name} />}
                                                                                    </div>
                                                                                </div>)
                                                                        })}
                                                                    </div>
                                                                )
                                                            }
                                                        })}
                                                    </div>)
                                                })}
                                                <div className="mb-5 mt-3">
                                                    <ReactSelect data={[{ label: "All", value: "all" }, { label: "User", value: "user" }]} label="View Data" variant="standard" required type="text" className="border-b-1" name="view" autoComplete="" />
                                                </div>
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
            </div >
        </>
    )
}