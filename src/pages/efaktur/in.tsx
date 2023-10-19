import React, { Component, useEffect, useState, useMemo } from "react"
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
import * as PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;
import Swal from "sweetalert2";
import Image from "next/image";

// import * as GC from '@grapecity/spread-sheets';
// import ExcelIO from "@grapecity/spread-excelio";
// import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
// import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';

import Select from "../../components/reactSelect";
import ReactTable from "../../components/reactTable";
import SelectFem from "../../components/selectFem";
import DebouncedInput from "../../components/debouncedInput";


export default function EfakturIn({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
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
    const URLAPI = "/api/efaktur/out";
    const Subject = "E-Faktur Out";

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create') {
            data.company_id = JSON.parse(localStorage.getItem('companyActive') as string)?.value;
            try {
                await axios({
                    method: "POST",
                    url: URLAPI,
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataCreate(res.data.status);
                    toast.success(res.data.massage);
                    ($('.btn-close') as any).trigger("click");
                    (document.getElementById('formCreate') as HTMLFormElement).reset();

                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (url === 'view_npwp') {
            let companyActive = JSON.parse(localStorage.getItem('companyActive') as string)?.value;
            if (userData.company.length && companyActive) {
                try {
                    await axios({
                        method: "GET",
                        url: '/api/npwp?company_id=' + companyActive,
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
        } else if (url === 'proof') {
            try {
                await axios({
                    method: "POST",
                    url: '/api/efaktur/out/proof',
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (res.data?.success.length) {
                        toast.success(res.data.success.map((val: any) => `No Faktur : ${val.Efaktur} Berhasil\n`), {
                            duration: 6000,
                        });
                        setdataCreate(res.data.success)
                    }
                    if (res.data?.error.length) {
                        toast.error(res.data.error.map((val: any) => `No Faktur : ${val.Efaktur} Tidak ditemukan\n`), {
                            duration: 6000,
                        });
                    }

                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (url === 'export') {
            try {
                await axios({
                    method: "POST",
                    url: '/api/efaktur/out/export',
                    data: { company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    ConvertToCSV(res.data);
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

        if (!event.target.detail_val.value) {
            return toast.error('Detail Transaksi Harus Terisi')
        }
        if (event.target.detail_val.value === '080') {
            if (!event.target.keterangan_tambahan_val.value) {
                return toast.error('Keterangan Tambahan Harus Terisi')
            }
        }
        if (event.target.detail_val.value === '070') {
            if (!event.target.keterangan_tambahan_val.value) {
                return toast.error('Keterangan Tambahan Harus Terisi')
            }
        }
        if (!event.target.jenis_val.value) {
            return toast.error('Jenis Faktur Harus Terisi')
        }
        if (!event.target.date.value) {
            return toast.error('Tanggal Faktur Harus Terisi')
        }

        if (!event.target.seri2.value || !event.target.seri3.value || !event.target.seri4.value) {
            return toast.error('Nomor Faktur Harus Lengkap')
        }


        if (tabIdentitas === 'NPWP') {
            if (!event.target.npwp.value) {
                return toast.error('NPWP Harus Terisi')
            }
            if (!event.target.nameIdentitas_npwp.value) {
                return toast.error('Nama Indetitas Harus Terisi')
            }
            if (!event.target.address_npwp.value) {
                return toast.error('Alamat Harus Terisi')
            }
            noIdentitas = event.target.npwp.value;
            nameIdentitas = event.target.nameIdentitas_npwp.value;
            addressIdentitas = event.target.address_npwp.value;
        } else if (tabIdentitas === 'NIK') {
            if (!event.target.nik.value) {
                return toast.error('NIK Harus Terisi')
            }
            if (!event.target.nameIdentitas_nik.value) {
                return toast.error('Nama Indetitas Harus Terisi')
            }
            if (!event.target.address_nik.value) {
                return toast.error('Alamat Harus Terisi')
            }
            noIdentitas = event.target.nik.value;
            nameIdentitas = event.target.nameIdentitas_nik.value;
            addressIdentitas = event.target.address_nik.value;
        } else {
            return toast.error('NPWP/NIK Belum dipilih')
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
                company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value,
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
                company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value,
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
            return toast.error('Item Faktur Harus Terisi')
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

        pom.setAttribute('download', ((JSON.parse(localStorage.getItem('companyActive') as string)?.label) ?? 'By') + '_EcosystemApp.csv');
        pom.click();
    }

    useEffect(() => {
        const handleApiFirst = async (url: any, data: any = null) => {
            if (url === 'view_npwp') {
                let companyActive = JSON.parse(localStorage.getItem('companyActive') as string)?.value;
                if (userData.company.length && companyActive) {
                    try {
                        await axios({
                            method: "GET",
                            url: '/api/npwp?company_id=' + companyActive,
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
        }
        handleApiFirst('view_npwp');
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
    }, [userData])

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

    const importFile = (val: any, convert: any) => {
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
                    let err: any = [];
                    sampleArr.map((val: any, ii: number) => {
                        let sub: any = val.split('_');


                        let dtRes: any = rows.filter((vall: any, i: number) => {

                            if (!vall['No Faktur']) {
                                err.push("(Baris: " + (i + 2) + ") " + "No Faktur Kosong");
                            }

                            if (!vall["Tanggal"]) {
                                err.push("(Baris: " + (i + 2) + ") " + "Tanggal Faktur Kosong");
                            }

                            return vall["Tanggal"] == sub[0] && vall['No Faktur'] == sub[1];
                        });

                        if (dtRes.length)
                            dtRes.map((valll: any, i: number) => {

                                if (valll['Tanggal']) {
                                    if (!valll['Tanggal']) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Tanggal Kosong");
                                    }
                                } else {
                                    err.push("Judul Tanggal Tidak Ada");
                                }

                                if (valll['No Faktur']) {
                                    if (!valll['No Faktur']) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "No Faktur Kosong");
                                    }
                                } else {
                                    err.push("Judul No Faktur Tidak Ada");
                                }

                                if (valll['NPWP/NIK']) {
                                    if (!valll['NPWP/NIK']) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "NPWP Kosong");
                                    }
                                } else {
                                    err.push("Judul NPWP/NIK Tidak Ada");
                                }

                                if (valll['Nama Barang']) {
                                    if (valll['Nama Barang'].indexOf(',') >= 0) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Nama Barang Terdapat Koma");
                                    }
                                    if (valll['Nama Barang'].indexOf('"') >= 0) {
                                        // err.push("(Baris: " + (ii + 2) + ") " + "Nama Barang Terdapat Kutip");
                                    }
                                } else {
                                    err.push("Judul Nama Barang Tidak Ada");
                                }

                                if (valll['Alamat']) {
                                    if (valll['Alamat'].indexOf(',') >= 0) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Alamat Terdapat Koma");
                                    }
                                    if (valll['Alamat'].indexOf('"') >= 0) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Alamat Terdapat Kutip");
                                    }
                                } else {
                                    err.push("Judul Alamat Tidak Ada");
                                }

                                if (valll['Nama NPWP/NIK']) {
                                    if (valll['Nama NPWP/NIK'].indexOf(',') >= 0) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Nama NPWP Terdapat Koma");
                                    }

                                    if (valll['Nama NPWP/NIK'].indexOf('"') >= 0) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Nama NPWP Terdapat Kutip");
                                    }
                                } else {
                                    err.push("Judul Nama NPWP/NIK Tidak Ada");
                                }

                                if (valll['Jenis Faktur']) {
                                    if (!valll['Jenis Faktur']) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Janis Faktur Kosong");
                                    }
                                } else {
                                    err.push("Judul Jenis Faktur Tidak Ada");
                                }

                                if (valll['Jenis Transaksi']) {
                                    if (!valll['Jenis Transaksi']) {
                                        err.push("(Baris: " + (ii + 2) + ") " + "Jenis Transaksi Kosong");
                                    }
                                } else {
                                    err.push("Judul Jenis Transaksi Tidak Ada");
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
                                let jenis_faktur = jenisFaktur(valll['Jenis Faktur']);
                                let IDKet = '';
                                if (jenis_transaksi === '08') {
                                    IDKet = IDKetTambahan08(valll['ID Keterangan Tambahan']);
                                } else if (jenis_transaksi === '07') {
                                    IDKet = IDKetTambahan07(valll['ID Keterangan Tambahan']);
                                }

                                let NPWPDetec = '';
                                let NAMEDetec = '';
                                if (valll['NPWP/NIK']?.length === 15) {
                                    NPWPDetec = valll['NPWP/NIK'];
                                    NAMEDetec = valll['Nama NPWP/NIK'];
                                } else if (valll['NPWP/NIK']?.length === 16) {
                                    NPWPDetec = '000000000000000';
                                    NAMEDetec = `${valll['NPWP/NIK']}#NIK#NAMA#${valll['Nama NPWP/NIK']}`;
                                } else {
                                    err.push("(Baris: " + (ii + 2) + ") " + "NPWP Tidak Valid");
                                }

                                if (!i) {
                                    let jumlahPPN = 0;
                                    let jumlahPPNBM = 0;
                                    let jumlahDPP = 0;
                                    dtRes.map((vallll: any) => {
                                        jumlahDPP += RPtoNumber(vallll['DPP']);
                                        jumlahPPNBM += RPtoNumber(vallll['PPNBM']);
                                        jumlahPPN += RPtoNumber(vallll['PPN']);
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
                                        Math.round(jumlahDPP),
                                        Math.round(jumlahPPN),
                                        Math.round(jumlahPPNBM),
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

                    let arrayFinal = [...subject, ...data];
                    if (err.length) {
                        toast.error(err.filter((value: any, index: any, array: any) => array.indexOf(value) === index).map((val: any) => {
                            return val + '\n'
                        }, {
                            duration: 6000,
                        }));

                    } else {
                        if (convert) {
                            ConvertToCSV(arrayFinal);
                        } else {
                            Swal.fire({
                                icon: "info",
                                title: "Import data !!!",
                                text: `Are you sure want to import data to ${JSON.parse(localStorage.getItem('companyActive') as string)?.label ?? ""} ?`,
                                showCancelButton: true,
                                cancelButtonColor: "#686868",
                                confirmButtonText: "Import",
                            }).then((result: any) => {
                                if (result.isConfirmed) {
                                    handleApi('create', { excel: arrayFinal });
                                }
                            });
                        }
                    }
                }
            }
            reader.readAsArrayBuffer(file);
            val.target.value = '';
        }

    };

    const keteranganTambhan07 = [
        { label: '07', value: '0' },
    ];

    const keteranganTambhan08 = [
        { label: 'Senjata, Amunisi, Helm Anti Peluru dan Jaket Atau Rompi Anti Peluru, Kendaraan Darat Khusus, Radar 7 Suku Cadang', value: '41' }
    ];

    const tabData = [
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
                    <Input type="text" id="address_nik" className="border-b-1" variant="standard" label="Alamat" name='address_nik' />
                </div>
            </>,
        },
    ];

    if (npwp?.length) {
        tabData.push(
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
            })
    };

    const arrayUnique = (inputArr: any) => {
        let key: any = ''
        let tmpArr2: any = [];
        let val: any = ''
        const _arraySearch = (needle: any, haystack: any) => {
            let fkey = ''
            for (fkey in haystack) {
                if (haystack.hasOwnProperty(fkey)) {
                    if ((haystack[fkey] + '') === (needle + '')) {
                        return fkey
                    }
                }
            }
            return false
        }
        for (key in inputArr) {
            if (inputArr.hasOwnProperty(key)) {
                val = inputArr[key]
                if (_arraySearch(val, tmpArr2) === false) {
                    tmpArr2.push(val);
                }
            }
        }
        return tmpArr2;
        // return Array.from(new Set(arr));
    }

    const convertFileToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    }

    const pdfRead = async (val: any) => {
        const files = val.target.files;
        if (files.length) {
            let data: any = [];
            let err: any = []
            for (let index = 0; index < files.length; index++) {
                if ('application/pdf' === files[0].type) {
                    const pdf = await PDFJS.getDocument(URL.createObjectURL(files[index])).promise;

                    const pageList = await Promise.all(Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1)));

                    const textList = await Promise.all(pageList.map((p) => p.getTextContent()));

                    const array = textList?.[0]?.items;
                    if (array.length === 52) {
                        let nama: any = array?.[10];
                        let noFak: any = array?.[9];
                        let ttd: any = array?.[43];

                        const file = await convertFileToBase64(files[index]);

                        if (nama ? 1 : 0 & noFak ? 1 : 0 & ttd ? 1 : 0) {
                            if (String(nama['str']) !== String(ttd['str'])) {
                                data.push({ files: file, nama: String(nama['str']).replaceAll('Nama : ', ''), noFaktur: String(noFak['str']).replaceAll('Kode dan Nomor Seri Faktur Pajak : ', '').replaceAll('.', '').replaceAll('-', ''), ttd: String(ttd['str']) });
                            } else {
                                err.push(`File ${files.length > 1 ? index + 1 : ''} Nama TTD Harus Directur `);
                            }
                        } else {
                            err.push(`File ${files.length > 1 ? index + 1 : ''} Tidak Terdeteksi Nama dan No Faktur`);
                        }
                    } else {
                        err.push(`File ${files.length > 1 ? index + 1 : ''} Format PDF Salah`);
                    }
                } else {
                    err.push(`File ${files.length > 1 ? index + 1 : ''} Format bukan .pdf`);
                }

            }
            if (err.length) {
                toast.error(err.map((val: any) => `${val}\n`), {
                    duration: 5500,
                });
            }

            if (data.length) {
                await handleApi('proof', arrayUnique(data));
            }

        } else {
            toast.error(`File tidak terdeteksi`);
        }

        val.target.value = '';
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

                {JSON.parse(localStorage.getItem('companyActive') as string)?.value && userData.company.length ? <>
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

                            {pagePermission.find((val: any) => val == "create") ?
                                <div className="col hp-flex-none w-auto">
                                    <Button type="button" className="w-100 px-5" variant="gradient" color="cyan" data-bs-toggle="modal" data-bs-target="#addNew"><i className="ri-add-line remix-icon"></i> Add {Subject}</Button>
                                </div> : null}
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-15 -mt-3  shadow-md border-gray-300">
                            <div className="card-body px-0">
                                <ReactTable
                                    search={search}
                                    action={{
                                        delete: pagePermission.find((val: any) => val == "delete") ? URLAPI : null,
                                        edit: pagePermission.find((val: any) => val == "edit") ? null : null
                                    }}
                                    urlFatch={URLAPI}
                                    modalData={modalData}
                                    Subject={Subject}
                                    reload={dataCreate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-15 -mt-3 shadow-md">
                            <div className="card-body px-0 text-center flex justify-center flex-wrap">
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-15 -mt-3 shadow-md">
                            <div className="card-body px-0 text-center flex justify-center flex-wrap">
                                <div className="text-center w-full text-gray-500">
                                    <div className="flex justify-center -mt-10 -mb-7 ">
                                        <Image src="/img/noResult.gif" width={200} height={200} alt="noResult" /> </div>
                                    <div className="text-lg">{!userData.company.length ? "Requires company data" : !JSON.parse(localStorage.getItem('companyActive') as string)?.value ? "Please select company" : null}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-15 -mt-3 shadow-md">
                            <div className="card-body px-0 text-center flex justify-center flex-wrap">
                                <div className="mb-5">
                                    <label htmlFor="fileConvert">
                                        <span className="dropdown-item text-center rounded-lg  cursor-pointer" aria-hidden="true">Convert Format to ETax
                                            <div className="flex justify-center mt-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" viewBox="0 0 303.188 303.188" className="w-12 h-12">
                                                    <g>
                                                        <polygon style={{ fill: "#E8E8E8" }} points="219.821,0 32.842,0 32.842,303.188 270.346,303.188 270.346,50.525  " />
                                                        <g>
                                                            <rect x="90.902" y="61.704" style={{ fill: "007934" }} width="119.89" height="119.89" />
                                                            <rect x="101.303" y="72.105" style={{ fill: "#FFFFFF" }} width="99.088" height="99.088" />
                                                            <polygon style={{ fill: "#007934" }} points="192.62,137.423 162.041,137.423 171.073,148.703 162.041,159.982 192.62,159.982     183.588,148.703   " />
                                                            <polygon style={{ fill: "#007934" }} points="183.875,97.886 154.609,97.886 148.122,105.987 141.635,97.886 112.369,97.886     133.489,124.262 112.369,150.638 183.875,150.638 162.755,124.262   " />
                                                            <polygon style={{ fill: "#FFFFFF" }} points="124.911,101.616 120.676,101.616 156.944,146.908 161.178,146.908   " />
                                                        </g>
                                                        <polygon style={{ fill: "#007934" }} points="227.64,25.263 32.842,25.263 32.842,0 219.821,0  " />
                                                        <g>
                                                            <path style={{ fill: "#A4A9AD" }} d="M135.998,273.871H121l-9.353-14.997l-9.254,14.997h-14.67l15.917-24.547l-14.965-23.432h14.374    l8.664,14.834l8.336-14.834h14.801l-15.194,24.449L135.998,273.871z" />
                                                            <path style={{ fill: "#A4A9AD" }} d="M141.38,273.871v-47.979h12.963v37.511h18.477v10.469h-31.44V273.871z" />
                                                            <path style={{ fill: "#A4A9AD" }} d="M211.872,259.3c0,2.976-0.755,5.617-2.265,7.925c-1.509,2.309-3.687,4.102-6.53,5.382    c-2.845,1.28-6.181,1.92-10.01,1.92c-3.194,0-5.874-0.225-8.04-0.673s-4.42-1.23-6.761-2.346v-11.552    c2.473,1.269,5.043,2.259,7.713,2.97c2.669,0.711,5.119,1.067,7.351,1.067c1.925,0,3.336-0.333,4.233-1.001    c0.897-0.667,1.346-1.526,1.346-2.576c0-0.656-0.181-1.231-0.541-1.723c-0.361-0.492-0.941-0.99-1.739-1.493    c-0.8-0.503-2.927-1.531-6.384-3.085c-3.129-1.422-5.475-2.8-7.039-4.135c-1.564-1.334-2.724-2.866-3.479-4.595    c-0.755-1.728-1.132-3.774-1.132-6.137c0-4.419,1.607-7.865,4.823-10.337c3.217-2.472,7.636-3.708,13.259-3.708    c4.966,0,10.031,1.148,15.194,3.446l-3.971,10.009c-4.485-2.056-8.357-3.085-11.617-3.085c-1.686,0-2.91,0.295-3.676,0.886    c-0.767,0.591-1.148,1.324-1.148,2.199c0,0.941,0.486,1.784,1.46,2.527c0.974,0.744,3.615,2.101,7.926,4.07    c4.135,1.859,7.007,3.856,8.614,5.989C211.068,253.376,211.872,256.063,211.872,259.3z" />
                                                        </g>
                                                        <polygon style={{ fill: "#D1D3D3" }} points="219.821,50.525 270.346,50.525 219.821,0  " />
                                                    </g>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                                                    <path d="M10 7L15 12L10 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" viewBox="0 0 303.188 303.188" className="w-12 h-12">
                                                    <g>
                                                        <polygon style={{ fill: "#E4E4E4" }} points="219.821,0 32.842,0 32.842,303.188 270.346,303.188 270.346,50.525  " />
                                                        <polygon style={{ fill: "#007934" }} points="227.64,25.263 32.842,25.263 32.842,0 219.821,0  " />
                                                        <g>
                                                            <g>
                                                                <path style={{ fill: "#A4A9AD" }} d="M114.872,227.984c-2.982,0-5.311,1.223-6.982,3.666c-1.671,2.444-2.507,5.814-2.507,10.109     c0,8.929,3.396,13.393,10.188,13.393c2.052,0,4.041-0.285,5.967-0.856c1.925-0.571,3.86-1.259,5.808-2.063v10.601     c-3.872,1.713-8.252,2.57-13.14,2.57c-7.004,0-12.373-2.031-16.107-6.094c-3.734-4.062-5.602-9.934-5.602-17.615     c0-4.803,0.904-9.023,2.714-12.663c1.809-3.64,4.411-6.438,7.808-8.395c3.396-1.957,7.39-2.937,11.98-2.937     c5.016,0,9.808,1.09,14.378,3.27l-3.841,9.871c-1.713-0.805-3.428-1.481-5.141-2.031     C118.681,228.26,116.841,227.984,114.872,227.984z" />
                                                                <path style={{ fill: "#A4A9AD" }} d="M166.732,250.678c0,2.878-0.729,5.433-2.191,7.665c-1.459,2.232-3.565,3.967-6.315,5.205     c-2.751,1.237-5.977,1.856-9.681,1.856c-3.089,0-5.681-0.217-7.775-0.65c-2.095-0.434-4.274-1.191-6.538-2.27v-11.172     c2.391,1.227,4.877,2.186,7.458,2.872c2.582,0.689,4.951,1.032,7.109,1.032c1.862,0,3.227-0.322,4.095-0.969     c0.867-0.645,1.302-1.476,1.302-2.491c0-0.635-0.175-1.19-0.524-1.666c-0.349-0.477-0.91-0.958-1.682-1.444     c-0.772-0.486-2.83-1.48-6.173-2.983c-3.026-1.375-5.296-2.708-6.809-3.999s-2.634-2.771-3.364-4.443s-1.095-3.65-1.095-5.936     c0-4.273,1.555-7.605,4.666-9.997c3.109-2.391,7.384-3.587,12.822-3.587c4.803,0,9.7,1.111,14.694,3.333l-3.841,9.681     c-4.337-1.989-8.082-2.984-11.234-2.984c-1.63,0-2.814,0.286-3.555,0.857s-1.111,1.28-1.111,2.127     c0,0.91,0.471,1.725,1.412,2.443c0.941,0.72,3.496,2.031,7.665,3.936c3.999,1.799,6.776,3.729,8.331,5.792     C165.955,244.949,166.732,247.547,166.732,250.678z" />
                                                                <path style={{ fill: "#A4A9AD" }} d="M199.964,218.368h14.027l-15.202,46.401H184.03l-15.139-46.401h14.092l6.316,23.519     c1.312,5.227,2.031,8.865,2.158,10.918c0.148-1.481,0.443-3.333,0.889-5.555c0.443-2.222,0.835-3.967,1.174-5.236     L199.964,218.368z" />
                                                            </g>
                                                        </g>
                                                        <polygon style={{ fill: "#D1D3D3" }} points="219.821,50.525 270.346,50.525 219.821,0  " />
                                                        <g>
                                                            <rect x="134.957" y="80.344" style={{ fill: "#007934" }} width="33.274" height="15.418" />
                                                            <rect x="175.602" y="80.344" style={{ fill: "#007934" }} width="33.273" height="15.418" />
                                                            <rect x="134.957" y="102.661" style={{ fill: "#007934" }} width="33.274" height="15.419" />
                                                            <rect x="175.602" y="102.661" style={{ fill: "#007934" }} width="33.273" height="15.419" />
                                                            <rect x="134.957" y="124.979" style={{ fill: "#007934" }} width="33.274" height="15.418" />
                                                            <rect x="175.602" y="124.979" style={{ fill: "#007934" }} width="33.273" height="15.418" />
                                                            <rect x="94.312" y="124.979" style={{ fill: "#007934" }} width="33.273" height="15.418" />
                                                            <rect x="134.957" y="147.298" style={{ fill: "#007934" }} width="33.274" height="15.418" />
                                                            <rect x="175.602" y="147.298" style={{ fill: "#007934" }} width="33.273" height="15.418" />
                                                            <rect x="94.312" y="147.298" style={{ fill: "#007934" }} width="33.273" height="15.418" />
                                                            <g>
                                                                <path style={{ fill: "#007934" }} d="M127.088,116.162h-10.04l-6.262-10.041l-6.196,10.041h-9.821l10.656-16.435L95.406,84.04h9.624     l5.8,9.932l5.581-9.932h9.909l-10.173,16.369L127.088,116.162z" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                        </span>
                                        <input type="file" id="fileConvert" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: "none" }} onChange={(val: any) => importFile(val, true)} />
                                    </label>
                                    <div className="text-center mt-1">
                                        <Link href="/format/Format Import.xlsx">
                                            Download Format ETax
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            </div >
        </>
    )
}