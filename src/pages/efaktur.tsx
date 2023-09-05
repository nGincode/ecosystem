/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { Component, useEffect, useState, useMemo } from "react"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Link from "next/link";

import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import moment from "moment"
import {
    Button, Badge, Input, Textarea,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";


import { read, utils, writeFile } from 'xlsx';

// import * as GC from '@grapecity/spread-sheets';
// import ExcelIO from "@grapecity/spread-excelio";
// import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
// import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';

import Select from "./components/reactSelect";
import ReactTable from "./components/reactTable";
import SelectFem from "./components/selectFem";
import DebouncedInput from "./components/debouncedInput"

export default function Efaktur({ userData, setuserData }: any) {
    const [dataCreate, setdataCreate] = useState();
    const [search, setsearch] = useState('');
    const [modalData, setmodalData] = useState([
        {
            name: 'detail',
            label: 'Detail Transaction',
            type: 'reactSelect',
            select: [
                { label: 'Kepada Pihak Yang Bukan Pemungut', value: '010' },
                { label: 'Kepada Pemungut Bendaharawan', value: '020' },
                { label: 'Kepada Pemungut Selain Bendaharawan', value: '030' },
                { label: 'DPP Nilai Lain', value: '040' },
                { label: 'Besaran Tertentu', value: '050' },
                { label: 'Penyerahan Lainnya', value: '060' },
                { label: 'Penyerahan Yang PPN-nya Tidak Dipungut', value: '070' },
                { label: 'Penyerahan Yang PPN-nya Dibebaskan', value: '080' },
            ],
            required: true
        },
        {
            name: 'jenis',
            label: 'Jenis Faktur',
            type: 'reactSelect',
            select: [
                { label: 'Faktur Pajak', value: '0' },
                { label: 'Faktur Pajak Pengganti', value: '1' },
            ],
            required: true
        },
        {
            label: 'Tanggal Dokument',
            name: 'date',
            type: 'date',
            required: true
        },
        {
            name: 'Nomor Seri Faktur Pajak',
            type: 'group',
            group: [
                { name: 'seri2', type: 'number' },
                { name: 'seri3', type: 'number' },
                { name: 'seri4', type: 'number' },
            ],
            required: true
        },
        {
            type: 'nik/npwp',
            required: true
        },
        {
            name: 'referensi',
            label: 'Referensi Faktur',
            type: 'textarea',
        },
        {
            full: true,
            type: 'efaktur',
            required: true
        }
    ]);
    const [npwp, setnpwp] = useState([]);
    const [tabIdentitas, settabIdentitas] = useState('');
    const [itemInputEfak, setitemInputEfak] = useState<any>([{ delete: false }]);
    const URLAPI = "/api/efaktur";
    const Subject = "E-Faktur";


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
                    setdataCreate(res.data.data);
                    toast.success(res.data.massage);
                    ($('.btn-close') as any).trigger("click");
                    (document.getElementById('formCreate') as HTMLFormElement).reset();
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (url === 'view_npwp') {
            try {
                await axios({
                    method: "GET",
                    url: '/api/npwp',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    let arr = res.data.data.map((val: any) => { return { label: val.npwp + ' (' + val.name + ')', value: val.npwp, data: val } })
                    setnpwp(arr)
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }

    const submitAdd = (event: any) => {
        event.preventDefault();
        let noIdentitas = '';
        let nameIdentitas = '';
        let addressIdentitas = '';

        if (tabIdentitas === 'NPWP') {
            noIdentitas = event.target.npwp.value;
            nameIdentitas = event.target.nameIdentitas_npwp.value;
            addressIdentitas = event.target.address_npwp.value;
        } else if (tabIdentitas === 'NIK') {
            noIdentitas = event.target.nik.value;
            nameIdentitas = event.target.nameIdentitas_nik.value;
            addressIdentitas = event.target.address_nik.value;
        } else {
            return toast.error('NPWP/NIK Harus Terisi')
        }


        if (!event.target.date.value) {
            return toast.error('Tanggal Faktur Harus Terisi')
        }


        let name = event.target['name[]'];
        if (name.length > 1) {
            let itemFaktur = [];
            for (let i = 0; i < name.length; i++) {
                itemFaktur.push({
                    name: event.target['name[]'][i].value ?? null,
                    kode: event.target['kode[]'][i].value ?? null,
                    harga: event.target['harga[]'][i].value ?? null,
                    qty: event.target['qty[]'][i].value ?? null,
                    diskon: event.target['diskon[]'][i].value ?? null,
                    dpp: event.target['dpp[]'][i].value ?? null,
                    ppn: event.target['ppn[]'][i].value ?? null,
                    ppnbm: event.target['ppnbm[]'][i].value ?? null,
                    tarif_ppnbm: event.target['tarif_ppnbm[]'][i].value ?? null,
                })

            }

            const data = {
                typeIdentitas: tabIdentitas,
                noIdentitas: noIdentitas,
                nameIdentitas: nameIdentitas,
                addressIdentitas: addressIdentitas,
                detail: event.target.detail_val.value,
                jenis: event.target.jenis_val.value,
                date: event.target.date.value,
                referensi: event.target.referensi.value,
                keterangan_tambahan: event.target.keterangan_tambahan_val?.value ?? null,
                noFaktur: event.target.detail_val.value + event.target.seri2.value + event.target.seri3.value + event.target.seri4.value,
                item: itemFaktur
            };

            handleApi('create', data);
        } else if (event.target['name[]'].value) {
            let itemFaktur = [{
                name: event.target['name[]'].value ?? null,
                kode: event.target['kode[]'].value ?? null,
                harga: event.target['harga[]'].value ?? null,
                qty: event.target['qty[]'].value ?? null,
                diskon: event.target['diskon[]'].value ?? null,
                dpp: event.target['dpp[]'].value ?? null,
                ppn: event.target['ppn[]'].value ?? null,
                ppnbm: event.target['ppnbm[]'].value ?? null,
                tarif_ppnbm: event.target['tarif_ppnbm[]'].value ?? null,
            }];
            const data = {
                noIdentitas: noIdentitas,
                nameIdentitas: nameIdentitas,
                addressIdentitas: addressIdentitas,
                detail: event.target.detail_val.value,
                jenis: event.target.jenis_val.value,
                date: event.target.date.value,
                referensi: event.target.referensi.value,
                keterangan_tambahan: event.target.keterangan_tambahan_val?.value ?? null,
                noFaktur: event.target.detail_val.value + event.target.seri2.value + event.target.seri3.value + event.target.seri4.value,
                item: itemFaktur
            };

            handleApi('create', data);
        } else {
            return toast.error('Item Faktur Required')
        }

    };

    const convertCamelCase = (text: any) => {
        if (text) {
            const result = text.replace(/([A-Z])/g, " $1");
            return result.charAt(0).toUpperCase() + result.slice(1);
        } else {
            return '';
        }
    }

    const ConvertToCSV = (objArray: any) => {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }


        const csvFile = str;
        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);

        var pom = document.createElement('a');
        pom.href = url;
        pom.setAttribute('download', 'e-faktur by Ecosystem.csv');
        pom.click();
    }

    useEffect(() => {
        handleApi('view_npwp')
    }, [])

    const RPtoNumber = (val: string) => {
        if (val) {
            let res = val.replaceAll(',', '').replaceAll('Rp', '').replaceAll('-', '');
            return Number(res)
        } else {
            return 0;
        }
    }

    const jenisFaktur = (val: any) => {
        if (val === 'Faktur Pajak') {
            return '0'
        } else if (val === 'Faktur Pajak Pengganti') {
            return '1'

        }
    }

    const jenisTransaksi = (val: any) => {
        if (val === 'Kepada Pihak Yang Bukan Pemungut') {
            return '01'
        } else if (val == 'Kepada Pemungut Bendaharawan') {
            return '02'
        } else if (val == 'Kepada Pemungut Selain Bendaharawan') {
            return '03'
        } else if (val == 'DPP Nilai Lain') {
            return '04'
        } else if (val == 'Besaran Tertentu (Pasal 9A ayat (1) UU PPN)') {
            return '05'
        } else if (val == 'Penyerahan Lainnya') {
            return '06'
        } else if (val == 'Penyerahan Yang PPN-nya Tidak Dipungut') {
            return '07'
        } else if (val == 'Penyerahan Yang PPN-nya Dibebaskan') {
            return '08'
        } else {
            return false;
        }
    }

    const IDKetTambahan07 = (val: any) => {
        let arr: any = [{
            label: 'Senjata, Amunisi, Helm Anti Peluru',
            value: '41'
        }]

        return arr.filter((vall: any) => vall.label === val)?.value ?? '';
    }

    const IDKetTambahan08 = (val: any) => {
        let arr: any = [{
            label: 'Senjata, Amunisi, Helm Anti Peluru',
            value: '41'
        }]
        return arr.find((vall: any) => vall.label == val)?.value ?? '';
    }

    const importFile = (val: any) => {
        const files = val.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], { raw: false });

                    const subject = [
                        ["FK", "KD_JENIS_TRANSAKSI", "FG_PENGGANTI", "NOMOR_FAKTUR", "MASA_PAJAK", "TAHUN_PAJAK", "TANGGAL_FAKTUR", "NPWP", "NAMA", "ALAMAT_LENGKAP", "JUMLAH_DPP", "JUMLAH_PPN", "JUMLAH_PPNBM", "ID_KETERANGAN_TAMBAHAN", "FG_UANG_MUKA", "UANG_MUKA_DPP", "UANG_MUKA_PPN", "UANG_MUKA_PPNBM", "REFERENSI", "KODE_DOKUMEN_PENDUKUNG"],
                        ["LT", "NPWP", "NAMA", "JALAN", "BLOK", "NOMOR", "RT", "RW", "KECAMATAN", "KELURAHAN", "KABUPATEN", "PROPINSI", "KODE_POS", "NOMOR_TELEPON"],
                        ["OF", "KODE_OBJEK", "NAMA", "HARGA_SATUAN", "JUMLAH_BARANG", "HARGA_TOTAL", "DISKON", "DPP", "PPN", "TARIF_PPNBM", "PPNBM"]
                    ];

                    let sampleArr = rows.map((val: any) => { return val.Tanggal + '_' + val['No Faktur'] }).filter((item, i, self) => {
                        return self.indexOf(item) === i;
                    });

                    let data: any = [];
                    let err;
                    sampleArr.map((val: any) => {
                        let sub: any = val.split('_');
                        let dtRes: any = rows.filter((vall: any, i: number) => vall.Tanggal == sub[0] && vall['No Faktur'] == sub[1]);

                        dtRes.map((valll: any, i: number) => {
                            if (!valll['Tanggal']) {
                                err = "Tanggal ada yang belum di isi";
                            }

                            if (!valll['No Faktur']) {
                                err = "No Faktur ada yang belum di isi";
                            }

                            if (!valll['NPWP/NIK']) {
                                err = "NPWP/NIK ada yang belum di isi";
                            }

                            let hargaSatuan = RPtoNumber(valll['Harga Satuan']);
                            let jumlahBarang = RPtoNumber(valll['Jumlah Barang']);
                            let hargaTotal = RPtoNumber(valll['Harga Total']);
                            let diskon = RPtoNumber(valll['Diskon']);
                            let dpp = RPtoNumber(valll['DPP']);
                            let ppn = RPtoNumber(valll['PPN']);
                            let tarif_ppnbm = RPtoNumber(valll['Tarif PPNBM']);
                            let ppnbm = RPtoNumber(valll['PPNBM']);
                            let jenis_transaksi = jenisTransaksi(valll['Jenis Transaksi']);
                            let jenis_faktur = jenisFaktur(valll['Jeni Faktur']);
                            let IDKet = '';
                            if (jenis_transaksi === '08') {
                                IDKet = IDKetTambahan08(valll['ID Keterangan Tambahan']);
                            } else if (jenis_transaksi === '07') {
                                IDKet = IDKetTambahan07(valll['ID Keterangan Tambahan']);
                            }

                            let NPWPDetec = '';
                            let NAMEDetec = '';
                            if (valll['NPWP/NIK'].length === 15) {
                                NPWPDetec = valll['NPWP/NIK'];
                                NAMEDetec = valll['Nama NPWP/NIK'];
                            } else {
                                NPWPDetec = '000000000000000';
                                NAMEDetec = `${valll['NPWP/NIK']}#NIK#NAMA#${valll['Nama NPWP/NIK']}`;
                            }

                            if (!i) {
                                let jumlahPPN = 0;
                                let jumlahPPNBM = 0;
                                let jumlahDPP = 0;
                                dtRes.map((vallll: any) => {
                                    jumlahDPP += Math.floor(RPtoNumber(vallll['DPP']));
                                    jumlahPPNBM += Math.floor(RPtoNumber(vallll['PPNBM']));
                                    jumlahPPN += Math.floor(RPtoNumber(vallll['PPN']));
                                });

                                data.push([
                                    "FK",
                                    jenis_transaksi,
                                    jenis_faktur,
                                    valll['No Faktur'],
                                    moment(valll['Tanggal'],
                                        'YYYY/MM/DD').format('MM'),
                                    moment(valll['Tanggal'], 'YYYY/MM/DD').format('YYYY'),
                                    moment(valll['Tanggal'], 'YYYY/MM/DD').format('DD/MM/YYYY'),
                                    NPWPDetec,
                                    NAMEDetec,
                                    valll['Alamat'],
                                    jumlahDPP,
                                    jumlahPPN,
                                    jumlahPPNBM,
                                    IDKet ?? '',
                                    valll['FG Uang Muka'] ?? 0,
                                    valll['Uang Muka DPP'] ?? 0,
                                    valll['Uang Muka PPN'] ?? 0,
                                    valll['Uang Muka PPNBM'] ?? 0,
                                    valll['Referensi'] ?? '',
                                    valll['Kode Dokumen Pendukung'] ?? ''
                                ]);
                                data.push([
                                    "OF",
                                    valll['Kode Barang'] ?? '',
                                    valll['Nama Barang'],
                                    hargaSatuan,
                                    jumlahBarang,
                                    hargaTotal,
                                    diskon,
                                    dpp,
                                    ppn,
                                    tarif_ppnbm,
                                    ppnbm
                                ])
                            } else {
                                data.push([
                                    "OF",
                                    valll['Kode Barang'] ?? '',
                                    valll['Nama Barang'],
                                    hargaSatuan,
                                    jumlahBarang,
                                    hargaTotal,
                                    diskon,
                                    dpp,
                                    ppn,
                                    tarif_ppnbm,
                                    ppnbm
                                ])
                            }
                        })

                    })

                    let arrayFinal = [...subject, ...data]
                    if (err) {
                        toast.error(err);
                    } else {
                        ConvertToCSV(arrayFinal)
                    }
                }
            }
            reader.readAsArrayBuffer(file);
            val.target.value = '';
        }

    };

    const keteranganTambhan07 = [
        { label: '07', value: '0' },
    ]

    const keteranganTambhan08 = [
        { label: 'Senjata, Amunisi, Helm Anti Peluru dan Jaket Atau Rompi Anti Peluru, Kendaraan Darat Khusus, Radar 7 Suku Cadang', value: '41' },]
    const tabData = [
        {
            label: "NPWP",
            value: "NPWP",
            desc:
                <>
                    <div className="mb-24">
                        <label htmlFor="npwp" className="text-xs font-bold">
                            NPWP
                        </label>
                        <Select
                            id='npwp'
                            name='npwp'
                            data={npwp}
                            search={true}
                            label="NPWP"
                            setSearchValue={(value: any) => {
                                let val = value.data;
                                (document.getElementById('nameIdentitas_npwp') as HTMLInputElement).value = val.name;
                                (document.getElementById('address_npwp') as HTMLInputElement).value = val.address;
                            }}
                        />
                    </div>
                    <div className="mb-24">
                        <Input readOnly={true} type="text" id="nameIdentitas_npwp" className="border-b-1" variant="standard" label="Name Identitas" name='name_npwp' />
                    </div>
                    <div className="mb-24">
                        <Input readOnly={true} type="text" id="address_npwp" className="border-b-1" variant="standard" label="Alamat" name='address_npwp' />
                    </div>
                </>,
        },
        {
            label: "NIK",
            value: "NIK",
            desc: <>
                <div className="mb-24 mt-2">
                    <Input type="number" id="noIdentitas_nik" className="border-b-1" variant="standard" label="No Identitas" name='nik' />
                </div>
                <div className="mb-24">
                    <Input type="text" id="nameIdentitas_nik" className="border-b-1" variant="standard" label="Nama Identitas" name='name_nik' />
                </div>
                <div className="mb-24">
                    <Input readOnly={true} type="text" id="address_nik" className="border-b-1" variant="standard" label="Alamat" name='address_nik' />
                </div>
            </>,
        },
    ];

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
                            <div className="align-items-center">
                                <DebouncedInput
                                    value={search ?? ''}
                                    onChange={value => setsearch(String(value))}
                                    placeholder="Search all columns..."
                                />
                            </div>
                        </div>

                        <div className="col hp-flex-none w-auto">
                            <Button type="button" className="w-100 px-5" variant="gradient" color="cyan" data-bs-toggle="modal" data-bs-target="#addNew"><i className="ri-add-line remix-icon"></i> Add {Subject}</Button>
                        </div>
                        <div className="modal fade -mt-1" id="addNew" tabIndex={-1} aria-labelledby="addNewLabel" role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
                            <div className="modal-dialog modal-xl modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header py-16 px-24">
                                        <h5 className="modal-title font-bold" id="addNewLabel">Add {Subject}</h5>
                                        <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                            <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                        </button>
                                    </div>

                                    <div className="divider m-0"></div>
                                    {npwp?.length ?
                                        <form onSubmit={submitAdd} id="formCreate">
                                            <div className="modal-body">
                                                <div className="row gx-8">
                                                    {modalData.length ? modalData?.map((val: any, i: number) => {
                                                        return <div id={val.name + '_div'} className={val.full ? "col-12 col-md-12" : "col-12 col-md-6"} key={i}>
                                                            {
                                                                val.type === 'email' || val.type === 'number' || val.type === 'date' || val.type === 'text' ?
                                                                    <div className="mb-24">
                                                                        <Input type={val.type} className="border-b-1" variant="standard" label={convertCamelCase(val.label ?? val.name)} name={val.name} id={val.id} />
                                                                    </div>
                                                                    : val.type === 'group' ?
                                                                        <div className="mb-24 -mt-4">
                                                                            <label htmlFor={val.id} className="text-xs">
                                                                                {convertCamelCase(val.label ?? val.name)}
                                                                            </label>
                                                                            <div className="input-group">
                                                                                {val.group.map((vall: any, ii: number) => {
                                                                                    return (<input key={ii} type={vall.type} defaultValue={vall.defaultValue} readOnly={vall.readOnly} placeholder={vall.placeholder} name={vall.name} className="form-control" />)
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                        : val.type === 'textarea' ?
                                                                            <div className="mb-24">
                                                                                <Textarea id={val.id} name={val.name} className="border-b-1 mt-2" variant="standard" label={convertCamelCase(val.label ?? val.name)}></Textarea>
                                                                            </div>
                                                                            : val.type === 'reactSelect' ?
                                                                                <div className={val.search ? "mb-5 -mt-3" : "mb-24 -mt-3"}>
                                                                                    {val.search &&
                                                                                        <label htmlFor={val.id} className="text-xs">
                                                                                            {convertCamelCase(val.label ?? val.name)}
                                                                                        </label>
                                                                                    }
                                                                                    <Select
                                                                                        id={val.id}
                                                                                        name={val.name}
                                                                                        data={val.select}
                                                                                        search={val.search}
                                                                                        label={convertCamelCase(val.label ?? val.name)}
                                                                                        setSearchValue={(vall: any) => {
                                                                                            if (val.name === 'detail') {
                                                                                                if (vall === '080' || vall === '070') {
                                                                                                    setmodalData([
                                                                                                        {
                                                                                                            name: 'detail',
                                                                                                            label: 'Detail Transaction',
                                                                                                            type: 'reactSelect',
                                                                                                            select: [
                                                                                                                { label: 'Kepada Pihak Yang Bukan Pemungut', value: '010' },
                                                                                                                { label: 'Kepada Pemungut Bendaharawan', value: '020' },
                                                                                                                { label: 'Kepada Pemungut Selain Bendaharawan', value: '030' },
                                                                                                                { label: 'DPP Nilai Lain', value: '040' },
                                                                                                                { label: 'Besaran Tertentu', value: '050' },
                                                                                                                { label: 'Penyerahan Lainnya', value: '060' },
                                                                                                                { label: 'Penyerahan Yang PPN-nya Tidak Dipungut', value: '070' },
                                                                                                                { label: 'Penyerahan Yang PPN-nya Dibebaskan', value: '080' },
                                                                                                            ],
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: 'keterangan_tambahan',
                                                                                                            label: 'Keterangan Tambahan',
                                                                                                            type: 'reactSelect',
                                                                                                            select: vall === '080' ? keteranganTambhan08 : keteranganTambhan07,
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: 'jenis',
                                                                                                            label: 'Jenis Faktur',
                                                                                                            type: 'reactSelect',
                                                                                                            select: [
                                                                                                                { label: 'Faktur Pajak', value: '0' },
                                                                                                                { label: 'Faktur Pajak Pengganti', value: '1' },
                                                                                                            ],
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            label: 'Tanggal Dokument',
                                                                                                            name: 'date',
                                                                                                            type: 'date',
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: 'Nomor Seri Faktur Pajak',
                                                                                                            type: 'group',
                                                                                                            group: [
                                                                                                                { name: 'seri2', type: 'number' },
                                                                                                                { name: 'seri3', type: 'number' },
                                                                                                                { name: 'seri4', type: 'number' },
                                                                                                            ],
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            type: 'nik/npwp',
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: 'referensi',
                                                                                                            label: 'Referensi Faktur',
                                                                                                            type: 'textarea',
                                                                                                        },
                                                                                                        {
                                                                                                            full: true,
                                                                                                            type: 'efaktur',
                                                                                                            required: true
                                                                                                        }
                                                                                                    ])
                                                                                                } else {
                                                                                                    setmodalData([
                                                                                                        {
                                                                                                            name: 'detail',
                                                                                                            label: 'Detail Transaction',
                                                                                                            type: 'reactSelect',
                                                                                                            select: [
                                                                                                                { label: 'Kepada Pihak Yang Bukan Pemungut', value: '010' },
                                                                                                                { label: 'Kepada Pemungut Bendaharawan', value: '020' },
                                                                                                                { label: 'Kepada Pemungut Selain Bendaharawan', value: '030' },
                                                                                                                { label: 'DPP Nilai Lain', value: '040' },
                                                                                                                { label: 'Besaran Tertentu', value: '050' },
                                                                                                                { label: 'Penyerahan Lainnya', value: '060' },
                                                                                                                { label: 'Penyerahan Yang PPN-nya Tidak Dipungut', value: '070' },
                                                                                                                { label: 'Penyerahan Yang PPN-nya Dibebaskan', value: '080' },
                                                                                                            ],
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: 'jenis',
                                                                                                            label: 'Jenis Faktur',
                                                                                                            type: 'reactSelect',
                                                                                                            select: [
                                                                                                                { label: 'Faktur Pajak', value: '0' },
                                                                                                                { label: 'Faktur Pajak Pengganti', value: '1' },
                                                                                                            ],
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            label: 'Tanggal Dokument',
                                                                                                            name: 'date',
                                                                                                            type: 'date',
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: 'Nomor Seri Faktur Pajak',
                                                                                                            type: 'group',
                                                                                                            group: [
                                                                                                                { name: 'seri2', type: 'number' },
                                                                                                                { name: 'seri3', type: 'number' },
                                                                                                                { name: 'seri4', type: 'number' },
                                                                                                            ],
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            type: 'nik/npwp',
                                                                                                            required: true
                                                                                                        },
                                                                                                        {
                                                                                                            name: 'referensi',
                                                                                                            label: 'Referensi Faktur',
                                                                                                            type: 'textarea',
                                                                                                        },
                                                                                                        {
                                                                                                            full: true,
                                                                                                            type: 'efaktur',
                                                                                                            required: true
                                                                                                        }
                                                                                                    ])
                                                                                                }
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                : val.type === 'efaktur' ?
                                                                                    <div className="w-full -mt-5">
                                                                                        {itemInputEfak.map((val: any, i: number) => {
                                                                                            const tarifPPN = 11;
                                                                                            if (!val.delete)
                                                                                                return (<div key={i} className="mb-3">
                                                                                                    <button type="button" className="absolute -mt-2 -ml-3" onClick={() => {
                                                                                                        let dtItem: any = itemInputEfak.map((vall: any, ii: number) => { if (ii === i) { vall.delete = true; } return vall; });
                                                                                                        setitemInputEfak(dtItem)
                                                                                                    }} >
                                                                                                        <div className="badge badge-danger px-2 py-1 bg-red-900 text-white border-none rounded-full" >x</div>
                                                                                                    </button>
                                                                                                    <div className="w-full text-right absolute">
                                                                                                        <div className="badge badge-danger px-2 py-1 bg-cyan-900 text-white border-none rounded-full mr-7" >PPN {tarifPPN}%</div>
                                                                                                    </div>
                                                                                                    <div className="border-1 border-gray-500 p-2 rounded-lg shadow-sm">
                                                                                                        <Input className="border-b-1" variant="standard" name='name[]' label="Nama" />
                                                                                                        <div className="xl:flex">
                                                                                                            <div className="mt-3 w-full">
                                                                                                                <Input className="border-b-1" variant="standard" name='kode[]' label="Kode Barang" /></div>
                                                                                                            <div className="mt-3 w-full"><Input name='harga[]' onChange={(el: any) => {
                                                                                                                let harga = Number(el.target.value);
                                                                                                                let qty: any = (document.getElementById(`qty_${i}`) as HTMLInputElement).value ?? 0;
                                                                                                                let diskon: any = (document.getElementById(`diskon_${i}`) as HTMLInputElement).value ?? 0;
                                                                                                                (document.getElementById(`dpp_${i}`) as HTMLInputElement).value = String((harga * qty) - diskon);
                                                                                                                (document.getElementById(`ppn_${i}`) as HTMLInputElement).value = String((((harga * qty) - diskon) * (tarifPPN / 100)).toFixed(2)).replace(',', '.');

                                                                                                            }} id={`harga_${i}`} className="border-b-1" type="number" variant="standard" label="Harga Satuan" /></div>
                                                                                                            <div className="mt-3 w-full"><Input step="any" name='qty[]' id={`qty_${i}`}
                                                                                                                onChange={(el: any) => {
                                                                                                                    let harga: any = (document.getElementById(`harga_${i}`) as HTMLInputElement).value ?? 0;
                                                                                                                    let qty = Number(el.target.value);
                                                                                                                    let diskon: any = (document.getElementById(`diskon_${i}`) as HTMLInputElement).value ?? 0;
                                                                                                                    (document.getElementById(`dpp_${i}`) as HTMLInputElement).value = String((harga * qty) - diskon);
                                                                                                                    (document.getElementById(`ppn_${i}`) as HTMLInputElement).value = String((((harga * qty) - diskon) * (tarifPPN / 100)).toFixed(2)).replace(',', '.');

                                                                                                                }} className="border-b-1" type="number" variant="standard" label="Qty" /></div>
                                                                                                            <div className="mt-3 w-full"><Input step="any" id={`diskon_${i}`} name='diskon[]'
                                                                                                                onChange={(el: any) => {
                                                                                                                    let harga: any = (document.getElementById(`harga_${i}`) as HTMLInputElement).value ?? 0;
                                                                                                                    let qty: any = (document.getElementById(`qty_${i}`) as HTMLInputElement).value ?? 0;
                                                                                                                    let diskon: any = Number(el.target.value);
                                                                                                                    (document.getElementById(`dpp_${i}`) as HTMLInputElement).value = String((harga * qty) - diskon);
                                                                                                                    (document.getElementById(`ppn_${i}`) as HTMLInputElement).value = String((((harga * qty) - diskon) * (tarifPPN / 100)).toFixed(2)).replace(',', '.');

                                                                                                                }}
                                                                                                                className="border-b-1" type="number" variant="standard" label="Diskon" /></div>
                                                                                                        </div>
                                                                                                        <div className="xl:flex">
                                                                                                            <div className="mt-3 w-full"><Input step="any" name='dpp[]' id={`dpp_${i}`} className="border-b-1" type="number" variant="standard" label="DPP" /></div>
                                                                                                            <div className="mt-3 w-full"><Input step="any" name='ppn[]' id={`ppn_${i}`} className="border-b-1" type="number" variant="standard" label="PPN" /></div>
                                                                                                            <div className="mt-3 w-full"><Input step="any" name='tarif_ppnbm[]' className="border-b-1" type="number" variant="standard" label="Tarif PPNBM" /></div>
                                                                                                            <div className="mt-3 w-full"><Input step="any" name='ppnbm[]' className="border-b-1" type="number" variant="standard" label="PPNBM" /></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>)
                                                                                        })}
                                                                                        <Button type="button" onClick={() => {
                                                                                            setitemInputEfak([...itemInputEfak, { delete: false }])
                                                                                        }} className="w-full mt-2 flex justify-center" color="green">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                                            </svg>
                                                                                        </Button>
                                                                                    </div>
                                                                                    : val.type === 'nik/npwp' ?
                                                                                        <Tabs value="noIdentitas">
                                                                                            <TabsHeader>
                                                                                                {tabData.map(({ label, value }) => (
                                                                                                    <Tab key={value} value={value} onClick={() => settabIdentitas(value)}>
                                                                                                        {label}
                                                                                                    </Tab>
                                                                                                ))}
                                                                                            </TabsHeader>
                                                                                            <TabsBody>
                                                                                                {tabData.map(({ value, desc }) => (
                                                                                                    <TabPanel key={value} value={value}>
                                                                                                        {desc}
                                                                                                    </TabPanel>
                                                                                                ))}
                                                                                            </TabsBody>
                                                                                        </Tabs>
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
                                        : <div className="m-5 text-center font-semibold">NPWP Tidak ditemukan</div>}
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
                                    delete: '/api/efaktur/'
                                }}
                                urlFatch={'/api/efaktur'}
                                modalData={modalData}
                                Subject={Subject}
                                reload={dataCreate}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3 shadow-md">
                        <div className="card-body px-0 text-center">
                            <label htmlFor="file">
                                <span className="dropdown-item text-center rounded-lg" aria-hidden="true">Convert fomat Excel to ETax Import
                                    <div className="flex justify-center mt-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="50px" width="50px" version="1.1" id="Layer_1" viewBox="0 0 512 512">
                                            <g>
                                                <g>
                                                    <path d="M499.677,426.489c4.427,0,8.017-3.589,8.017-8.017V84.977c0-2.1-0.863-4.184-2.348-5.668l-76.96-76.96    C426.899,0.863,424.817,0,422.716,0H106.323C92.473,0,81.204,11.268,81.204,25.119v9.086H12.261    c-6.987,0-10.616,8.738-5.668,13.685l62.741,62.741l-62.74,62.741c-4.947,4.947-1.32,13.685,5.668,13.685h68.944v299.825    c0,13.851,11.268,25.119,25.119,25.119h376.251c13.851,0,25.119-11.268,25.119-25.119v-34.205c0-4.427-3.589-8.017-8.017-8.017    s-8.017,3.589-8.017,8.017v34.205c0,5.01-4.076,9.086-9.086,9.086H106.324c-5.01,0-9.086-4.076-9.086-9.086V187.056h51.841    c4.427,0,8.017-3.589,8.017-8.017s-3.589-8.017-8.017-8.017H31.615l54.724-54.724c3.131-3.131,3.131-8.207,0-11.337L31.615,50.238    h348.88v120.785H183.285c-4.427,0-8.017,3.589-8.017,8.017s3.589,8.017,8.017,8.017h205.228c4.427,0,8.017-3.589,8.017-8.017    V42.221c0-4.427-3.589-8.017-8.017-8.017H97.239v-9.086c0-5.01,4.076-9.086,9.086-9.086H414.7v51.841    c0,13.851,11.268,25.119,25.119,25.119h51.841v325.478C491.66,422.9,495.25,426.489,499.677,426.489z M439.818,76.96    c-5.01,0-9.086-4.076-9.086-9.086V27.37l24.795,24.795l24.795,24.795H439.818z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M422.717,213.779H268.796c-4.427,0-8.017,3.589-8.017,8.017s3.589,8.017,8.017,8.017H414.7v26.722H174.199v-26.722h51.841    c4.427,0,8.017-3.589,8.017-8.017s-3.589-8.017-8.017-8.017h-59.858c-4.427,0-8.017,3.589-8.017,8.017v239.432    c0,4.427,3.589,8.017,8.017,8.017h171.023c4.427,0,8.017-3.589,8.017-8.017v-86.046h77.495c4.427,0,8.017-3.589,8.017-8.017    v-145.37C430.734,217.368,427.144,213.779,422.717,213.779z M243.677,453.211h-69.478v-26.722h69.478V453.211z M243.677,410.455    h-69.478v-35.273h69.478V410.455z M243.677,359.148h-69.478v-35.273h69.478V359.148z M243.677,307.841h-69.478v-35.273h69.478    V307.841z M329.189,453.211h-69.478v-26.722h69.478V453.211z M329.189,410.455h-69.478v-35.273h69.478V410.455z M329.189,359.148    h-69.478v-35.273h69.478V359.148z M329.189,307.841h-69.478v-35.273h69.478V307.841z M414.7,359.148h-69.478v-35.273H414.7    V359.148z M414.7,307.841h-69.478v-35.273H414.7V307.841z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M399.071,422.747l21.181-24.712c2.882-3.362,2.493-8.423-0.869-11.304c-3.363-2.882-8.423-2.493-11.304,0.869    l-19.567,22.828l-19.567-22.828c-2.882-3.362-7.943-3.752-11.304-0.869c-3.362,2.882-3.751,7.942-0.869,11.304l21.181,24.712    l-21.181,24.712c-2.616,3.052-2.53,7.725,0.21,10.67c3.216,3.459,8.891,3.348,11.964-0.236l19.567-22.828l19.567,22.828    c3.072,3.584,8.747,3.695,11.964,0.236c2.74-2.946,2.825-7.619,0.21-10.67L399.071,422.747z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M311.552,102.614h-17.637v-9.62h17.637c4.427,0,8.017-3.589,8.017-8.017s-3.589-8.017-8.017-8.017h-25.653    c-4.427,0-8.017,3.589-8.017,8.017v25.653c0,4.427,3.589,8.017,8.017,8.017h17.637v9.62h-17.637c-4.427,0-8.017,3.589-8.017,8.017    s3.589,8.017,8.017,8.017h25.653c4.427,0,8.017-3.589,8.017-8.017V110.63C319.569,106.203,315.979,102.614,311.552,102.614z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M260.245,128.267h-17.637v-43.29c0-4.427-3.589-8.017-8.017-8.017s-8.017,3.589-8.017,8.017v51.307    c0,4.427,3.589,8.017,8.017,8.017h25.653c4.427,0,8.017-3.589,8.017-8.017S264.672,128.267,260.245,128.267z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M197.996,110.63l17.101-20.522c2.835-3.401,2.375-8.456-1.026-11.291c-3.401-2.834-8.456-2.375-11.291,1.026    l-15.219,18.263l-15.219-18.263c-2.835-3.402-7.891-3.862-11.291-1.026c-3.401,2.835-3.861,7.89-1.026,11.291l17.101,20.522    l-17.101,20.522c-2.837,3.401-2.377,8.456,1.025,11.291c3.356,2.797,8.495,2.328,11.291-1.026l15.219-18.263l15.219,18.263    c3.023,3.628,8.697,3.815,11.96,0.402c2.78-2.907,2.931-7.578,0.358-10.667L197.996,110.63z" />
                                                </g>
                                            </g>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                                            <path d="M10 7L15 12L10 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="50px" width="50px" version="1.1" id="Layer_1" viewBox="0 0 512 512">
                                            <g>
                                                <g>
                                                    <path d="M499.677,426.489c4.428,0,8.017-3.589,8.017-8.017V84.977c0-2.1-0.862-4.183-2.347-5.668l-76.96-76.96    C426.899,0.863,424.818,0,422.716,0H106.324C92.473,0,81.205,11.268,81.205,25.119v9.086H12.261    c-6.987,0-10.615,8.738-5.669,13.685l62.741,62.741L6.592,173.371c-4.946,4.947-1.319,13.685,5.669,13.685h68.944v299.825    c0,13.851,11.268,25.119,25.119,25.119h376.251c13.851,0,25.119-11.268,25.119-25.119v-34.205c0-4.427-3.588-8.017-8.017-8.017    c-4.428,0-8.017,3.589-8.017,8.017v34.205c0,5.01-4.076,9.086-9.086,9.086H106.324c-5.01,0-9.086-4.076-9.086-9.086V187.056    h51.841c4.428,0,8.017-3.589,8.017-8.017s-3.588-8.017-8.017-8.017H31.615l54.724-54.724c3.131-3.131,3.131-8.207,0-11.337    L31.615,50.238h348.88v120.785H183.284c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h205.228    c4.428,0,8.017-3.589,8.017-8.017V42.221c0-4.427-3.588-8.017-8.017-8.017H97.238v-9.086c0-5.01,4.076-9.086,9.086-9.086H414.7    v51.841c0,13.851,11.268,25.119,25.119,25.119h51.841v325.478C491.66,422.9,495.248,426.489,499.677,426.489z M439.819,76.96    c-5.01,0-9.086-4.076-9.086-9.086V27.37l49.589,49.59H439.819z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M191.835,128.267h-17.637V92.994h17.637c4.428,0,8.017-3.589,8.017-8.017s-3.588-8.017-8.017-8.017h-25.653    c-4.428,0-8.017,3.589-8.017,8.017v51.307c0,4.427,3.588,8.017,8.017,8.017h25.653c4.428,0,8.017-3.589,8.017-8.017    S196.264,128.267,191.835,128.267z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M243.142,102.614h-17.637v-9.62h17.637c4.428,0,8.017-3.589,8.017-8.017s-3.588-8.017-8.017-8.017h-25.653    c-4.428,0-8.017,3.589-8.017,8.017v25.653c0,4.427,3.588,8.017,8.017,8.017h17.637v9.62h-17.637c-4.428,0-8.017,3.589-8.017,8.017    s3.588,8.017,8.017,8.017h25.653c4.428,0,8.017-3.589,8.017-8.017V110.63C251.159,106.203,247.571,102.614,243.142,102.614z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M305.536,77.372c-4.145-1.382-8.76,0.925-10.141,5.071l-9.497,28.49l-9.497-28.49c-1.401-4.201-5.939-6.472-10.141-5.071    c-4.201,1.4-6.47,5.94-5.07,10.141l17.102,51.307c1.09,3.273,4.154,5.481,7.605,5.481c3.451,0,6.515-2.208,7.605-5.481    l17.102-51.307C311.986,83.368,309.68,78.754,305.536,77.372z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M414.165,213.779H174.733c-9.136,0-16.568,7.432-16.568,16.568v222.33h0c0,9.136,7.432,16.568,16.568,16.568h239.432    c9.136,0,16.568-7.432,16.568-16.568v-222.33C430.733,221.211,423.301,213.779,414.165,213.779z M414.7,452.676    c0,0.295-0.24,0.534-0.534,0.534H174.733c-0.294,0-0.534-0.239-0.534-0.534v-222.33c0-0.295,0.24-0.534,0.534-0.534h239.432    c0.294,0,0.534,0.239,0.534,0.534V452.676z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M243.142,256.534h-34.205c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h34.205    c4.428,0,8.017-3.589,8.017-8.017S247.571,256.534,243.142,256.534z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M379.961,256.534H277.347c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h102.614    c4.428,0,8.017-3.589,8.017-8.017S384.389,256.534,379.961,256.534z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M243.142,307.841h-34.205c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h34.205    c4.428,0,8.017-3.589,8.017-8.017S247.571,307.841,243.142,307.841z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M379.961,307.841H277.347c-4.428,0-8.017,3.589-8.017,8.017s3.588,8.017,8.017,8.017h102.614    c4.428,0,8.017-3.589,8.017-8.017S384.389,307.841,379.961,307.841z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M243.142,359.148h-34.205c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017h34.205    c4.428,0,8.017-3.589,8.017-8.017C251.159,362.738,247.571,359.148,243.142,359.148z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M303,359.148h-25.653c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017H303    c4.428,0,8.017-3.589,8.017-8.017C311.017,362.738,307.429,359.148,303,359.148z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M243.142,410.455h-34.205c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017h34.205    c4.428,0,8.017-3.589,8.017-8.017C251.159,414.044,247.571,410.455,243.142,410.455z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M303,410.455h-25.653c-4.428,0-8.017,3.589-8.017,8.017c0,4.427,3.588,8.017,8.017,8.017H303    c4.428,0,8.017-3.589,8.017-8.017C311.017,414.044,307.429,410.455,303,410.455z" />
                                                </g>
                                            </g>
                                            <g>
                                                <g>
                                                    <path d="M369.018,392.818l17.101-20.522c2.834-3.401,2.374-8.456-1.026-11.291c-3.4-2.833-8.455-2.374-11.291,1.026    l-15.219,18.263l-15.219-18.263c-2.835-3.402-7.89-3.861-11.291-1.026c-3.401,2.835-3.86,7.89-1.026,11.291l17.101,20.522    l-17.101,20.522c-2.573,3.087-2.422,7.759,0.357,10.667c3.263,3.413,8.937,3.225,11.96-0.402l15.219-18.263l15.219,18.263    c3.023,3.628,8.697,3.815,11.96,0.402c2.78-2.907,2.93-7.578,0.357-10.667L369.018,392.818z" />
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </span>
                                <input type="file" id="file" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: "none" }} onChange={(val: any) => importFile(val)} />
                            </label>
                            <div className="text-center mt-2">
                                <Link href="/Format Import.xlsx">
                                    Download Format
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}