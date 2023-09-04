
import '../css/globals.css'

import React, { Component, useEffect, useState, Suspense } from "react"
import type { AppProps } from 'next/app'
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

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
import Skelaton from './components/skelaton';

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
                    if (res.data.status == 200) {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('client_id', res.data.client_id);
                        setuserData(res.data.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        } else if (url === 'user') {
            setloadingFull(true);
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

    return (
        <>
            <Toaster />
            <LoadingPage process={loadingFull} />
            {userData?.email ?
                <Layout logOut={logOut} userData={userData} >
                    <Suspense fallback={<Skelaton />}>
                        <Component userData={userData} setuserData={setuserData}  {...pageProps} />
                    </Suspense>
                </Layout> :
                <Login submitLogin={submitLogin} />}

        </>)

}