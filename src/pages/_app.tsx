import '../css/globals.css'

import React, { Component, useEffect, useState, Suspense } from "react"
import type { AppProps } from 'next/app'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useRouter } from 'next/router';
import Image from 'next/image';

if (typeof window !== "undefined") {
    (window as any).$ = require('jquery');
    (window as any).moment = require('moment');
    (window as any).ApexCharts = require('./../../public/app-assets/js/plugin/apexcharts.min.js');
    (window as any).bootstrap = require('./../../public/app-assets/js/plugin/bootstrap.bundle.min.js');
    (window as any).autocomplete = require("./../../public/app-assets/js/plugin/autocomplete.min.js");
}

import Layout from './components/layout'
import Login from "./auth/login"
import LoadingPage from './components/loadingPage';


export default function App({ Component, pageProps }: AppProps) {
    const [userData, setuserData] = useState<any>([]);
    const [loadingFull, setloadingFull] = useState<any>(true);

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('client_id');
        setuserData(undefined);
    }

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'login') {
            try {
                await axios({
                    method: "POST",
                    url: "/api/login",
                    data: data,
                }).then((res) => {
                    if (res.data.status === 404) {
                        toast.error(res.data.message)
                    }
                    if (res.data.status === 400) {
                        toast.error(res.data.message)
                    }
                    if (res.data.status == 200) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('client_id', res.data.client_id);
                        setuserData(res.data.data);
                    }
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (url === 'user') {
            setloadingFull(true);
            if (localStorage.getItem("client_id")) {
                try {
                    await axios({
                        method: "GET",
                        url: "/api/user/" + localStorage.getItem("client_id"),
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res) => {
                        setuserData(res.data.data);
                        setloadingFull(false);
                    });
                } catch (error: any) {
                    if (localStorage.getItem('token'))
                        toast.error(error.response.data.massage);
                    setloadingFull(false);
                }
            } else {
                setloadingFull(false);
            }
        }
    }

    const submitLogin = (event: any) => {
        event.preventDefault();
        let data = {
            email: event.target.email.value,
            password: event.target.password.value
        };

        handleApi('login', data);
    };

    useEffect(() => {
        handleApi('user');
    }, []);

    const router = useRouter();
    const ComponetPermission = router.asPath == '/profile' ? true : userData?.permission?.data?.find((find: any) => find.data.filter((fn: any) => fn.name.replaceAll('[]', '').toLocaleLowerCase() == (router.asPath == '/' ? 'analytics' : router.asPath.replaceAll('/', '').toLocaleLowerCase()))?.[0]?.checklist?.[0] == 'view') ? true : false;
    if (router.asPath == '/' && !ComponetPermission) {
        let acc = '';
        userData?.permission?.data?.map((find: any) => {
            find.data.find((fnd: any) => {
                if (fnd.checklist[0]) {
                    if (!acc)
                        acc = fnd.name.replaceAll('[]', '');
                }
            })
        })
        if (acc) {
            router.push(acc);
        }
    }

    return (
        <>
            <Toaster position="top-right" />
            <LoadingPage process={loadingFull} />
            {userData?.email ?
                <Layout logOut={logOut} userData={userData} >
                    {userData.permission ?
                        <>{ComponetPermission ?
                            <>
                                <Component userData={userData} setuserData={setuserData}  {...pageProps} />
                            </>
                            : <>
                                {router.route == '/_error' ?
                                    <div className='w-full text-center text-gray-700 mt-96'><div className='flex justify-center'><Image src="/img/404.gif" width={100} height={100} alt="404" /></div>Not Found Page</div> :
                                    <div className='w-full text-center text-gray-700'><div className='flex justify-center'><Image src="/img/notPermission.gif" width={250} height={250} alt="notPermission" /></div>You Need Permission</div>
                                }</>}
                        </>
                        : <div className='w-full text-center text-gray-700 fixed z-50 top-0 left-0 bg-gradient-to-r from-gray-100 from-20% h-screen to-cyan-200 to-100%'><div className='flex justify-center'><Image src="/img/notPermission.gif" width={250} height={250} alt="notPermission" /></div>You Need Permission</div>}
                </Layout> :
                <Login submitLogin={submitLogin} />}

        </>)

}