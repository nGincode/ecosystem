/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState, Suspense } from "react"
import toast, { Toaster } from 'react-hot-toast';

import Chart from "./components/chart";
import Skelaton from './components/skelaton';

export default function Index({ userData, setuserData }: any) {

    useEffect(() => {
        require("./../../public/app-assets/js/cards/card-analytic.js");
        require("./../../public/app-assets/js/cards/card-advance.js");
        require("./../../public/app-assets/js/cards/card-statistic.js");
    }, []);




    return (
        <div className="row mb-32 g-32">
            <div className="col flex-grow-1 overflow-hidden">
                <div className="row g-32">
                    <div className="col-12">
                        <h1 className="hp-mb-0 text-4xl font-bold">Dashboard</h1>
                    </div>

                    <div className="col-12">
                        <div className="row g-32">
                            <div className="col-md-4 col-6">
                                <div className="card shadow-md  hp-dashboard-feature-card hp-border-color-black-0 hp-border-color-dark-80 hp-cursor-pointer">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center hp-dashboard-feature-card-icon rounded-3 hp-bg-black-20 hp-bg-dark-80" style={{ width: "48px", height: "48px" }}>
                                            <svg className="hp-text-color-black-bg hp-text-color-dark-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M18.809 6.25h1.36c-.19-.27-.39-.52-.6-.77l-.76.77ZM18.52 4.42c-.25-.21-.5-.41-.77-.6v1.36l.77-.76ZM19.58 5.481l2.95-2.95c.29-.29.29-.77 0-1.06a.754.754 0 0 0-1.06 0l-2.95 2.95c.38.33.73.69 1.06 1.06ZM17.752 3c0-.41-.34-.75-.75-.75-.4 0-.72.32-.74.71.52.25 1.02.53 1.49.86V3ZM21.752 7c0-.41-.34-.75-.75-.75h-.83c.33.47.62.97.86 1.49.4-.02.72-.34.72-.74ZM12.75 14.75h.3c.39 0 .7-.35.7-.78 0-.54-.15-.62-.49-.74l-.51-.18v1.7Z" fill="currentColor"></path>
                                                <path d="M21.04 7.74c-.01 0-.02.01-.04.01h-4c-.1 0-.19-.02-.29-.06a.782.782 0 0 1-.41-.41.868.868 0 0 1-.05-.28V3c0-.01.01-.02.01-.04C14.96 2.35 13.52 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.52-.35-2.96-.96-4.26Zm-7.29 4.08c.64.22 1.5.69 1.5 2.16 0 1.25-.99 2.28-2.2 2.28h-.3v.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-.25h-.08c-1.33 0-2.42-1.12-2.42-2.5 0-.42.34-.76.75-.76s.75.34.75.75c0 .55.41 1 .92 1h.08v-2.22l-1-.35c-.64-.22-1.5-.69-1.5-2.16 0-1.25.99-2.28 2.2-2.28h.3V7.5c0-.41.34-.75.75-.75s.75.34.75.75v.25h.08c1.33 0 2.42 1.12 2.42 2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.55-.41-1-.92-1h-.08v2.22l1 .35Z" fill="currentColor"></path>
                                                <path d="M10.25 10.03c0 .54.15.62.49.74l.51.18v-1.7h-.3c-.38 0-.7.35-.7.78Z" fill="currentColor"></path>
                                            </svg>
                                        </div>

                                        <div className="d-flex mt-12">
                                            <span className="h4 mb-0 d-block hp-text-color-black-bg hp-text-color-dark-0 fw-medium me-4"> Income </span>
                                            <div>
                                                <svg className="hp-text-color-success-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path fill="currentColor" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2zm1.06 10.33c0 .41-.34.75-.75.75s-.75-.34-.75-.75V9.31l-7.72 7.72c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 010-1.06l7.72-7.72h-3.02c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4.83c.41 0 .75.34.75.75v4.83z"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <span className="hp-caption mt-4 d-block fw-normal hp-text-color-black-60"> April 2022 </span>
                                        <span className="d-block mt-12 mb-8 h3"> $13,908 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-6">
                                <div className="card hp-dashboard-feature-card hp-border-color-black-0 hp-border-color-dark-80 hp-cursor-pointer">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center hp-dashboard-feature-card-icon rounded-3 hp-bg-black-20 hp-bg-dark-80" style={{ width: "48px", height: "48px" }}>
                                            <svg className="hp-text-color-black-bg hp-text-color-dark-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M10.25 10.03c0 .54.15.62.49.74l.51.18v-1.7h-.3c-.38 0-.7.35-.7.78ZM12.75 14.75h.3c.39 0 .7-.35.7-.78 0-.54-.15-.62-.49-.74l-.51-.18v1.7Z" fill="currentColor"></path>
                                                <path d="m19.58 5.48-2.05 2.05c-.15.15-.34.22-.53.22s-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l2.05-2.05C16.76 2.92 14.49 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.49-.92-4.76-2.42-6.52Zm-5.83 6.34c.64.23 1.5.69 1.5 2.16 0 1.25-.99 2.28-2.2 2.28h-.3v.25c0 .41-.34.75-.75.75s-.75-.34-.75-.75v-.25h-.08c-1.33 0-2.42-1.12-2.42-2.5 0-.42.34-.76.75-.76s.75.34.75.75c0 .55.41 1 .92 1h.08v-2.22l-1-.35c-.64-.23-1.5-.69-1.5-2.16 0-1.25.99-2.28 2.2-2.28h.3V7.5c0-.41.34-.75.75-.75s.75.34.75.75v.25h.08c1.33 0 2.42 1.12 2.42 2.5 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-.55-.41-1-.92-1h-.08v2.22l1 .35ZM22.69 1.71a.782.782 0 0 0-.41-.41.868.868 0 0 0-.28-.05h-4c-.41 0-.75.34-.75.75s.34.75.75.75h2.19l-1.67 1.67c.38.33.73.68 1.06 1.06l1.67-1.67V6c0 .41.34.75.75.75s.75-.34.75-.75V2c0-.1-.02-.19-.06-.29Z" fill="currentColor"></path>
                                            </svg>
                                        </div>

                                        <div className="d-flex mt-12">
                                            <span className="h4 mb-0 d-block hp-text-color-black-bg hp-text-color-dark-0 fw-medium me-4"> Expenses </span>
                                            <div>
                                                <svg className="hp-text-color-danger-1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path fill="currentColor" d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2zm1.34 5.53l-7.72 7.72h3.02c.41 0 .75.34.75.75s-.34.75-.75.75H8c-.41 0-.75-.34-.75-.75v-4.83c0-.41.34-.75.75-.75s.75.34.75.75v3.02l7.72-7.72c.15-.15.34-.22.53-.22s.38.07.53.22c.29.29.29.77 0 1.06z"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <span className="hp-caption mt-4 d-block fw-normal hp-text-color-black-60"> April 2022 </span>
                                        <span className="d-block mt-12 mb-8 h3"> $7,949 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 col-6">
                                <div className="card hp-dashboard-feature-card hp-border-color-black-0 hp-border-color-dark-80 hp-cursor-pointer">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-center hp-dashboard-feature-card-icon rounded-3 hp-bg-black-20 hp-bg-dark-80" style={{ width: "48px", height: "48px" }}>
                                            <svg className="hp-text-color-black-bg hp-text-color-dark-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="m11.94 2.212-2.41 5.61H7.12c-.4 0-.79.03-1.17.11l1-2.4.04-.09.06-.16c.03-.07.05-.13.08-.18 1.16-2.69 2.46-3.53 4.81-2.89ZM18.731 8.09l-.02-.01c-.6-.17-1.21-.26-1.83-.26h-6.26l2.25-5.23.03-.07c.14.05.29.12.44.17l2.21.93c1.23.51 2.09 1.04 2.62 1.68.09.12.17.23.25.36.09.14.16.28.2.43.04.09.07.17.09.26.15.51.16 1.09.02 1.74ZM18.288 9.52c-.45-.13-.92-.2-1.41-.2h-9.76c-.68 0-1.32.13-1.92.39a4.894 4.894 0 0 0-2.96 4.49v1.95c0 .24.02.47.05.71.22 3.18 1.92 4.88 5.1 5.09.23.03.46.05.71.05h7.8c3.7 0 5.65-1.76 5.84-5.26.01-.19.02-.39.02-.59V14.2a4.9 4.9 0 0 0-3.47-4.68Zm-3.79 7.23h-5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
                                            </svg>
                                        </div>

                                        <div className="d-flex mt-12">
                                            <span className="h4 mb-0 d-block hp-text-color-black-bg hp-text-color-dark-0 fw-medium me-4"> Balance </span>
                                            <div></div>
                                        </div>

                                        <span className="hp-caption mt-4 d-block fw-normal hp-text-color-black-60"> April 2022 </span>
                                        <span className="d-block mt-12 mb-8 h3"> $5,129 </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="row">
                            <div className="mb-18 col-12">
                                <div className="row align-items-center justify-content-between">
                                    <div className="hp-flex-none w-auto col">
                                        <span className="d-block hp-p1-body">Balance</span>
                                        <span className="d-block mt-4 h3 fw-semibold hp-text-color-black-bg hp-text-color-dark-0"> $12.389 </span>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="hp-p1-body d-block">Past 30 Days</span>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden col-12 mb-n24">
                                <Chart />
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-sm-6 col-12">
                                <span className="h3 fw-semibold hp-text-color-black-bg hp-text-color-dark-0 d-block mb-0"> History </span>
                                <p className="hp-p1-body mt-4 mb-0">Transection of last 6 months</p>
                            </div>

                            <div className="col"></div>
                        </div>

                        <div className="row mt-24 mx-0">
                            <div className="hp-bg-black-0 hp-bg-dark-100 border hp-border-color-black-10 hp-border-color-dark-80 p-12 mb-16 col-12 rounded-5">
                                <div className="row align-items-center justify-content-between">
                                    <div className="mb-16 mb-sm-0 col-sm-6 col-12">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="hp-cursor-pointer border hp-border-color-dark-80 me-16" style={{ borderRadius: "15px" }}>
                                                    <div className="overflow-hidden m-4 d-flex hp-bg-danger-4" style={{ minWidth: "64px", width: "64px", height: "64px", borderRadius: "15px" }}>
                                                        <img src="./app-assets/img/memoji/user-avatar-5.png" alt="User" height="100%" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block h4 mb-0">Edward Adams</span>
                                                <span className="d-block hp-p1-body mt-4">Product Designer</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm-end text-start col-sm-3 col-6" style={{ minHeight: "50px" }}>
                                        <span className="d-block h4 fw-normal mb-0"> $ 7734.32 </span>
                                        <span className="d-block hp-p1-body mt-4">30432</span>
                                    </div>

                                    <div className="text-end col-sm-3 col-6" style={{ minHeight: "50px" }}>
                                        <span className="h4">23.23%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-bg-black-0 hp-bg-dark-100 border hp-border-color-black-10 hp-border-color-dark-80 p-12 mb-16 col-12 rounded-5">
                                <div className="row align-items-center justify-content-between">
                                    <div className="mb-16 mb-sm-0 col-sm-6 col-12">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="hp-cursor-pointer border hp-border-color-dark-80 me-16" style={{ borderRadius: "15px" }}>
                                                    <div className="overflow-hidden m-4 d-flex hp-bg-info-4" style={{ minWidth: "64px", width: "64px", height: "64px", borderRadius: "15px" }}>
                                                        <img src="./app-assets/img/memoji/user-avatar-6.png" alt="User" height="100%" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block h4 mb-0">John Doe</span>
                                                <span className="d-block hp-p1-body mt-4">Product Designer</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm-end text-start col-sm-3 col-6" style={{ minHeight: "50px" }}>
                                        <span className="d-block h4 fw-normal mb-0"> $ 7614.43 </span>
                                        <span className="d-block hp-p1-body mt-4">949</span>
                                    </div>

                                    <div className="text-end col-sm-3 col-6" style={{ minHeight: "50px" }}>
                                        <span className="h4">19.03%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-bg-black-0 hp-bg-dark-100 border hp-border-color-black-10 hp-border-color-dark-80 p-12 mb-16 col-12 rounded-5">
                                <div className="row align-items-center justify-content-between">
                                    <div className="mb-16 mb-sm-0 col-sm-6 col-12">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="hp-cursor-pointer border hp-border-color-dark-80 me-16" style={{ borderRadius: "15px" }}>
                                                    <div className="overflow-hidden m-4 d-flex hp-bg-warning-4" style={{ minWidth: "64px", width: "64px", height: "64px", borderRadius: "15px" }}>
                                                        <img src="./app-assets/img/memoji/user-avatar-7.png" alt="User" height="100%" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block h4 mb-0">Fazıl Say</span>
                                                <span className="d-block hp-p1-body mt-4">Product Designer</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm-end text-start col-sm-3 col-6" style={{ minHeight: "50px" }}>
                                        <span className="d-block h4 fw-normal mb-0"> $ 6789.19 </span>
                                        <span className="d-block hp-p1-body mt-4">732</span>
                                    </div>

                                    <div className="text-end col-sm-3 col-6" style={{ minHeight: "50px" }}>
                                        <span className="h4">13.98%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hp-flex-none w-auto hp-dashboard-line px-0 col">
                <div className="hp-bg-black-40 hp-bg-dark-80 h-100 mx-24" style={{ width: "1px" }}></div>
            </div>

            <div className="col hp-analytics-col-2">
                <div className="row g-32">
                    <div className="col-12">
                        <div className="overflow-hidden position-relative pt-24 px-24 pb-18 rounded-5" style={{ minHeight: "200px", backgroundImage: "url('../../app-assets/img/npwp-front.png')", backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                            <div className="position-absolute w-100" style={{ height: "90%", bottom: "0px", left: "0px" }}>

                            </div>

                            <div className="row text-black">
                                <div className="col-12">
                                    <span className="text-xs float-right font-semibold"> KPP PRATAMA LUBUK LINGGAU </span>
                                </div>

                                <div className="mt-32 col-12">
                                    <span className="d-block font-bold text-2xl"> 78.201.565.5-303.000 </span>
                                    <span className="font-semibold" style={{ fontSize: '10px', lineHeight: "0.5rem" }}> ERIK <hr /> NIK : 1673072104910003 </span>
                                </div>
                                <div className="col-12 mt-1">
                                    <div className="ml-11 absolute w-52 font-semibold" style={{ fontSize: '8px', lineHeight: "0.5rem" }}>JALAN YOS SUDARSO, 01, MARGA RAHAYU, LUBUK LINGGAU SELATAN II, KOTA LUBUK LINGGAU, SUMATERA SELATAN, 31633</div>
                                    <img className="w-10" src="data:image/jpg;base64,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" alt="qrcode" />
                                    <span className="ml-11 -mt-2 absolute w-52 font-semibold" style={{ fontSize: '8px', lineHeight: "0.5rem" }}> Tanggal Terdaftar 19/05/2009</span>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <span className="h3 d-block fw-semibold hp-text-color-black-bg hp-text-color-dark-0 mb-0"> Recent Activities </span>
                        <span className="hp-p1-body d-block mt-4">05 Dec 2021</span>

                        <div className="row mt-24">
                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/zendesk-logo.svg" alt="Zendesk" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Zendesk </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 05 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 500.00 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/sales-force-logo.svg" alt="Sales Force" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Sales Force </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 24 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 337.00 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/apple-logo.svg" alt="Apple" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Apple </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 29 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 320.67 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/google-logo.svg" alt="Google Inc" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Google Inc </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 29 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 127.00 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/virgin-logo.svg" alt="Virgin Media" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Virgin Media </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 29 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 28.00 </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <span className="h3 d-block fw-semibold hp-text-color-black-bg hp-text-color-dark-0 mb-0"> Upcoming Payments </span>
                        <span className="hp-p1-body d-block mt-4">05 Dec 2021</span>

                        <div className="row mt-24">
                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/zendesk-logo.svg" alt="Zendesk" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Zendesk </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 05 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 500.00 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/sales-force-logo.svg" alt="Sales Force" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Sales Force </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 24 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 337.00 </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hp-cursor-pointer hp-transition hp-hover-bg-dark-100 hp-hover-bg-black-10 rounded py-8 mb-16 col-12">
                                <div className="row align-items-end justify-content-between">
                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="hp-flex-none w-auto pe-0 col">
                                                <div className="me-16 border hp-border-color-black-10 hp-bg-black-0 rounded-3 d-flex align-items-center justify-content-center" style={{ minWidth: "48px", height: "48px" }}>
                                                    <img src="./app-assets/img/dashboard/virgin-logo.svg" alt="Virgin Media" />
                                                </div>
                                            </div>

                                            <div className="hp-flex-none w-auto ps-0 col">
                                                <span className="d-block hp-p1-body fw-medium hp-text-color-black-bg hp-text-color-dark-0"> Virgin Media </span>
                                                <span className="d-block hp-caption fw-normal hp-text-color-black-60"> 29 Dec 2021 </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hp-flex-none w-auto col">
                                        <span className="h5 hp-text-color-black-bg hp-text-color-dark-0"> $ 28.00 </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}