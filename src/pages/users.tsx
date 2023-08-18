/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState } from "react"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

import Select from "./components/reactSelect";
import ReactTable from "./components/reactTable";
import DebouncedInput from "./components/debouncedInput"

export default function Users({ userData, setuserData }: any) {
    const [search, setsearch] = useState('');

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
            role: event.target.role.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
        };
        handleApi('create_user', data);

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
                                        Users
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>


                {/* <div className="col-12">
                    <div className="card hp-contact-card mb-32">
                        <div className="card-body px-0">
                            <div className="table-responsive">
                                <table className="table align-middle table-hover table-borderless">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Role</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                            <th>Phone</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>
                                                <a href="app-contact-detail.html">
                                                    <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle">
                                                        <img src="/app-assets/img/memoji/memoji-1.png" alt="Galen Slixby" />
                                                    </div>
                                                </a>
                                            </td>
                                            <td>
                                                Galen Slixby
                                            </td>
                                            <td>editor</td>
                                            <td>gslixby0@abc.net.au</td>
                                            <td>
                                                <div className="badge bg-danger-4 hp-bg-dark-danger text-danger border-danger">inactive</div>
                                            </td>
                                            <td>(479) 232-9151</td>
                                            <td className="text-end">
                                                <i className="iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }} />
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <a href="app-contact-detail.html">
                                                    <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle">
                                                        <img src="/app-assets/img/memoji/memoji-1.png" alt="Galen Slixby" />
                                                    </div>
                                                </a>
                                            </td>
                                            <td>
                                                Halsey Redmore
                                            </td>
                                            <td>author</td>
                                            <td>gslixby0@abc.net.au</td>
                                            <td>
                                                <div className="badge bg-warning-4 hp-bg-dark-warning text-warning border-warning">pending</div>
                                            </td>
                                            <td>(472) 607-9137</td>
                                            <td className="text-end">
                                                <i className="iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }}></i>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <a href="app-contact-detail.html">
                                                    <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle">
                                                        MS
                                                    </div>
                                                </a>
                                            </td>
                                            <td>
                                                Marjory Sicely
                                            </td>
                                            <td>maintainer</td>
                                            <td>msicely2@who.int</td>
                                            <td>
                                                <div className="badge bg-success-4 hp-bg-dark-success text-success border-success">active</div>
                                            </td>
                                            <td>(321) 264-4599</td>
                                            <td className="text-end">
                                                <i className="iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }}></i>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <a href="app-contact-detail.html">
                                                    <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle">
                                                        <i className="iconly-Curved-User"></i>
                                                    </div>
                                                </a>
                                            </td>
                                            <td>
                                                Cyrill Risby
                                            </td>
                                            <td>maintainer</td>
                                            <td>crisby3@wordpress.com</td>
                                            <td>
                                                <div className="badge bg-danger-4 hp-bg-dark-danger text-danger border-danger">inactive</div>
                                            </td>
                                            <td>(923) 690-6806</td>
                                            <td className="text-end">
                                                <i className="iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }}></i>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <a href="app-contact-detail.html">
                                                    <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle">
                                                        <i className="iconly-Curved-User"></i>
                                                    </div>
                                                </a>
                                            </td>
                                            <td>
                                                Maggy Hurran
                                            </td>
                                            <td>subscriber</td>
                                            <td>mhurran4@yahoo.co.jp</td>
                                            <td>
                                                <div className="badge bg-warning-4 hp-bg-dark-warning text-warning border-warning">pending</div>
                                            </td>
                                            <td>(669) 914-1078</td>
                                            <td className="text-end">
                                                <i className="iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }}></i>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <a href="app-contact-detail.html">
                                                    <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle">
                                                        <i className="iconly-Curved-User"></i>
                                                    </div>
                                                </a>
                                            </td>
                                            <td>
                                                Silvain Halstead
                                            </td>
                                            <td>author</td>
                                            <td>shalstead5@shinystat.com</td>
                                            <td>
                                                <div className="badge bg-success-4 hp-bg-dark-success text-success border-success">active</div>
                                            </td>
                                            <td>(958) 973-3093</td>
                                            <td className="text-end">
                                                <i className="iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }}></i>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <nav>
                                <ul className="pagination justify-content-end px-32 pb-5">
                                    <li className="page-item">
                                        <a className="page-link" href="#" style={{ padding: "12px" }}>
                                            <svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="12px" height="12px" fill="currentColor" aria-hidden="true">
                                                <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                                            </svg>
                                        </a>
                                    </li>

                                    <li className="page-item">
                                        <a className="page-link" href="#">1</a>
                                    </li>

                                    <li className="page-item">
                                        <a className="page-link" href="#" style={{ padding: "12px" }}>
                                            <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="12px" height="12px" fill="currentColor" aria-hidden="true">
                                                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                                            </svg>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div> */}
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
                            <button type="button" className="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#addNewUser">
                                <i className="ri-user-add-line remix-icon"></i>
                                <span>Add New User</span>
                            </button>
                        </div>
                        <div className="modal fade" id="addNewUser" tabIndex={-1} aria-labelledby="addNewUserLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header py-16 px-24">
                                        <h5 className="modal-title" id="addNewUserLabel">Add Users</h5>
                                        <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                            <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <div className="divider m-0"></div>

                                    <form onSubmit={submitUsers} id="formCreate">
                                        <div className="modal-body">
                                            <div className="row gx-8">
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="name" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            Full name
                                                        </label>
                                                        <input type="text" className="form-control" name="fullName" id="name" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="userName" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            User Name
                                                        </label>
                                                        <input type="text" className="form-control" id="userName" name="username" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="email" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            Email
                                                        </label>
                                                        <input type="email" className="form-control" id="email" name="email" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="nophone" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            Phone
                                                        </label>
                                                        <input type="text" className="form-control" id="nophone" name="phone" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="dateOfBirth" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            Date of Birth
                                                        </label>
                                                        <input type="date" className="form-control" id="dateOfBirth" name="dateOfBirth" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="role" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            Role
                                                        </label>
                                                        <Select name="role" id="role" data={[
                                                            { value: 'admin', label: 'Admin' },
                                                            { value: 'staff', label: 'Staff' }
                                                        ]} />
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <div className="mb-24">
                                                        <label htmlFor="personelText" className="form-label">Address</label>
                                                        <textarea id="personelText" name="address" className="form-control"></textarea>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="password" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            Password
                                                        </label>
                                                        <input type="password" className="form-control" id="password" name="password" />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-6">
                                                    <div className="mb-24">
                                                        <label htmlFor="confirm_password" className="form-label">
                                                            <span className="text-danger me-4">*</span>
                                                            Confirm Password
                                                        </label>
                                                        <input type="password" className="form-control" id="confirm_password" name="confirm_password" />
                                                    </div>
                                                </div>
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
                                    edit: '/api/user/',
                                    delete: '/api/user/'
                                }}
                                urlFatch={'/api/user'}
                                modalData={[
                                    {
                                        name: 'fullName',
                                        type: 'text',
                                        id: 'fullName'
                                    },
                                    {
                                        name: 'username',
                                        type: 'text',
                                        id: 'usernameEdit'
                                    },
                                    {
                                        name: 'email',
                                        type: 'email',
                                        id: 'emailEdit'
                                    },
                                    {
                                        name: 'phone',
                                        type: 'text',
                                        id: 'nophoneEdit'
                                    },
                                    {
                                        name: 'dateOfBirth',
                                        type: 'date',
                                        id: 'dateOfBirthEdit'
                                    },
                                    {
                                        name: 'role',
                                        type: 'reactSelect',
                                        id: 'roleEdit',
                                        select: [
                                            { value: 'admin', label: 'Admin' },
                                            { value: 'staff', label: 'Staff' }
                                        ]
                                    },
                                    {
                                        name: 'status',
                                        type: 'reactSelect',
                                        id: 'statusEdit',
                                        select: [
                                            { value: 'active', label: 'Active' },
                                            { value: 'inactive', label: 'Inactive' },
                                            { value: 'pending', label: 'Pending' },
                                        ]
                                    },
                                    {
                                        name: 'address',
                                        type: 'textarea',
                                        id: 'addressEdit'
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