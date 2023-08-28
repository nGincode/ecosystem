/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState } from "react"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

import Select from "./components/reactSelect";
import ReactTable from "./components/reactTable";
import DebouncedInput from "./components/debouncedInput"

export default function Npwp({ userData, setuserData }: any) {
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const URL = "/api/npwp";
    const Subject = "NPWP";

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
                    handleApi('view_user')
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
            fullName: event.target.fullName.value,
            phone: event.target.phone.value,
            address: address
        };

        handleApi('create', data);
    };

    const modalData = [
        {
            name: 'npwp',
            type: 'number',
            id: 'npwp'
        },
        {
            name: 'fullName',
            type: 'text',
            id: 'fullName'
        },
        {
            name: 'phone',
            type: 'text',
            id: 'nophone'
        },
        {
            name: 'address',
            type: 'group',
            full: true,
            group: [
                { name: 'jalan', placeholder: 'Jl', type: 'text' },
                { name: 'block', type: 'text', placeholder: 'Block' },
                { name: 'no', type: 'number', placeholder: 'No' },
                { name: 'rt', type: 'number', placeholder: 'RT' },
                { name: 'rw', type: 'number', placeholder: 'RW' },
            ]
        },
        {
            type: 'group',
            full: true,
            group: [
                { name: 'kel', type: 'text', placeholder: 'Kel' },
                { name: 'kec', type: 'text', placeholder: 'Kec' },
                { name: 'kabkot', type: 'text', placeholder: 'Kab/Kot' },
                { name: 'prov', type: 'text', placeholder: 'Prov' },
                { name: 'kodepos', type: 'number', placeholder: 'Kode Pos' },
            ]
        },
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
                            <button type="button" className="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#addNew">
                                <i className="ri-user-add-line remix-icon"></i>
                                <span>Add NPWP</span>
                            </button>
                        </div>
                        <div className="modal fade" id="addNew" tabIndex={-1} aria-labelledby="addNewLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header py-16 px-24">
                                        <h5 className="modal-title" id="addNewLabel">Add {Subject}</h5>
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
                                                            val.type === 'text' ?
                                                                <div className="mb-24">
                                                                    <label htmlFor={val.id} className="form-label">
                                                                        <span className="text-danger me-4">*</span>
                                                                        {convertCamelCase(val.label ?? val.name)}
                                                                    </label>
                                                                    <input type={val.type} className="form-control" name={val.name} id={val.id} />
                                                                </div>
                                                                :
                                                                val.type === 'number' ?
                                                                    <div className="mb-24">
                                                                        <label htmlFor={val.id} className="form-label">
                                                                            <span className="text-danger me-4">*</span>
                                                                            {convertCamelCase(val.label ?? val.name)}
                                                                        </label>
                                                                        <input type={val.type} className="form-control" name={val.name} id={val.id} />
                                                                    </div> :
                                                                    val.type === 'email' ?
                                                                        <div className="mb-24">
                                                                            <label htmlFor={val.id} className="form-label">
                                                                                <span className="text-danger me-4">*</span>
                                                                                {convertCamelCase(val.label ?? val.name)}
                                                                            </label>
                                                                            <input type={val.type} className="form-control" name={val.name} id={val.id} />
                                                                        </div>
                                                                        : val.type === 'date' ?
                                                                            <div className="mb-24">
                                                                                <label htmlFor={val.id} className="form-label">
                                                                                    <span className="text-danger me-4">*</span>
                                                                                    {convertCamelCase(val.label ?? val.name)}
                                                                                </label>
                                                                                <input type={val.type} className="form-control" name={val.name} id={val.id} />
                                                                            </div>

                                                                            : val.type === 'group' ?
                                                                                <div className="mb-24">
                                                                                    {val.label || val.name ?
                                                                                        <label htmlFor={val.id} className="form-label">
                                                                                            <span className="text-danger me-4">*</span>
                                                                                            {convertCamelCase(val.label ?? val.name)}
                                                                                        </label>
                                                                                        : null}
                                                                                    <div className="input-group">
                                                                                        {val.group.map((vall: any, ii: number) => {
                                                                                            return (<input key={ii} type={vall.type} defaultValue={vall.defaultValue} readOnly={vall.readOnly} placeholder={vall.placeholder} name={vall.name} className="form-control" />)
                                                                                        })}
                                                                                    </div>
                                                                                </div>
                                                                                : val.type === 'textarea' ?
                                                                                    <div className="mb-24">
                                                                                        <label htmlFor={val.id} className="form-label">
                                                                                            <span className="text-danger me-4">*</span>
                                                                                            {convertCamelCase(val.label ?? val.name)}
                                                                                        </label>
                                                                                        <textarea id={val.id} name={val.name} className="form-control"></textarea>
                                                                                    </div>
                                                                                    : val.type === 'reactSelect' ?
                                                                                        <div className="mb-24">
                                                                                            <label htmlFor={val.id} className="form-label">
                                                                                                <span className="text-danger me-4">*</span>
                                                                                                {convertCamelCase(val.label ?? val.name)}
                                                                                            </label>
                                                                                            <Select
                                                                                                id={val.id}
                                                                                                name={val.name}
                                                                                                data={val.select}
                                                                                                search={val.search}
                                                                                            />
                                                                                        </div>
                                                                                        : null
                                                        }</div>
                                                }) : null}
                                            </div>
                                        </div>

                                        <div className="modal-footer pt-0 px-24 pb-24">
                                            <div className="divider"></div>

                                            <button type="submit" className="m-0 btn btn-primary w-100">Add</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3">
                        <div className="card-body px-0">
                            <ReactTable
                                search={search}
                                action={{
                                    edit: '/api/npwp/',
                                    delete: '/api/npwp/'
                                }}
                                urlFatch={'/api/npwp'}
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