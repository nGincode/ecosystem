import React, { Component, useEffect, useState } from "react"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { Input, Textarea, Button } from "@material-tailwind/react";
import Link from "next/link";

import Select from "../components/reactSelect";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"

export default function Users({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const [dataPermission, setdataPermission] = useState([]);
    const URLAPI = "/api/user";
    const Subject = "Users";

    if (typeof document !== "undefined") {
        (document as any).title = Subject;
    }

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create_user') {
            try {
                await axios({
                    method: "POST",
                    url: "/api/user",
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataCreate(res.data.data);
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

    const submitUsers = (event: any) => {
        event.preventDefault();
        if (event.target.password.value !== event.target.confirm_password.value) {
            toast.error("Password not match");
            return;
        }

        if (event.target.password.value < 8 || event.target.confirm_password.value < 8) {
            toast.error("Password min 8 char");
            return;
        }

        let data = {
            username: event.target.username.value,
            email: event.target.email.value,
            fullName: event.target.fullName.value,
            phone: event.target.phone.value,
            address: event.target.address.value,
            dateOfBirth: event.target.dateOfBirth.value,
            role: event.target.role_val.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
        };
        handleApi('create_user', data);

    };

    useEffect(() => {
        const handleApiFirst = async (url: any, data: any = null) => {
            if (url === 'view_permission') {
                try {
                    await axios({
                        method: "GET",
                        url: "/api/permission",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res: any) => {
                        setdataPermission(res.data.data.map((val: any, i: number) => { return { label: val.name, value: val.name } }));
                    });
                } catch (error: any) {
                    toast.error(error.response.data.massage);
                }
            }
        }
        handleApiFirst('view_permission');
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
    }, [userData]);



    return (
        <>
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

                        {pagePermission.find((val: any) => val == "create") ?
                            <div className="col hp-flex-none w-auto">
                                <Button type="button" className="w-100 px-5" variant="gradient" color="cyan" data-bs-toggle="modal" data-bs-target="#addNewUser"><i className="ri-add-line remix-icon"></i> Add Users</Button>
                            </div>
                            : null}
                        <div className="modal fade -mt-2" id="addNewUser" tabIndex={-1} aria-labelledby="addNewUserLabel" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header py-16 px-24">
                                        <h5 className="modal-title font-bold" id="addNewUserLabel">Add Users</h5>
                                        <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                            <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <div className="divider m-0"></div>

                                    {dataPermission.length ?
                                        <form onSubmit={submitUsers} id="formCreate">
                                            <div className="modal-body">
                                                <div className="row gx-8">
                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="fullName" label="Full Name" id="name" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="username" label="Username" id="username" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="email" required variant="standard" className="border-b-1" name="email" label="Email" id="email" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="text" required variant="standard" className="border-b-1" name="phone" label="Phone" id="nophone" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input type="date" required variant="standard" className="border-b-1" name="dateOfBirth" label="Date Of Birth" id="dateOfBirth" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Select variant="standard" required={true} label="Role" name="role" id="role" data={dataPermission} />
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <div className="mb-24">
                                                            <Textarea required variant="standard" className="border-b-1" id="address" label="Address" name="address"></Textarea>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input required type="password" autoComplete="" variant="standard" className="border-b-1" name="password" label="Password" id="password" />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-6">
                                                        <div className="mb-24">
                                                            <Input required type="password" autoComplete="" variant="standard" className="border-b-1" name="confirm_password" label="Confirm Password" id="confirm_password" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="modal-footer pt-0 px-24 pb-24">
                                                <div className="divider"></div>
                                                <Button type="submit" className="w-full" color="blue">Submit</Button>
                                            </div>
                                        </form> : <div className="text-center font-semibold my-3">
                                            Make permission first</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3 shadow-md">
                        <div className="card-body px-0">
                            <ReactTable
                                search={search}
                                action={{
                                    delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null,
                                    edit: pagePermission.find((val: any) => val == "edit") ? URLAPI : null
                                }}
                                urlFatch={URLAPI}
                                reload={dataCreate}
                                modalData={[
                                    {
                                        name: 'fullName',
                                        type: 'text',
                                        id: 'fullName',
                                        required: true
                                    },
                                    {
                                        name: 'username',
                                        type: 'text',
                                        id: 'usernameEdit',
                                        required: true
                                    },
                                    {
                                        name: 'email',
                                        type: 'email',
                                        id: 'emailEdit',
                                        required: true
                                    },
                                    {
                                        name: 'phone',
                                        type: 'text',
                                        id: 'nophoneEdit',
                                        required: true
                                    },
                                    {
                                        name: 'dateOfBirth',
                                        type: 'date',
                                        id: 'dateOfBirthEdit',
                                        required: true
                                    },
                                    {
                                        name: 'role',
                                        type: 'reactSelect',
                                        id: 'roleEdit',
                                        select: dataPermission,
                                        required: true
                                    },
                                    {
                                        name: 'status',
                                        type: 'reactSelect',
                                        id: 'statusEdit',
                                        select: [
                                            { value: 'active', label: 'Active' },
                                            { value: 'inactive', label: 'Inactive' },
                                            { value: 'pending', label: 'Pending' },
                                        ],
                                        required: true
                                    },
                                    {
                                        name: 'address',
                                        type: 'textarea',
                                        id: 'addressEdit',
                                        required: true,
                                        full: true
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}