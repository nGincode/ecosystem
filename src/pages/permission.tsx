/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState } from "react"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import toast, { Toaster } from 'react-hot-toast';
import { Input, Textarea, Button, Checkbox, IconButton } from "@material-tailwind/react";
import axios from "axios";

import Select from "./components/reactSelect";
import ReactTable from "./components/reactTable";
import DebouncedInput from "./components/debouncedInput"

export default function Permission({ userData, setuserData }: any) {
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const URL = "/api/permission";
    const Subject = "Permission";

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create') {
            try {
                await axios({
                    method: "POST",
                    url: URL,
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


    const permissionData = [
        {
            label: 'Accounts',
            data: [
                {
                    label: 'Users',
                    name: 'users[]',
                    checklist: ['edit', 'delete', 'create']
                },
                {
                    label: 'Permission',
                    name: 'permission[]',
                    checklist: ['edit', 'delete', 'create']
                },
                {
                    label: 'NPWP',
                    name: 'npwp[]',
                    checklist: ['edit', 'delete', 'create']
                },
                {
                    label: 'E-Faktur',
                    name: 'efaktur[]',
                    checklist: ['edit', 'delete', 'create']
                }
            ],
        }
    ];

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
            data: permissionData
        }
    ];

    const submitAdd = (event: any) => {
        event.preventDefault();

        let data = permissionData.map((val: any) => {
            let check = false;
            let dataCheck = val.data.map((vall: any) => {
                let create = event.target[vall.name][0].checked ? 'create' : null;
                let edit = event.target[vall.name][1].checked ? 'edit' : null;
                let del = event.target[vall.name][2].checked ? 'delete' : null;
                if (create) {
                    check = true;
                }
                if (edit) {
                    check = true;
                }
                if (edit) {
                    check = true;
                }
                return {
                    label: vall.label,
                    name: vall.name,
                    checklist: [create, edit, del]
                }
            });

            return {
                label: val.label,
                check: check,
                data: dataCheck
            }
        })


        handleApi('create', { name: event.target.name.value, perm: data });
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
                                        <a href="index.html">Home</a>
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

                        <div className="col hp-flex-none w-auto">
                            <Button type="button" className="w-100 px-5" variant="gradient" color="cyan" data-bs-toggle="modal" data-bs-target="#addNew"><i className="ri-add-line remix-icon"></i> Add {Subject}</Button>
                        </div>
                        <div className="modal fade " id="addNew" tabIndex={-1} aria-labelledby="addNewLabel" aria-hidden="true">
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
                                                {permissionData.map((val: any, i: number) => {
                                                    return (<div key={i}>
                                                        <div className="flex mt-3 font-bold">
                                                            <div className="w-1/2">{val.label}</div>
                                                        </div>
                                                        {val.data.map((vall: any, ii: number) => {
                                                            return (
                                                                <div key={ii} className="flex mt-1">
                                                                    <div className="w-1/2 ml-2 m-auto">- {vall.label}</div>
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
                                                        })}
                                                    </div>)
                                                })}
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
                                    edit: '/api/permission/',
                                    delete: '/api/permission/'
                                }}
                                urlFatch={'/api/permission'}
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