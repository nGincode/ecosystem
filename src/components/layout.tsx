/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect } from "react"
import { useRouter } from 'next/router'
import Link from "next/link";

import HeaderSearch from "./headerSearch";
import ReactSelect from "./reactSelect";
import AccessData from "./accessData";

export default function layout({ children = null, logOut, userData }: any) {
    const router = useRouter();

    useEffect(() => {
        require("./../../public/app-assets/js/plugin/swiper-bundle.min.js");
        require("./../../public/app-assets/js/plugin/jquery.mask.min.js");

        require("./../../public/app-assets/js/layouts/sider.js");
        require("./../../public/app-assets/js/components/input-number.js");

        require("./../../public/app-assets/js/base/index.js");

        require("./../../public/assets/js/main.js");
    }, []);


    const Menu = () => {
        return <>
            {
                AccessData('menu').map((val: any, i: number) => {
                    let PermissionLabel = userData.permission?.data?.find((find: any) => val.label == find.label.toUpperCase());
                    if (PermissionLabel?.check)
                        return (
                            <li key={i}>
                                <div className="menu-title">{val.label}</div>
                                <ul>
                                    {val.option.map((vall: any, ii: number) => {
                                        let OptionTrue = PermissionLabel?.data?.find((find: any) => find.label == vall.label).check;
                                        if (PermissionLabel?.data?.find((find: any) => find.label == vall.label)?.checklist?.find((find: any) => find == "view") || OptionTrue)
                                            return (
                                                <span key={ii}>
                                                    {vall.dropdown ?
                                                        <li>
                                                            <Link href="" className={vall.option.find((el: any) => el.link === router.asPath) ? "submenu-item  active arrow-active" : "submenu-item "}>
                                                                <span>
                                                                    <span className="submenu-item-icon">
                                                                        {vall.icon}
                                                                    </span>
                                                                    <span>{vall.label}</span>
                                                                </span>
                                                                <div className="menu-arrow"></div>
                                                            </Link>

                                                            <ul className={vall.option.find((el: any) => el.link === router.asPath) ? "submenu-children active" : "submenu-children"} data-level={1} style={vall.option.find((el: any) => el.link === router.asPath) ? { display: "block" } : {}}>
                                                                {vall.option.map((valll: any, iii: number) => {
                                                                    if (PermissionLabel?.data?.find((find: any) => find.label == vall.label).data.find((fd: any) => fd.link == valll.link)?.checklist?.find((find: any) => find == "view"))
                                                                        return (
                                                                            <li key={iii}>
                                                                                <Link href={valll.link} className={router.asPath === valll.link ? "active" : ""}>
                                                                                    <div className="flex">
                                                                                        <span className="submenu-item-icon">
                                                                                            {valll.icon}
                                                                                        </span>
                                                                                        <span className="ml-1 mt-0.5">{valll.label}</span>
                                                                                    </div>
                                                                                </Link>
                                                                            </li>)
                                                                })}
                                                            </ul>
                                                        </li>
                                                        :
                                                        <li>
                                                            <Link href={vall.link} className={`${(router.asPath === vall.link ? "active" : "")}`}>
                                                                <div className="tooltip-item in-active" data-bs-toggle="tooltip" data-bs-placement="right" title="" data-bs-original-title={vall.label} aria-label={vall.label}></div>
                                                                <span>
                                                                    <span className="submenu-item-icon">
                                                                        {vall.icon}
                                                                    </span>
                                                                    <span>{vall.label}</span>
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    }
                                                </span>)
                                    })}
                                </ul>
                            </li>)
                })
            }
        </>
    }

    return (
        <>
            <HeaderSearch />
            <main className="hp-bg-color-dark-90 d-flex min-vh-100 bg-gradient-to-r from-gray-100 from-20% to-cyan-200 to-100%">
                <div className=" hp-bg-color-black-20delete hp-sidebar hp-bg-color-dark-90 border-end border-black-40 hp-border-color-dark-80">
                    <div className="hp-sidebar-container">
                        <div className="hp-sidebar-header-menu">
                            <div className="row justify-content-between align-items-center mx-0">
                                <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-visible">
                                    <div className="hp-cursor-pointer">
                                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div className="w-auto px-0">
                                    <div className="hp-header-logo d-flex align-items-center">
                                        <div className="position-relative font-bold text-center">
                                            <img className="hp-logo hp-sidebar-visible hp-dark-none" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-visible hp-dark-block" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-block  h-14" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                            <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-block h-14" src="/img/logo.png" alt="logo" />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-hidden">
                                    <div className="hp-cursor-pointer mb-4">
                                        <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                            <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <ul>
                                {Menu()}

                            </ul>
                        </div>

                        <ReactSelect
                            label={JSON.parse(localStorage.getItem('companyActive') as string)?.value ? "" : "Company Select..."}
                            data={userData.company?.map((val: any) => { return { label: val.name, value: val.uuid } })}
                            defaultValue={userData.company?.map((val: any) => { return { label: val.name, value: val.uuid } }).find((val: any) => val.value === JSON.parse(localStorage.getItem('companyActive') as string)?.value)}
                            setSearchValue={(vall: any) => {
                                localStorage.setItem('companyActive', JSON.stringify(userData.company?.map((val: any) => { return { label: val.name, value: val.uuid } }).find((val: any) => val.value === vall)));
                                location.reload();
                            }}

                        />
                        <div className="row justify-content-between align-items-center hp-sidebar-footer mx-0 hp-bg-color-dark-90">
                            <div className="divider border-black-40 hp-border-color-dark-70 hp-sidebar-hidden mt-0 px-0"></div>

                            <div className="col">
                                <div className="row align-items-center">
                                    <div className="w-auto px-0">
                                        {userData.img ?
                                            <div className="avatar-item bg-primary-4 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                <img src={userData.img} height="100%" className="hp-img-cover object-cover rounded-full w-12 h-12" />
                                            </div>
                                            :
                                            <div className="avatar-item d-flex align-items-center justify-content-center avatar-lg hp-bg-primary-4 hp-text-color-primary-1 rounded-circle">
                                                <i className="iconly-Curved-User"></i>
                                            </div>}
                                    </div>

                                    <div className="w-auto ms-8 px-0 hp-sidebar-hidden mt-4">
                                        <span className="d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body lh-1">{userData.fullName ?? userData.username}</span>
                                        <Link href="/profile" className="hp-badge-text fw-normal hp-text-color-dark-30">View Profile</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col hp-flex-none w-auto px-0 hp-sidebar-hidden">
                                <Link href="/profile">
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="remix-icon hp-text-color-black-100 hp-text-color-dark-0" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <g>
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                            <path d="M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672c.579.59 1.093 1.261 1.525 2.01.433.749.757 1.53.978 2.326a3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.501 4.337 3 3 0 0 0-4.631 2.674 9.99 9.99 0 0 1-5.007-.002 3 3 0 0 0-4.632-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001A4.993 4.993 0 0 1 15 17.197a4.993 4.993 0 0 1 3.525-.565c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77c-.499-.047-1-.048-1.499-.001A4.993 4.993 0 0 1 9 6.803a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334a8.126 8.126 0 0 0 .75 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                        </g>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hp-main-layout">
                    <header>
                        <div className="row w-100 m-0">
                            <div className="col px-0">
                                <div className="row w-100 align-items-center justify-content-between position-relative">
                                    <div className="col w-auto hp-flex-none hp-mobile-sidebar-button me-24 px-0" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
                                        <button type="button" className="btn btn-text btn-icon-only">
                                            <i className="ri-menu-fill hp-text-color-black-80 hp-text-color-dark-30 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <div className="hp-header-text-info col col-lg-14 col-xl-16 hp-header-start-text d-flex align-items-center hp-horizontal-none">
                                        <div className="d-flex overflow-hidden rounded-4 hp-bg-color-black-0 hp-bg-color-dark-100" style={{ minWidth: "45px", width: "45px", height: "45px" }}>
                                            <img src="/app-assets/img/memoji/newspaper.svg" alt="Newspaper" height="80%" style={{ marginTop: "auto", marginLeft: "auto" }} />
                                        </div>

                                        <p className="hp-header-start-text-item hp-input-label fw-normal hp-text-color-black-100 hp-text-color-dark-0 ms-12 mb-0 lh-1 d-flex align-items-center">
                                            Apa kerjaan yang harus anda kerjakan duluan?&nbsp;&nbsp;
                                            <span className="hp-text-color-primary-1">Input data penjualan.</span>
                                        </p>
                                    </div>

                                    <div className="hp-header-search d-none col">
                                        <input type="text" className="form-control" placeholder="Search..." id="header-search" autoComplete="off" />
                                    </div>

                                    <div className="col hp-flex-none w-auto pe-0">
                                        <div className="row align-items-center justify-content-end">
                                            <div className="w-auto px-0">
                                                <div className="d-flex align-items-center me-4 hp-header-search-button">
                                                    <button type="button" className="btn btn-icon-only bg-transparent border-0 hp-hover-bg-black-10 hp-hover-bg-dark-100 hp-transition d-flex align-items-center justify-content-center" style={{ height: "40px" }}>
                                                        <svg className="hp-header-search-button-icon-1 hp-text-color-black-80 hp-text-color-dark-30" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                        <i className="d-none hp-header-search-button-icon-2 ri-close-line hp-text-color-black-60" style={{ fontSize: "24px" }}></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="hover-dropdown-fade w-auto px-0 d-flex align-items-center position-relative">
                                                <button type="button" className="btn btn-icon-only bg-transparent border-0 hp-hover-bg-black-10 hp-hover-bg-dark-100 hp-transition d-flex align-items-center justify-content-center" style={{ height: "40px" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" className="hp-text-color-black-80 hp-text-color-dark-30">
                                                        <path d="M12 6.44v3.33M12.02 2C8.34 2 5.36 4.98 5.36 8.66v2.1c0 .68-.28 1.7-.63 2.28l-1.27 2.12c-.78 1.31-.24 2.77 1.2 3.25a23.34 23.34 0 0 0 14.73 0 2.22 2.22 0 0 0 1.2-3.25l-1.27-2.12c-.35-.58-.63-1.61-.63-2.28v-2.1C18.68 5 15.68 2 12.02 2Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"></path>
                                                        <path d="M15.33 18.82c0 1.83-1.5 3.33-3.33 3.33-.91 0-1.75-.38-2.35-.98-.6-.6-.98-1.44-.98-2.35" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
                                                    </svg>
                                                    <span className="position-absolute translate-middle p-2 rounded-circle bg-primary hp-notification-circle" style={{ width: "6px", height: "6px", top: "12px" }}></span>
                                                </button>

                                                <div className="hp-notification-menu dropdown-fade position-absolute pt-18" style={{ width: "380px", top: "100%" }}>
                                                    <div className="p-24 rounded hp-bg-black-0 hp-bg-dark-100">
                                                        <div className="row justify-content-between align-items-center mb-16">
                                                            <div className="col hp-flex-none w-auto h5 hp-text-color-black-100 hp-text-color-dark-10 hp-text-color-dark-0 me-64 mb-0">Notifications</div>

                                                            <div className="col hp-flex-none w-auto hp-badge-text fw-medium hp-text-color-black-80 me-12 px-0">4 New</div>
                                                        </div>

                                                        <div className="divider my-4"></div>

                                                        <div className="hp-overflow-y-auto px-10" style={{ maxHeight: "400px", marginRight: "-10px", marginLeft: "-10px" }}>
                                                            <div className="row hp-cursor-pointer rounded hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 py-12 px-10" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                                <div className="w-auto px-0 me-12">
                                                                    <div className="avatar-item d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                                        <img src="/app-assets/img/memoji/user-avatar-1.png" className="w-100" />
                                                                    </div>
                                                                </div>

                                                                <div className="w-auto px-0 col">
                                                                    <p className="d-block fw-medium hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 mb-4">
                                                                        Debi Cakar
                                                                        <span className="hp-text-color-black-60">commented on</span>
                                                                        Ecosystem and conservation
                                                                    </p>

                                                                    <span className="d-block hp-badge-text fw-medium hp-text-color-black-60 hp-text-color-dark-40">1m ago</span>
                                                                </div>
                                                            </div>

                                                            <div className="row hp-cursor-pointer rounded hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 py-12 px-10" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                                <div className="w-auto px-0 me-12">
                                                                    <div className="avatar-item d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                                        <img src="/app-assets/img/memoji/user-avatar-2.png" className="w-100" />
                                                                    </div>
                                                                </div>

                                                                <div className="w-auto px-0 col">
                                                                    <p className="d-block fw-medium hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 mb-4">
                                                                        Edward Adams <span className="hp-text-color-black-60">invite you</span> to Prototyping
                                                                    </p>

                                                                    <span className="d-block hp-badge-text fw-medium hp-text-color-black-60 hp-text-color-dark-40">9h ago</span>
                                                                </div>
                                                            </div>

                                                            <div className="row hp-cursor-pointer rounded hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 py-12 px-10" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                                <div className="w-auto px-0 me-12">
                                                                    <div className="avatar-item d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                                        <img src="/app-assets/img/memoji/user-avatar-3.png" className="w-100" />
                                                                    </div>
                                                                </div>

                                                                <div className="w-auto px-0 col">
                                                                    <p className="d-block fw-medium hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 mb-4">
                                                                        Richard Charles <span className="hp-text-color-black-60">mentioned you in</span> UX Basics Field
                                                                    </p>

                                                                    <span className="d-block hp-badge-text fw-medium hp-text-color-black-60 hp-text-color-dark-40">13h ago</span>
                                                                </div>
                                                            </div>

                                                            <div className="row hp-cursor-pointer rounded hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-80 py-12 px-10" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                                <div className="w-auto px-0 me-12">
                                                                    <div className="avatar-item hp-bg-dark-success bg-success-4 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="hp-text-color-success-1">
                                                                            <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm4.78 7.7-5.67 5.67a.75.75 0 0 1-1.06 0l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06Z" fill="currentColor"></path>
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                <div className="w-auto px-0 col">
                                                                    <p className="d-block fw-medium hp-p1-body hp-text-color-black-100 hp-text-color-dark-0 mb-4">
                                                                        <span className="hp-text-color-black-60">You swapped exactly</span>
                                                                        0.230000 ETH <span className="hp-text-color-black-60">for</span> 28,031.99
                                                                    </p>

                                                                    <span className="d-block hp-badge-text fw-medium hp-text-color-black-60 hp-text-color-dark-40">17h ago</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="me-2 hp-basket-dropdown-button w-auto px-0 position-relative">
                                                <button type="button" className="btn btn-icon-only bg-transparent border-0 hp-hover-bg-black-10 hp-hover-bg-dark-100 hp-transition d-flex align-items-center justify-content-center" style={{ height: "40px" }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" className="hp-text-color-black-80 hp-text-color-dark-30">
                                                        <path d="M8.4 6.5h7.2c3.4 0 3.74 1.59 3.97 3.53l.9 7.5C20.76 19.99 20 22 16.5 22H7.51C4 22 3.24 19.99 3.54 17.53l.9-7.5C4.66 8.09 5 6.5 8.4 6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        <path d="M8 8V4.5C8 3 9 2 10.5 2h3C15 2 16 3 16 4.5V8M20.41 17.03H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                    </svg>
                                                </button>

                                                <div className="hp-basket-dropdown">
                                                    <div className="row px-0 justify-content-between align-items-center">
                                                        <h5 className="mb-0 w-auto hp-text-color-dark-15">My Cart</h5>

                                                        <div className="w-auto px-0 me-8">
                                                            <span className="d-inline-block hp-caption fw-medium w-auto hp-text-color-black-80 hp-text-color-dark-30">1 Item</span>
                                                        </div>
                                                    </div>

                                                    <div className="divider mt-24 mb-4"></div>

                                                    <div className="hp-basket-dropdown-list">
                                                        <div className="hp-d-block hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-primary hp-hover-bg-dark-80 rounded py-8 px-10 hp-overflow-x-auto" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                            <div className="row flex-nowrap justify-content-between align-items-center">
                                                                <div className="col mt-4 pe-0" style={{ flex: "0 0 32px" }}>
                                                                    <a href="#">
                                                                        <div className="avatar-item d-flex align-items-center justify-content-center hp-bg-black-0 hp-bg-dark-100 rounded-circle" style={{ width: "35px", height: "35px" }}>
                                                                            <img src="/app-assets/img/product/watch-1.png" />
                                                                        </div>
                                                                    </a>
                                                                </div>

                                                                <div className="col ms-10 px-0" style={{ flex: "0 0 120px" }}>
                                                                    <a href="app-ecommerce-product-detail.html">
                                                                        <h5 className="mb-0 fw-medium hp-p1-body hp-text-color-black-100 hp-text-color-dark-15">Smart Watches 3</h5>
                                                                        <p className="mb-0 hp-caption hp-text-color-black-60" style={{ marginTop: "1px" }}>By <span className="hp-text-color-black-80">Sony</span></p>
                                                                    </a>
                                                                </div>

                                                                <div className="col hp-d-flex hp-d-flex-column ms-8 px-0" style={{ flex: "0 0 70px" }}>
                                                                    <div className="input-number input-number-sm" style={{ width: "65px" }}>
                                                                        <div className="input-number-handler-wrap">
                                                                            <span className="input-number-handler input-number-handler-up">
                                                                                <span className="input-number-handler-up-inner">
                                                                                    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                                                                                        <path d="M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z"></path>
                                                                                    </svg>
                                                                                </span>
                                                                            </span>

                                                                            <span className="input-number-handler input-number-handler-down input-number-handler-down-disabled">
                                                                                <span className="input-number-handler-down-inner">
                                                                                    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                                                                                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                                                                                    </svg>
                                                                                </span>
                                                                            </span>
                                                                        </div>

                                                                        <div className="input-number-input-wrap">
                                                                            <input className="input-number-input" type="number" min="1" max="10" defaultValue="1" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="hp-cursor-pointer mt-4 hp-input-description fw-medium text-black-60 text-decoration-underline">Remove Item</div>
                                                                </div>

                                                                <div className="col ps-0 text-end">
                                                                    <p className="hp-basket-dropdown-list-item-price hp-p1-body mb-0 hp-text-color-black-80 hp-text-color-dark-30 fw-medium">$59.00</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="divider mt-4 mb-12"></div>

                                                    <div className="row">
                                                        <div className="col-6 px-8">
                                                            <a href="app-ecommerce-checkout.html">
                                                                <button type="button" className="btn btn-text w-100 hp-bg-black-20 hp-text-color-black-100 hp-hover-text-color-primary-1 hp-hover-bg-primary-4">
                                                                    View Cart
                                                                </button>
                                                            </a>
                                                        </div>

                                                        <div className="col-6 px-8">
                                                            <a href="app-ecommerce-checkout-address.html">
                                                                <button type="button" className="btn btn-text hp-text-color-black-0 hp-bg-black-100 hp-hover-bg-primary-1 w-100">
                                                                    Checkout
                                                                </button>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="hover-dropdown-fade w-auto px-0 ms-6 position-relative">
                                                <div className="hp-cursor-pointer rounded-4 border hp-border-color-dark-80">
                                                    <div className="rounded-3 overflow-hidden m-4 d-flex">
                                                        {userData.img ?
                                                            <div className="avatar-item hp-bg-info-4 d-flex" style={{ width: "32px", height: "32px" }}>
                                                                <img src={userData.img} className="object-cover rounded-md w-10 h-10" />
                                                            </div> :
                                                            <div className="avatar-item d-flex align-items-center justify-content-center hp-bg-primary-4 hp-text-color-primary-1 rounded">
                                                                <i className="iconly-Curved-User"></i>
                                                            </div>}
                                                    </div>
                                                </div>

                                                <div className="hp-header-profile-menu dropdown-fade position-absolute pt-18" style={{ top: "100%", width: "260px" }}>
                                                    <div className="rounded hp-bg-black-0 hp-bg-dark-100 px-18 py-24">
                                                        <span className="d-block h5 hp-text-color-black-100 hp-text-color-dark-0 mb-16">Profile Settings</span>

                                                        <div className="divider mt-18 mb-16"></div>

                                                        <div className="row">
                                                            <div className="col-12">
                                                                <a href="app-contact.html" className="d-flex align-items-center fw-medium hp-p1-body my-4 py-8 px-10 hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-primary hp-hover-bg-dark-80 rounded" target="_self" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-8">
                                                                        <path d="M21.08 8.58v6.84c0 1.12-.6 2.16-1.57 2.73l-5.94 3.43c-.97.56-2.17.56-3.15 0l-5.94-3.43a3.15 3.15 0 0 1-1.57-2.73V8.58c0-1.12.6-2.16 1.57-2.73l5.94-3.43c.97-.56 2.17-.56 3.15 0l5.94 3.43c.97.57 1.57 1.6 1.57 2.73Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                        <path d="M12 11a2.33 2.33 0 1 0 0-4.66A2.33 2.33 0 0 0 12 11ZM16 16.66c0-1.8-1.79-3.26-4-3.26s-4 1.46-4 3.26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                    </svg>
                                                                    <span>Explore Creators</span>
                                                                </a>
                                                            </div>

                                                            <div className="col-12">
                                                                <a href="page-knowledge-base-1.html" className="d-flex align-items-center fw-medium hp-p1-body my-4 py-8 px-10 hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-primary hp-hover-bg-dark-80 rounded" target="_self" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-8">
                                                                        <path d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                        <path d="M15.695 13.7h.009M15.695 16.7h.009M11.995 13.7h.01M11.995 16.7h.01M8.294 13.7h.01M8.294 16.7h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                    </svg>
                                                                    <span>Help Desk</span>
                                                                </a>
                                                            </div>
                                                        </div>

                                                        <div className="divider my-12"></div>

                                                        <div className="row">
                                                            <div className="col-12">
                                                                <a href="page-pricing.html" className="d-flex align-items-center fw-medium hp-p1-body py-8 px-10 hp-transition hp-hover-bg-primary-4 hp-hover-bg-dark-primary hp-hover-bg-dark-80 rounded" target="_self" style={{ marginLeft: "-10px", marginRight: "-10px" }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="me-8">
                                                                        <path d="M10 22h4c5 0 7-2 7-7V9c0-5-2-7-7-7h-4C5 2 3 4 3 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                        <path d="M16.5 7.58v1c0 .82-.67 1.5-1.5 1.5H9c-.82 0-1.5-.67-1.5-1.5v-1c0-.82.67-1.5 1.5-1.5h6c.83 0 1.5.67 1.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                        <path d="M8.136 14h.012M11.995 14h.012M15.854 14h.012M8.136 17.5h.012M11.995 17.5h.012M15.854 17.5h.012" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                                                    </svg>
                                                                    <span>Pricing List</span>
                                                                </a>
                                                            </div>
                                                        </div>

                                                        <div className="divider mt-12 mb-18"></div>

                                                        <div className="row">
                                                            <div className="col-12">
                                                                <Link className="hp-p1-body fw-medium" href="/profile">Account Settings</Link>
                                                            </div>

                                                            <div className="col-12 mt-24">
                                                                <a className="hp-p1-body fw-medium cursor-pointer text-red-900" onClick={() => { logOut() }}>Logout</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="offcanvas offcanvas-start hp-mobile-sidebar bg-black-20 hp-bg-dark-90" tabIndex={-1} id="mobileMenu" aria-labelledby="mobileMenuLabel" style={{ width: "256px" }}>
                        <div className="offcanvas-header justify-content-between align-items-center ms-16 me-8 mt-16 p-0">
                            <div className="w-auto px-0">
                                <div className="hp-header-logo d-flex align-items-center">
                                    <div className="position-relative font-bold text-center">
                                        <img className="hp-logo" src="/img/logo.png" alt="logo" />

                                    </div>
                                </div>
                            </div>

                            <div id="menuClose" className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-hidden" data-bs-dismiss="offcanvas" aria-label="Close">
                                <button type="button" className="btn btn-text btn-icon-only bg-transparent">
                                    <i className="ri-close-fill lh-1 hp-text-color-black-80" style={{ fontSize: "24px" }}></i>
                                </button>
                            </div>
                        </div>

                        <div className="hp-sidebar hp-bg-color-black-20 hp-bg-color-dark-90 border-end border-black-40 hp-border-color-dark-80">
                            <div className="hp-sidebar-container">
                                <div className="hp-sidebar-header-menu">

                                    <div className="row justify-content-between align-items-center mx-0">
                                        <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-visible">
                                            <div className="hp-cursor-pointer">
                                                <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                                    <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="w-auto px-0">
                                            <div className="hp-header-logo d-flex align-items-center">
                                                <div className="position-relative font-bold text-center">
                                                    <img className="hp-logo hp-sidebar-visible hp-dark-none" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-visible hp-dark-block" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-none hp-dark-block  h-14" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-none  h-14" src="/img/logo.png" alt="logo" />
                                                    <img className="hp-logo hp-sidebar-hidden hp-dir-block hp-dark-block h-14" src="/img/logo.png" alt="logo" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-auto px-0 hp-sidebar-collapse-button hp-sidebar-hidden">
                                            <div className="hp-cursor-pointer mb-4">
                                                <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.91102 1.73796L0.868979 4.78L0 3.91102L3.91102 0L7.82204 3.91102L6.95306 4.78L3.91102 1.73796Z" fill="#B2BEC3"></path>
                                                    <path d="M3.91125 12.0433L6.95329 9.00125L7.82227 9.87023L3.91125 13.7812L0.000224113 9.87023L0.869203 9.00125L3.91125 12.0433Z" fill="#B2BEC3"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <ul>
                                        {Menu()}
                                    </ul>
                                </div>

                                <ReactSelect
                                    label={JSON.parse(localStorage.getItem('companyActive') as string)?.value ? "" : "Company Select..."}
                                    data={userData.company?.map((val: any) => { return { label: val.name, value: val.uuid } })}
                                    defaultValue={userData.company?.map((val: any) => { return { label: val.name, value: val.uuid } }).find((val: any) => val.value === JSON.parse(localStorage.getItem('companyActive') as string)?.value)}
                                    setSearchValue={(vall: any) => {
                                        localStorage.setItem('companyActive', JSON.stringify(userData.company?.map((val: any) => { return { label: val.name, value: val.uuid } }).find((val: any) => val.value === vall)));
                                        location.reload();
                                    }}

                                />
                                <div className="row justify-content-between align-items-center hp-sidebar-footer mx-0 hp-bg-color-dark-90">
                                    <div className="divider border-black-40 hp-border-color-dark-70 hp-sidebar-hidden mt-0 px-0"></div>

                                    <div className="col">
                                        <div className="row align-items-center">
                                            <div className="w-auto px-0">
                                                {userData.img ?
                                                    <div className="avatar-item bg-primary-4 d-flex align-items-center justify-content-center rounded-circle" style={{ width: "48px", height: "48px" }}>
                                                        <img src={userData.img} height="100%" className="hp-img-cover object-cover rounded-full w-12 h-12" />
                                                    </div>
                                                    :
                                                    <div className="avatar-item d-flex align-items-center justify-content-center avatar-lg hp-bg-primary-4 hp-text-color-primary-1 rounded-circle">
                                                        <i className="iconly-Curved-User"></i>
                                                    </div>}
                                            </div>

                                            <div className="w-auto ms-8 px-0 hp-sidebar-hidden mt-4">
                                                <span className="d-block hp-text-color-black-100 hp-text-color-dark-0 hp-p1-body lh-1">{userData.fullName ?? userData.username}</span>
                                                <Link onClick={() => {
                                                    ($('#menuClose') as any).trigger("click");
                                                }} href="/profile" className="hp-badge-text fw-normal hp-text-color-dark-30">View Profile</Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col hp-flex-none w-auto px-0 hp-sidebar-hidden">
                                        <Link onClick={() => {
                                            ($('#menuClose') as any).trigger("click");
                                        }} href="/profile">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="remix-icon hp-text-color-black-100 hp-text-color-dark-0" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                                    <path d="M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672c.579.59 1.093 1.261 1.525 2.01.433.749.757 1.53.978 2.326a3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.501 4.337 3 3 0 0 0-4.631 2.674 9.99 9.99 0 0 1-5.007-.002 3 3 0 0 0-4.632-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001A4.993 4.993 0 0 1 15 17.197a4.993 4.993 0 0 1 3.525-.565c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77c-.499-.047-1-.048-1.499-.001A4.993 4.993 0 0 1 9 6.803a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334a8.126 8.126 0 0 0 .75 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                                </g>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hp-main-layout-content">
                        {children}
                    </div>
                </div>
            </main >

            <div className="scroll-to-top">
                <button type="button" className="btn btn-primary btn-icon-only rounded-circle hp-primary-shadow">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"></path>
                        </g>
                    </svg>
                </button>
            </div>
        </>
    )

}