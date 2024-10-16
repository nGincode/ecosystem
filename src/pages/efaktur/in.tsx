///bug no faktur bisa sama


import React, { Component, useEffect, useState, useMemo } from "react"

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
import XLSX, { read, utils, writeFile } from 'xlsx';
import * as PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;
import Swal from "sweetalert2";
import Image from "next/image";

import Select from "../../components/reactSelect";
import ReactTable from "../../components/reactTable";
import DebouncedInput from "../../components/debouncedInput";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';


export default function EfakturIn({ userData, setuserData }: any) {
    const [dateData, setdateData] = useState<any>([moment().add(-1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
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
    const URLAPI = "/api/efaktur/in";
    const Subject = "E-Faktur In";

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
                    if (res.data.error) {
                        let text = '';
                        res.data.error.map((val: any) => {
                            text = text + val + '\n';
                        });
                        toast.error(text);
                        setdataCreate(res.data.status);
                    } else {
                        setdataCreate(res.data.status);
                        toast.success(res.data.massage);
                        ($('.btn-close') as any).trigger("click");
                        (document.getElementById('formCreate') as HTMLFormElement)?.reset();
                    }

                });
            } catch (error: any) {
                console.log(error);

                // toast.error(error.response.data.massage);
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
        } else if (url === 'export_doccon') {
            try {
                await axios({
                    method: "POST",
                    url: '/api/efaktur/in/export_doccon',
                    data: { company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    // ConvertToCSV(res.data);
                    // console.log(res.data);
                    ConvertToXLXS(res.data);
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (url === 'import_doccon') {
            try {
                console.log(data);

                await axios({
                    method: "POST",
                    url: '/api/efaktur/in/import_doccon',
                    data: { company_id: JSON.parse(localStorage.getItem('companyActive') as string)?.value, ...data },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    toast.success("Import Success")
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }

    const ConvertToXLXS = (objArray: any) => {


        let array: any = [];
        for (let index = 0; index < objArray.length; index++) {
            array['A' + (index + 3)] = { t: 's', v: index + 1 };
            array['B' + (index + 3)] = { t: 's', v: objArray[index].NAMA };
            array['D' + (index + 3)] = { t: 'd' };
            array['E' + (index + 3)] = { t: 'd' };
            array['G' + (index + 3)] = { t: 'd' };
            array['H' + (index + 3)] = { t: 'd' };
            array['M' + (index + 3)] = { t: 'd' };
            array['I' + (index + 3)] = { t: 's', v: objArray[index].NOMOR_FAKTUR };
            array['J' + (index + 3)] = { t: 'd', v: objArray[index].TANGGAL_FAKTUR };
            array['K' + (index + 3)] = { z: '#,##0', t: 'n', v: objArray[index].JUMLAH_DPP };
            array['L' + (index + 3)] = { z: '#,##0', t: 'n', v: objArray[index].JUMLAH_PPN };
        }

        XLSX.writeFile({
            SheetNames: ["Data"],
            Sheets: {
                Data: {
                    "!ref": "A1:O" + objArray.length + 3,
                    A1: { t: 's', v: "No" },
                    B1: { t: 's', v: "Suplier" },
                    C1: { t: 's', v: "Surat Jalan" },
                    C2: { t: 's', v: "Nomor" },
                    D2: { t: 's', v: "Tanggal Dokument" },
                    E2: { t: 's', v: "Tanggal Terima" },
                    F1: { t: 's', v: "Faktur/Tagihan/Invoice" },
                    F2: { t: 's', v: "Nomor" },
                    G2: { t: 's', v: "Tanggal Dokument" },
                    H2: { t: 's', v: "Tanggal Terima" },
                    I1: { t: 's', v: "Faktur Pajak" },
                    I2: { t: 's', v: "Nomor" },
                    J2: { t: 's', v: "Tanggal" },
                    K1: { t: 's', v: "Nilai Barang" },
                    K2: { t: 's', v: "DPP" },
                    L2: { t: 's', v: "PPN" },
                    M1: { t: 's', v: "Pelunasan" },
                    M2: { t: 's', v: "Tanggal" },
                    N2: { t: 's', v: "Nominal" },
                    O2: { t: 's', v: "Via Bank/Cas" },
                    ...array,
                    "!merges": [
                        { s: { c: 0, r: 0 }, e: { c: 0, r: 1 } }, /* A1:A2 */
                        { s: { c: 1, r: 0 }, e: { c: 1, r: 1 } }, /* B1:B2 */
                        { s: { c: 2, r: 0 }, e: { c: 4, r: 0 } }, /* C1:E1 */
                        { s: { c: 5, r: 0 }, e: { c: 7, r: 0 } }, /* F1:H1 */
                        { s: { c: 8, r: 0 }, e: { c: 9, r: 0 } }, /* I1:J1 */
                        { s: { c: 10, r: 0 }, e: { c: 11, r: 0 } }, /* K1:L1 */
                        { s: { c: 12, r: 0 }, e: { c: 14, r: 0 } }, /* K1:L1 */
                    ]
                }
            }
        }, 'Doc Control.xlsx');
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
            let array: any = [];
            let perm: any = val.data.find((vall: any) => {
                if (vall.data) {
                    return vall.data.find((valll: any) => {
                        if (valll.label == Subject) {
                            array.push(valll);
                        }
                    });
                }
                if (vall.label == Subject) {
                    return vall;
                }
            });
            if (array.length) {
                return array[0];
            } else {
                return perm;
            }
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

    const importFile = (val: any, convert: any, csv: any) => {
        const files = val.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {

                    if (csv) {
                        const rows: any = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                        const rows2: any = utils.sheet_to_json(wb.Sheets[sheets[0]], { raw: false });

                        rows.map((val: any, i: number) => {
                            val.TANGGAL_FAKTUR = moment(rows2[i].TANGGAL_FAKTUR, "DD/MM/YYYY").format("YYYY-MM-DD");
                            return val;
                        });

                        if (rows?.[0]['FM'] === undefined) {
                            return toast.error('FM Not Found');
                        } else if (rows?.[0]['FG_PENGGANTI'] === undefined) {
                            return toast.error('FG_PENGGANTI Not Found');
                        } else if (rows?.[0]['IS_CREDITABLE'] === undefined) {
                            return toast.error('IS_CREDITABLE Not Found');
                        } else if (rows?.[0]['JUMLAH_DPP'] === undefined) {
                            return toast.error('JUMLAH_DPP Not Found');
                        } else if (rows?.[0]['JUMLAH_PPN'] === undefined) {
                            return toast.error('JUMLAH_PPN Not Found');
                        } else if (rows?.[0]['JUMLAH_PPNBM'] === undefined) {
                            return toast.error('JUMLAH_PPNBM Not Found');
                        } else if (rows?.[0]['KD_JENIS_TRANSAKSI'] === undefined) {
                            return toast.error('KD_JENIS_TRANSAKSI Not Found');
                        } else if (rows?.[0]['MASA_PAJAK'] === undefined) {
                            return toast.error('MASA_PAJAK Not Found');
                        } else if (rows?.[0]['NAMA'] === undefined) {
                            return toast.error('NAMA Not Found');
                        } else if (rows?.[0]['NOMOR_FAKTUR'] === undefined) {
                            return toast.error('NOMOR_FAKTUR Not Found');
                        } else if (rows?.[0]['NPWP'] === undefined) {
                            return toast.error('NPWP Not Found');
                        } else if (rows?.[0]['TAHUN_PAJAK'] === undefined) {
                            return toast.error('TAHUN_PAJAK Not Found');
                        } else if (rows?.[0]['TANGGAL_FAKTUR'] === undefined) {
                            return toast.error('TANGGAL_FAKTUR Not Found');
                        }

                        Swal.fire({
                            icon: "info",
                            title: "Import data !!!",
                            text: `Are you sure want to import data to ${JSON.parse(localStorage.getItem('companyActive') as string)?.label ?? ""} ?`,
                            showCancelButton: true,
                            cancelButtonColor: "#686868",
                            confirmButtonText: "Import",
                        }).then((result: any) => {
                            if (result.isConfirmed) {
                                handleApi('create', { data: rows });
                            }
                        });
                    } else {

                        const rows = utils.sheet_to_json(wb.Sheets[sheets[0]], { raw: false });
                        const subject = [
                            ["FM", "KD_JENIS_TRANSAKSI", "FG_PENGGANTI", "NOMOR_FAKTUR", "MASA_PAJAK", "TAHUN_PAJAK", "TANGGAL_FAKTUR", "NPWP", "NAMA", "ALAMAT_LENGKAP", "JUMLAH_DPP", "JUMLAH_PPN", "JUMLAH_PPNBM", "IS_CREDITABLE"]
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

                                    if (valll['NPWP']) {
                                        if (!valll['NPWP']) {
                                            err.push("(Baris: " + (ii + 2) + ") " + "NPWP Kosong");
                                        }
                                    } else {
                                        err.push("Judul NPWP Tidak Ada");
                                    }

                                    if (valll['Nama']) {
                                        if (!valll['Nama']) {
                                            err.push("(Baris: " + (ii + 2) + ") " + "Nama Kosong");
                                        }
                                    } else {
                                        err.push("Judul Nama Tidak Ada");
                                    }

                                    if (valll['Alamat']) {
                                        if (!valll['Alamat']) {
                                            err.push("(Baris: " + (ii + 2) + ") " + "Alamat Kosong");
                                        }
                                    } else {
                                        err.push("Judul Alamat Tidak Ada");
                                    }



                                    let jumlahDPP = RPtoNumber(valll['Jumlah DPP']);
                                    let jumlahPPN = RPtoNumber(valll['Jumlah PPN']);
                                    let jumlahPPNBM = RPtoNumber(valll['Jumlah PPNBM']);
                                    let jenis_transaksi = jenisTransaksi(valll['Jenis Transaksi']);
                                    let jenis_faktur = jenisFaktur(valll['Jenis Faktur']);


                                    data.push([
                                        "FM",
                                        jenis_transaksi,
                                        jenis_faktur,
                                        valll['No Faktur'],
                                        moment(valll['Tanggal'],
                                            'YYYY/MM/DD').format('MM'),
                                        moment(valll['Tanggal'], 'YYYY/MM/DD').format('YYYY'),
                                        moment(valll['Tanggal'], 'YYYY/MM/DD').format('DD/MM/YYYY'),
                                        valll['NPWP'],
                                        valll['Nama'],
                                        valll['Alamat'],
                                        jumlahDPP,
                                        jumlahPPN,
                                        jumlahPPNBM,

                                    ])

                                })

                        })

                        let arrayFinal = [...subject, ...data];
                        console.log(arrayFinal);
                        // if (err.length) {
                        //     toast.error(err.filter((value: any, index: any, array: any) => array.indexOf(value) === index).map((val: any) => {
                        //         return val + '\n'
                        //     }, {
                        //         duration: 6000,
                        //     }));

                        // } else {
                        //     if (convert) {
                        //         ConvertToCSV(arrayFinal);
                        //     } else {
                        //         Swal.fire({
                        //             icon: "info",
                        //             title: "Import data !!!",
                        //             text: `Are you sure want to import data to ${JSON.parse(localStorage.getItem('companyActive') as string)?.label ?? ""} ?`,
                        //             showCancelButton: true,
                        //             cancelButtonColor: "#686868",
                        //             confirmButtonText: "Import",
                        //         }).then((result: any) => {
                        //             if (result.isConfirmed) {
                        //                 handleApi('create', { excel: arrayFinal });
                        //             }
                        //         });
                        //     }
                        // }
                    }
                }
            }
            reader.readAsArrayBuffer(file);
            val.target.value = '';
        }

    };

    const importFileDocCon = (val: any) => {
        const files = val.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {

                    const rows: any = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    const rows2: any = utils.sheet_to_json(wb.Sheets[sheets[0]], { raw: false });

                    let err: any = [];
                    const data = rows.map((val: any, i: number) => {
                        if (i > 0) {

                            if (rows2[i]["__EMPTY"] && moment(rows2[i]["__EMPTY"], "M/D/YY").format('YYYY-MM-DD') == 'Invalid date') {
                                err.push(`Row : ${i + 3} Date Not Valid\n`);
                            }
                            if (rows2[i]["__EMPTY_1"] && moment(rows2[i]["__EMPTY_1"], "M/D/YY").format('YYYY-MM-DD') == 'Invalid date') {
                                err.push(`Row : ${i + 3} Date Not Valid\n`);
                            }
                            if (rows2[i]["__EMPTY_2"] && moment(rows2[i]["__EMPTY_2"], "M/D/YY").format('YYYY-MM-DD') == 'Invalid date') {
                                err.push(`Row : ${i + 3} Date Not Valid\n`);
                            }
                            if (rows2[i]["__EMPTY_3"] && moment(rows2[i]["__EMPTY_3"], "M/D/YY").format('YYYY-MM-DD') == 'Invalid date') {
                                err.push(`Row : ${i + 3} Date Not Valid\n`);
                            }
                            if (rows2[i]["__EMPTY_4"] && moment(rows2[i]["__EMPTY_4"], "M/D/YY").format('YYYY-MM-DD') == 'Invalid date') {
                                err.push(`Row : ${i + 3} Date Not Valid\n`);
                            }
                            if (rows2[i]["Pelunasan"] && moment(rows2[i]["Pelunasan"], "M/D/YY").format('YYYY-MM-DD') == 'Invalid date') {
                                err.push(`Row : ${i + 3} Date Not Valid\n`);
                            }

                            return {
                                "suplier": val.Suplier,
                                "no_surat_jalan": val["Surat Jalan"],
                                "tgl_surat_jalan": rows2[i]["__EMPTY"] ? moment(rows2[i]["__EMPTY"], "M/D/YY").format('YYYY-MM-DD') : null,
                                "terima_surat_jalan": rows2[i]["__EMPTY_1"] ? moment(rows2[i]["__EMPTY_1"], "M/D/YY").format('YYYY-MM-DD') : null,
                                "no_tagihan": val["Faktur/Tagihan/Invoice"],
                                "tgl_tagihan": rows2[i]["__EMPTY_2"] ? moment(rows2[i]["__EMPTY_2"], "M/D/YY").format('YYYY-MM-DD') : null,
                                "terima_tagihan": rows2[i]["__EMPTY_3"] ? moment(rows2[i]["__EMPTY_3"], "M/D/YY").format('YYYY-MM-DD') : null,
                                "no_faktur": val["Faktur Pajak"],
                                "tgl_faktur": rows2[i]["__EMPTY_4"] ? moment(rows2[i]["__EMPTY_4"], "M/D/YY").format('YYYY-MM-DD') : null,
                                "dpp_faktur": val["Nilai Barang"],
                                "ppn_faktur": val["__EMPTY_5"],
                                "tgl_lunas": rows2[i]["Pelunasan"] ? moment(rows2[i]["Pelunasan"], "M/D/YY").format('YYYY-MM-DD') : null,
                                "nominal_lunas": val["__EMPTY_6"],
                                "via_lunas": val["__EMPTY_7"],
                            }
                        }
                    }).filter(Boolean);

                    if (err.length) {
                        return toast.error(err.map((val: any) => val), {
                            duration: 6000,
                        })
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
                                handleApi('import_doccon', { data: data });
                            }
                        });
                    }

                }
            }
            reader.readAsArrayBuffer(file);
            val.target.value = '';
        }

    };

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


    return (
        <>
            <div className="col-12 mb-5">
                <h1 className="hp-mb-0 text-4xl font-bold">{Subject}</h1>
            </div>
            <div className="row mb-32 gy-32">
                {JSON.parse(localStorage.getItem('companyActive') as string)?.value && userData.company.length ? <>
                    <div className="col-12 mt-15">
                        <div className="row g-16 align-items-center justify-content-end">

                            <div className="col-12 col-md-3 col-xl-3">
                                <div className="input-group align-items-center">
                                    <DebouncedInput
                                        value={search ?? ''}
                                        onChange={value => setsearch(String(value))}
                                        className="form-control ps-8"
                                        placeholder="Search all columns..."
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="input-group align-items-center">
                                    <DateRangePicker
                                        onCallback={(start, end) => {
                                            setdateData([moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')])

                                        }}
                                        initialSettings={{ startDate: moment(dateData?.[0]).format('DD/MM/YYYY'), endDate: moment(dateData?.[1]).format('DD/MM/YYYY') }}
                                    >
                                        <input type="text" className="form-control text-center rounded-none ps-8 bg-transparent border-t-0 border-l-0 border-r-0 border-b-2" />
                                    </DateRangePicker>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card hp-contact-card mb-15 -mt-3  shadow-md border-gray-300">
                            <div className="card-body px-0">
                                <ReactTable
                                    search={search}
                                    date={dateData}
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
                                <div className="mb-5">
                                    <label htmlFor="filePMSCV">
                                        <span className="dropdown-item text-center rounded-lg cursor-pointer" aria-hidden="true">Import PM Efaktur CSV
                                            <div className="flex justify-center mt-3">
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                                                    <path d="M10 7L15 12L10 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <svg xmlns="http://purl.org/dc/elements/1.1/" viewBox="-1.61 0 70 70" className="w-12 h-12">
                                                    <path d="m -68.256041,544.14439 c -3.2225,-0.64097 -6.0047,-2.84478 -7.3573,-5.82793 -0.595,-1.31236 -0.8482,-2.55217 -0.8438,-4.13316 0.012,-4.5438 2.8692,-8.33798 7.3079,-9.70579 0.8177,-0.25196 1.3573,-0.31847 2.611,-0.32182 0.8692,-0.002 1.8277,0.0437 2.1301,0.10227 l 0.5497,0.10649 0.6765,-1.31365 c 1.3815,-2.68242 3.5345,-4.78981 6.3178,-6.18379 2.2961,-1.15 3.739,-1.48443 6.4043,-1.48443 1.8668,0 2.2999,0.045 3.5043,0.36412 5.2011,1.37813 9.255,5.45998 10.5309,10.60353 0.3195,1.2879 0.4789,4.17568 0.293,5.30849 l -0.1269,0.77355 0.7284,0.163 c 1.8256,0.40854 3.4011,1.68396 4.2066,3.40532 0.7966,1.70226 0.6508,3.90495 -0.3651,5.51414 -0.5185,0.82136 -1.535,1.73424 -2.3832,2.14031 -0.4348,0.20813 -0.8979,0.43475 -1.0292,0.50361 -0.2947,0.15465 -32.3751,0.14085 -33.155,-0.0143 z m 33.351,-1.89876 c 0.9026,-0.44879 1.7953,-1.45217 2.1662,-2.43497 0.7697,-2.03891 -0.2571,-4.40792 -2.3055,-5.31934 -0.5173,-0.23017 -0.9037,-0.28342 -1.9824,-0.27321 -0.737,0.007 -1.3399,-0.0395 -1.3399,-0.10328 0,-0.0638 0.1369,-0.66194 0.3042,-1.32926 0.428,-1.70717 0.4237,-4.42927 -0.01,-6.09178 -0.9556,-3.66584 -3.4332,-6.72357 -6.8221,-8.4192 -1.4892,-0.74512 -2.9056,-1.08594 -4.841,-1.16493 -2.8639,-0.11687 -4.8633,0.33445 -7.0666,1.59507 -2.5693,1.47003 -4.784,4.13385 -5.6425,6.78661 -0.1651,0.51018 -0.3653,0.9268 -0.4449,0.92583 -0.08,-9.6e-4 -0.5467,-0.13408 -1.038,-0.29579 -1.3668,-0.44991 -3.6978,-0.42255 -5.0619,0.0594 -1.3731,0.48513 -2.3616,1.10694 -3.3908,2.13292 -1.5427,1.53788 -2.3996,3.63391 -2.3996,5.86959 0,3.32007 1.8288,6.23059 4.8041,7.64574 1.71,0.81331 1.1183,0.78892 18.4849,0.76186 l 15.941,-0.0248 0.6444,-0.32043 z m -45.9938,-6.42576 c -5.7671,-0.78155 -10.2061,-2.22963 -13.4896,-4.40056 -1.3548,-0.89576 -2.2902,-1.89766 -2.8176,-3.01787 l -0.3929,-0.83466 0.036,-22.59585 0.036,-22.59585 0.3281,-0.61562 c 0.8294,-1.55619 2.4465,-2.88407 5.0211,-4.12288 3.2554,-1.56646 7.0095,-2.54578 12.2408,-3.19328 2.1543,-0.26664 9.47,-0.21948 11.6809,0.0753 8.1415,1.08546 14.4594,3.74551 16.4734,6.93577 0.7936,1.25717 0.7731,0.80148 0.7731,17.22791 l 0,15.08135 -0.4466,0.0692 c -0.2456,0.038 -0.8021,0.10712 -1.2366,0.15352 -4.4834,0.47873 -9.1329,3.57818 -11.5162,7.67699 l -0.488,0.8391 -1.9169,0.0905 c -2.265,0.10697 -3.4191,0.39711 -5.1411,1.29243 -2.9567,1.53725 -5.0699,4.20232 -5.9316,7.48077 -0.238,0.90554 -0.3084,1.56192 -0.3132,2.92023 l -0.01,1.75213 -0.7594,-0.0162 c -0.4176,-0.009 -1.3777,-0.1 -2.1335,-0.20243 z m 11.7239,-20.8271 c -1.0818,-0.91805 -2.0174,-1.7137 -2.0791,-1.7681 -0.062,-0.0544 0.1631,-0.2602 0.4994,-0.45733 0.7458,-0.43708 1.7061,-1.48313 2.1139,-2.30274 0.9965,-2.00287 0.9743,-4.49403 -0.058,-6.47634 -1.135,-2.1802 -3.5103,-3.3239 -6.2014,-2.986 -1.4735,0.18503 -2.3966,0.59832 -3.3701,1.50899 -1.5366,1.4374 -2.0688,2.84774 -1.988,5.26837 0.046,1.37622 0.095,1.62372 0.4886,2.45901 0.8471,1.79787 2.6182,3.14163 4.4225,3.35531 0.6788,0.0804 0.7377,0.1249 2.0865,1.57538 l 1.3881,1.49264 2.3321,0 2.3322,0 -1.9669,-1.66919 z m -5.885,-4.6866 c -0.9451,-0.47951 -1.304,-1.30103 -1.304,-2.98527 0,-1.09589 0.053,-1.41584 0.3224,-1.96387 0.4309,-0.875 1.29,-1.40105 2.1328,-1.30604 0.829,0.0934 1.2599,0.42875 1.6984,1.32149 0.3327,0.67762 0.3808,0.93439 0.3769,2.01347 0,1.33108 -0.2403,2.01354 -0.9098,2.63622 -0.6994,0.65058 -1.42,0.73892 -2.3167,0.284 z m -9.5093,3.18974 c 2.485,-0.57319 3.8348,-2.65434 3.1192,-4.80889 -0.3603,-1.0849 -1.1219,-1.76252 -2.9819,-2.65327 -0.859,-0.41138 -1.6272,-0.83198 -1.7071,-0.93468 -0.3128,-0.40184 -0.3121,-0.66784 0,-1.03351 0.484,-0.56269 1.5858,-0.5896 3.0776,-0.0752 l 1.138,0.39245 -0.039,-1.51877 -0.039,-1.51878 -0.7558,-0.17965 c -1.143,-0.2717 -3.6136,-0.2584 -4.5856,0.0247 -1.949,0.56765 -2.976,1.84152 -2.9696,3.68323 0.01,1.89537 0.8605,2.79385 3.8676,4.06981 1.2722,0.53982 1.4179,1.54865 0.2807,1.94362 -0.5263,0.18278 -0.6761,0.17922 -1.5089,-0.0358 -0.5086,-0.13132 -1.2802,-0.42314 -1.7148,-0.64849 l -0.7902,-0.40974 0,1.64418 0,1.64418 0.7902,0.21996 c 0.4346,0.12098 0.852,0.2415 0.9276,0.26783 0.3141,0.10941 3.3435,0.0524 3.8879,-0.0732 z m 26.5512,-1.4376 0,-1.44294 -2.1988,0 -2.1987,0 0,-4.74107 0,-4.74107 -1.7865,0 -1.7865,0 0,6.18401 0,6.184 3.9853,0 3.9852,0 0,-1.44293 z m -10.5815,-24.74151 c 3.5835,-0.41532 6.5241,-1.16648 8.3827,-2.14132 1.2211,-0.64044 1.5139,-0.87116 1.9833,-1.56285 1.4515,-2.13894 -1.7987,-4.28958 -8.0986,-5.35876 -5.9187,-1.0045 -13.7186,-0.77727 -18.7108,0.54509 -10.3005,2.7285 -6.2399,7.74058 7.0717,8.7287 2.1847,0.16217 7.109,0.0514 9.3717,-0.21086 z" fill="#00bcf2" transform="translate(97.599 -474.268)" />
                                                </svg>
                                            </div>
                                        </span>
                                        <input type="file" id="filePMSCV" name="file" accept=".csv" style={{ display: "none" }} onChange={(val: any) => importFile(val, false, true)} />
                                    </label>
                                    <div className="text-center mt-2">
                                        <a download href="/format/Format Efaktur PM.csv">
                                            Download Examp PM CSV
                                        </a>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label onClick={() => {
                                        toast.promise(
                                            handleApi('export_doccon'),
                                            {
                                                loading: 'Export File...',
                                                success: null,
                                                error: null,
                                            }, {
                                            success: {
                                                duration: 1,
                                            },
                                        }
                                        )
                                    }}>
                                        <span className="dropdown-item text-center rounded-lg cursor-pointer" aria-hidden="true">Export Doc Control
                                            <div className="flex justify-center mt-3">
                                                <svg xmlns="http://purl.org/dc/elements/1.1/" viewBox="-1.61 0 70 70" className="w-12 h-12">
                                                    <path d="m -68.256041,544.14439 c -3.2225,-0.64097 -6.0047,-2.84478 -7.3573,-5.82793 -0.595,-1.31236 -0.8482,-2.55217 -0.8438,-4.13316 0.012,-4.5438 2.8692,-8.33798 7.3079,-9.70579 0.8177,-0.25196 1.3573,-0.31847 2.611,-0.32182 0.8692,-0.002 1.8277,0.0437 2.1301,0.10227 l 0.5497,0.10649 0.6765,-1.31365 c 1.3815,-2.68242 3.5345,-4.78981 6.3178,-6.18379 2.2961,-1.15 3.739,-1.48443 6.4043,-1.48443 1.8668,0 2.2999,0.045 3.5043,0.36412 5.2011,1.37813 9.255,5.45998 10.5309,10.60353 0.3195,1.2879 0.4789,4.17568 0.293,5.30849 l -0.1269,0.77355 0.7284,0.163 c 1.8256,0.40854 3.4011,1.68396 4.2066,3.40532 0.7966,1.70226 0.6508,3.90495 -0.3651,5.51414 -0.5185,0.82136 -1.535,1.73424 -2.3832,2.14031 -0.4348,0.20813 -0.8979,0.43475 -1.0292,0.50361 -0.2947,0.15465 -32.3751,0.14085 -33.155,-0.0143 z m 33.351,-1.89876 c 0.9026,-0.44879 1.7953,-1.45217 2.1662,-2.43497 0.7697,-2.03891 -0.2571,-4.40792 -2.3055,-5.31934 -0.5173,-0.23017 -0.9037,-0.28342 -1.9824,-0.27321 -0.737,0.007 -1.3399,-0.0395 -1.3399,-0.10328 0,-0.0638 0.1369,-0.66194 0.3042,-1.32926 0.428,-1.70717 0.4237,-4.42927 -0.01,-6.09178 -0.9556,-3.66584 -3.4332,-6.72357 -6.8221,-8.4192 -1.4892,-0.74512 -2.9056,-1.08594 -4.841,-1.16493 -2.8639,-0.11687 -4.8633,0.33445 -7.0666,1.59507 -2.5693,1.47003 -4.784,4.13385 -5.6425,6.78661 -0.1651,0.51018 -0.3653,0.9268 -0.4449,0.92583 -0.08,-9.6e-4 -0.5467,-0.13408 -1.038,-0.29579 -1.3668,-0.44991 -3.6978,-0.42255 -5.0619,0.0594 -1.3731,0.48513 -2.3616,1.10694 -3.3908,2.13292 -1.5427,1.53788 -2.3996,3.63391 -2.3996,5.86959 0,3.32007 1.8288,6.23059 4.8041,7.64574 1.71,0.81331 1.1183,0.78892 18.4849,0.76186 l 15.941,-0.0248 0.6444,-0.32043 z m -45.9938,-6.42576 c -5.7671,-0.78155 -10.2061,-2.22963 -13.4896,-4.40056 -1.3548,-0.89576 -2.2902,-1.89766 -2.8176,-3.01787 l -0.3929,-0.83466 0.036,-22.59585 0.036,-22.59585 0.3281,-0.61562 c 0.8294,-1.55619 2.4465,-2.88407 5.0211,-4.12288 3.2554,-1.56646 7.0095,-2.54578 12.2408,-3.19328 2.1543,-0.26664 9.47,-0.21948 11.6809,0.0753 8.1415,1.08546 14.4594,3.74551 16.4734,6.93577 0.7936,1.25717 0.7731,0.80148 0.7731,17.22791 l 0,15.08135 -0.4466,0.0692 c -0.2456,0.038 -0.8021,0.10712 -1.2366,0.15352 -4.4834,0.47873 -9.1329,3.57818 -11.5162,7.67699 l -0.488,0.8391 -1.9169,0.0905 c -2.265,0.10697 -3.4191,0.39711 -5.1411,1.29243 -2.9567,1.53725 -5.0699,4.20232 -5.9316,7.48077 -0.238,0.90554 -0.3084,1.56192 -0.3132,2.92023 l -0.01,1.75213 -0.7594,-0.0162 c -0.4176,-0.009 -1.3777,-0.1 -2.1335,-0.20243 z m 11.7239,-20.8271 c -1.0818,-0.91805 -2.0174,-1.7137 -2.0791,-1.7681 -0.062,-0.0544 0.1631,-0.2602 0.4994,-0.45733 0.7458,-0.43708 1.7061,-1.48313 2.1139,-2.30274 0.9965,-2.00287 0.9743,-4.49403 -0.058,-6.47634 -1.135,-2.1802 -3.5103,-3.3239 -6.2014,-2.986 -1.4735,0.18503 -2.3966,0.59832 -3.3701,1.50899 -1.5366,1.4374 -2.0688,2.84774 -1.988,5.26837 0.046,1.37622 0.095,1.62372 0.4886,2.45901 0.8471,1.79787 2.6182,3.14163 4.4225,3.35531 0.6788,0.0804 0.7377,0.1249 2.0865,1.57538 l 1.3881,1.49264 2.3321,0 2.3322,0 -1.9669,-1.66919 z m -5.885,-4.6866 c -0.9451,-0.47951 -1.304,-1.30103 -1.304,-2.98527 0,-1.09589 0.053,-1.41584 0.3224,-1.96387 0.4309,-0.875 1.29,-1.40105 2.1328,-1.30604 0.829,0.0934 1.2599,0.42875 1.6984,1.32149 0.3327,0.67762 0.3808,0.93439 0.3769,2.01347 0,1.33108 -0.2403,2.01354 -0.9098,2.63622 -0.6994,0.65058 -1.42,0.73892 -2.3167,0.284 z m -9.5093,3.18974 c 2.485,-0.57319 3.8348,-2.65434 3.1192,-4.80889 -0.3603,-1.0849 -1.1219,-1.76252 -2.9819,-2.65327 -0.859,-0.41138 -1.6272,-0.83198 -1.7071,-0.93468 -0.3128,-0.40184 -0.3121,-0.66784 0,-1.03351 0.484,-0.56269 1.5858,-0.5896 3.0776,-0.0752 l 1.138,0.39245 -0.039,-1.51877 -0.039,-1.51878 -0.7558,-0.17965 c -1.143,-0.2717 -3.6136,-0.2584 -4.5856,0.0247 -1.949,0.56765 -2.976,1.84152 -2.9696,3.68323 0.01,1.89537 0.8605,2.79385 3.8676,4.06981 1.2722,0.53982 1.4179,1.54865 0.2807,1.94362 -0.5263,0.18278 -0.6761,0.17922 -1.5089,-0.0358 -0.5086,-0.13132 -1.2802,-0.42314 -1.7148,-0.64849 l -0.7902,-0.40974 0,1.64418 0,1.64418 0.7902,0.21996 c 0.4346,0.12098 0.852,0.2415 0.9276,0.26783 0.3141,0.10941 3.3435,0.0524 3.8879,-0.0732 z m 26.5512,-1.4376 0,-1.44294 -2.1988,0 -2.1987,0 0,-4.74107 0,-4.74107 -1.7865,0 -1.7865,0 0,6.18401 0,6.184 3.9853,0 3.9852,0 0,-1.44293 z m -10.5815,-24.74151 c 3.5835,-0.41532 6.5241,-1.16648 8.3827,-2.14132 1.2211,-0.64044 1.5139,-0.87116 1.9833,-1.56285 1.4515,-2.13894 -1.7987,-4.28958 -8.0986,-5.35876 -5.9187,-1.0045 -13.7186,-0.77727 -18.7108,0.54509 -10.3005,2.7285 -6.2399,7.74058 7.0717,8.7287 2.1847,0.16217 7.109,0.0514 9.3717,-0.21086 z" fill="#00bcf2" transform="translate(97.599 -474.268)" />
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" fill="none">
                                                    <path d="M10 7L15 12L10 17" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
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
                                            </div>
                                        </span>
                                    </label>
                                </div>

                                <div className="mb-5">
                                    <label htmlFor="fileFormat">
                                        <span className="dropdown-item text-center rounded-lg  cursor-pointer" aria-hidden="true">Upload Doc Control
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
                                                <svg xmlns="http://purl.org/dc/elements/1.1/" viewBox="-1.61 0 70 70" className="w-12 h-12">
                                                    <path d="m -68.256041,544.14439 c -3.2225,-0.64097 -6.0047,-2.84478 -7.3573,-5.82793 -0.595,-1.31236 -0.8482,-2.55217 -0.8438,-4.13316 0.012,-4.5438 2.8692,-8.33798 7.3079,-9.70579 0.8177,-0.25196 1.3573,-0.31847 2.611,-0.32182 0.8692,-0.002 1.8277,0.0437 2.1301,0.10227 l 0.5497,0.10649 0.6765,-1.31365 c 1.3815,-2.68242 3.5345,-4.78981 6.3178,-6.18379 2.2961,-1.15 3.739,-1.48443 6.4043,-1.48443 1.8668,0 2.2999,0.045 3.5043,0.36412 5.2011,1.37813 9.255,5.45998 10.5309,10.60353 0.3195,1.2879 0.4789,4.17568 0.293,5.30849 l -0.1269,0.77355 0.7284,0.163 c 1.8256,0.40854 3.4011,1.68396 4.2066,3.40532 0.7966,1.70226 0.6508,3.90495 -0.3651,5.51414 -0.5185,0.82136 -1.535,1.73424 -2.3832,2.14031 -0.4348,0.20813 -0.8979,0.43475 -1.0292,0.50361 -0.2947,0.15465 -32.3751,0.14085 -33.155,-0.0143 z m 33.351,-1.89876 c 0.9026,-0.44879 1.7953,-1.45217 2.1662,-2.43497 0.7697,-2.03891 -0.2571,-4.40792 -2.3055,-5.31934 -0.5173,-0.23017 -0.9037,-0.28342 -1.9824,-0.27321 -0.737,0.007 -1.3399,-0.0395 -1.3399,-0.10328 0,-0.0638 0.1369,-0.66194 0.3042,-1.32926 0.428,-1.70717 0.4237,-4.42927 -0.01,-6.09178 -0.9556,-3.66584 -3.4332,-6.72357 -6.8221,-8.4192 -1.4892,-0.74512 -2.9056,-1.08594 -4.841,-1.16493 -2.8639,-0.11687 -4.8633,0.33445 -7.0666,1.59507 -2.5693,1.47003 -4.784,4.13385 -5.6425,6.78661 -0.1651,0.51018 -0.3653,0.9268 -0.4449,0.92583 -0.08,-9.6e-4 -0.5467,-0.13408 -1.038,-0.29579 -1.3668,-0.44991 -3.6978,-0.42255 -5.0619,0.0594 -1.3731,0.48513 -2.3616,1.10694 -3.3908,2.13292 -1.5427,1.53788 -2.3996,3.63391 -2.3996,5.86959 0,3.32007 1.8288,6.23059 4.8041,7.64574 1.71,0.81331 1.1183,0.78892 18.4849,0.76186 l 15.941,-0.0248 0.6444,-0.32043 z m -45.9938,-6.42576 c -5.7671,-0.78155 -10.2061,-2.22963 -13.4896,-4.40056 -1.3548,-0.89576 -2.2902,-1.89766 -2.8176,-3.01787 l -0.3929,-0.83466 0.036,-22.59585 0.036,-22.59585 0.3281,-0.61562 c 0.8294,-1.55619 2.4465,-2.88407 5.0211,-4.12288 3.2554,-1.56646 7.0095,-2.54578 12.2408,-3.19328 2.1543,-0.26664 9.47,-0.21948 11.6809,0.0753 8.1415,1.08546 14.4594,3.74551 16.4734,6.93577 0.7936,1.25717 0.7731,0.80148 0.7731,17.22791 l 0,15.08135 -0.4466,0.0692 c -0.2456,0.038 -0.8021,0.10712 -1.2366,0.15352 -4.4834,0.47873 -9.1329,3.57818 -11.5162,7.67699 l -0.488,0.8391 -1.9169,0.0905 c -2.265,0.10697 -3.4191,0.39711 -5.1411,1.29243 -2.9567,1.53725 -5.0699,4.20232 -5.9316,7.48077 -0.238,0.90554 -0.3084,1.56192 -0.3132,2.92023 l -0.01,1.75213 -0.7594,-0.0162 c -0.4176,-0.009 -1.3777,-0.1 -2.1335,-0.20243 z m 11.7239,-20.8271 c -1.0818,-0.91805 -2.0174,-1.7137 -2.0791,-1.7681 -0.062,-0.0544 0.1631,-0.2602 0.4994,-0.45733 0.7458,-0.43708 1.7061,-1.48313 2.1139,-2.30274 0.9965,-2.00287 0.9743,-4.49403 -0.058,-6.47634 -1.135,-2.1802 -3.5103,-3.3239 -6.2014,-2.986 -1.4735,0.18503 -2.3966,0.59832 -3.3701,1.50899 -1.5366,1.4374 -2.0688,2.84774 -1.988,5.26837 0.046,1.37622 0.095,1.62372 0.4886,2.45901 0.8471,1.79787 2.6182,3.14163 4.4225,3.35531 0.6788,0.0804 0.7377,0.1249 2.0865,1.57538 l 1.3881,1.49264 2.3321,0 2.3322,0 -1.9669,-1.66919 z m -5.885,-4.6866 c -0.9451,-0.47951 -1.304,-1.30103 -1.304,-2.98527 0,-1.09589 0.053,-1.41584 0.3224,-1.96387 0.4309,-0.875 1.29,-1.40105 2.1328,-1.30604 0.829,0.0934 1.2599,0.42875 1.6984,1.32149 0.3327,0.67762 0.3808,0.93439 0.3769,2.01347 0,1.33108 -0.2403,2.01354 -0.9098,2.63622 -0.6994,0.65058 -1.42,0.73892 -2.3167,0.284 z m -9.5093,3.18974 c 2.485,-0.57319 3.8348,-2.65434 3.1192,-4.80889 -0.3603,-1.0849 -1.1219,-1.76252 -2.9819,-2.65327 -0.859,-0.41138 -1.6272,-0.83198 -1.7071,-0.93468 -0.3128,-0.40184 -0.3121,-0.66784 0,-1.03351 0.484,-0.56269 1.5858,-0.5896 3.0776,-0.0752 l 1.138,0.39245 -0.039,-1.51877 -0.039,-1.51878 -0.7558,-0.17965 c -1.143,-0.2717 -3.6136,-0.2584 -4.5856,0.0247 -1.949,0.56765 -2.976,1.84152 -2.9696,3.68323 0.01,1.89537 0.8605,2.79385 3.8676,4.06981 1.2722,0.53982 1.4179,1.54865 0.2807,1.94362 -0.5263,0.18278 -0.6761,0.17922 -1.5089,-0.0358 -0.5086,-0.13132 -1.2802,-0.42314 -1.7148,-0.64849 l -0.7902,-0.40974 0,1.64418 0,1.64418 0.7902,0.21996 c 0.4346,0.12098 0.852,0.2415 0.9276,0.26783 0.3141,0.10941 3.3435,0.0524 3.8879,-0.0732 z m 26.5512,-1.4376 0,-1.44294 -2.1988,0 -2.1987,0 0,-4.74107 0,-4.74107 -1.7865,0 -1.7865,0 0,6.18401 0,6.184 3.9853,0 3.9852,0 0,-1.44293 z m -10.5815,-24.74151 c 3.5835,-0.41532 6.5241,-1.16648 8.3827,-2.14132 1.2211,-0.64044 1.5139,-0.87116 1.9833,-1.56285 1.4515,-2.13894 -1.7987,-4.28958 -8.0986,-5.35876 -5.9187,-1.0045 -13.7186,-0.77727 -18.7108,0.54509 -10.3005,2.7285 -6.2399,7.74058 7.0717,8.7287 2.1847,0.16217 7.109,0.0514 9.3717,-0.21086 z" fill="#00bcf2" transform="translate(97.599 -474.268)" />
                                                </svg>
                                            </div>
                                        </span>
                                        <input type="file" id="fileFormat" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: "none" }} onChange={(val: any) => importFileDocCon(val)} />
                                    </label>
                                </div>

                                {/* <div className="mb-5">
                                    <label htmlFor="pdf">
                                        <span className="dropdown-item text-center rounded-lg cursor-pointer" aria-hidden="true">Checklist Faktur PDF Etax
                                            <div className="flex justify-center mt-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enableBackground="new 0 0 512 512" id="Layer_1" version="1.1" className="w-12 h-12">

                                                    <g>

                                                        <g>

                                                            <path d="M273.51,445.387h-200c-12.131,0-22-9.869-22-22v-314c0-12.131,9.869-22,22-22h41c5.523,0,10,4.478,10,10    v9.69c0,0.313,0.701,1.08,2,1.08h94c1.299,0,2-0.767,2-1.08v-9.69c0-5.522,4.477-10,10-10h41c12.131,0,22,9.869,22,22v147.101    c0,2.652-1.054,5.195-2.929,7.071l-53.279,53.278l25.869,25.877l13.268-13.269c2.86-2.859,7.161-3.714,10.898-2.168    c3.737,1.548,6.173,5.194,6.173,9.239v86.87C295.51,435.518,285.641,445.387,273.51,445.387z M73.51,107.387c-1.103,0-2,0.897-2,2    v314c0,1.103,0.897,2,2,2h200c1.103,0,2-0.897,2-2v-62.728l-3.269,3.27c-1.875,1.875-4.419,2.929-7.071,2.929c0,0,0,0-0.001,0    c-2.652,0-5.196-1.055-7.071-2.931l-40.009-40.019c-1.875-1.876-2.929-4.419-2.929-7.071s1.054-5.196,2.929-7.071l57.421-57.421    V109.387c0-1.103-0.897-2-2-2h-31.002c-0.174,11.481-9.975,20.771-21.998,20.771h-94c-12.023,0-21.824-9.289-21.998-20.771H73.51z    " fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M220.512,128.152h-94c-12.131,0-22-9.456-22-21.08V87.693c0-11.624,9.869-21.08,22-21.08h94    c12.131,0,22,9.456,22,21.08v19.379C242.512,118.696,232.643,128.152,220.512,128.152z M126.512,86.613c-1.299,0-2,0.767-2,1.08    v19.379c0,0.313,0.701,1.08,2,1.08h94c1.299,0,2-0.767,2-1.08V87.693c0-0.313-0.701-1.08-2-1.08H126.512z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M273.418,167.383H75.235c-12.158,0-22.049-9.869-22.049-22v-35.5c0-12.131,9.891-22,22.049-22h38.528    c5.523,0,10,4.478,10,10v9.189c0,0.313,0.718,1.08,2.05,1.08H220.2c1.331,0,2.049-0.767,2.049-1.08v-9.189c0-5.522,4.477-10,10-10    h41.168c12.158,0,22.05,9.869,22.05,22v35.5C295.468,157.514,285.576,167.383,273.418,167.383z M75.235,107.883    c-1.13,0-2.049,0.897-2.049,2v35.5c0,1.103,0.919,2,2.049,2h198.183c1.13,0,2.05-0.897,2.05-2v-35.5c0-1.103-0.919-2-2.05-2    h-31.185c-0.448,11.249-10.159,20.27-22.033,20.27h-94.388c-11.874,0-21.586-9.021-22.034-20.27H75.235z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M106.71,241.298L106.71,241.298c-2.652,0-5.196-1.054-7.071-2.929l-15.186-15.187    c-3.905-3.905-3.905-10.237,0-14.143c3.905-3.904,10.237-3.903,14.142,0l8.115,8.115l32.661-32.659    c3.905-3.904,10.237-3.903,14.142,0c3.905,3.905,3.905,10.237,0,14.143l-39.731,39.73    C111.906,240.244,109.363,241.298,106.71,241.298z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M104.225,328.77L104.225,328.77c-2.652,0-5.196-1.054-7.071-2.929l-15.186-15.187    c-3.905-3.905-3.905-10.237,0-14.143c3.905-3.904,10.237-3.903,14.142,0l8.115,8.115l32.661-32.659    c3.905-3.904,10.236-3.903,14.142,0c3.905,3.905,3.905,10.237,0,14.143l-39.731,39.73    C109.42,327.716,106.876,328.77,104.225,328.77z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M265.17,366.857C265.17,366.857,265.169,366.857,265.17,366.857c-2.653,0-5.197-1.055-7.072-2.931    l-40.009-40.019c-1.875-1.876-2.929-4.419-2.929-7.071s1.054-5.196,2.929-7.071l167.22-167.22c3.905-3.904,10.237-3.904,14.142,0    l40.02,40.02c1.875,1.876,2.929,4.419,2.929,7.071s-1.054,5.196-2.929,7.071L272.241,363.929    C270.366,365.804,267.822,366.857,265.17,366.857z M239.302,316.837l25.87,25.877l153.086-153.077l-25.877-25.878L239.302,316.837    z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M209.011,382.997c-2.616,0-5.171-1.027-7.073-2.93c-2.572-2.573-3.544-6.34-2.538-9.835l16.147-56.151    c0.976-3.404,3.68-6.039,7.109-6.926c3.427-0.887,7.07,0.105,9.575,2.61l40.011,40.022c2.503,2.504,3.496,6.144,2.61,9.571    s-3.518,6.132-6.92,7.109l-56.16,16.14C210.861,382.87,209.932,382.997,209.011,382.997z M230.087,335.907l-6.47,22.486    l22.489-6.463L230.087,335.907z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M432.408,199.616c-2.56,0-5.118-0.977-7.071-2.929l-40.009-40.01c-3.905-3.905-3.905-10.237,0-14.143    l18.082-18.082c1.875-1.875,4.419-2.929,7.071-2.929s5.196,1.054,7.071,2.929l40.01,40.01c1.875,1.876,2.929,4.419,2.929,7.071    s-1.054,5.196-2.929,7.071l-18.083,18.082C437.526,198.64,434.967,199.616,432.408,199.616z M406.541,149.606l25.867,25.868    l3.94-3.94l-25.868-25.867L406.541,149.606z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M259.982,221.433h-85.655c-5.523,0-10-4.478-10-10s4.477-10,10-10h85.655c5.523,0,10,4.478,10,10    S265.505,221.433,259.982,221.433z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M237,314.997h-62.67c-5.523,0-10-4.478-10-10s4.477-10,10-10H237c5.523,0,10,4.478,10,10    S242.523,314.997,237,314.997z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M111.482,382.998H91.524c-5.523,0-10-4.478-10-10s4.477-10,10-10h19.958c5.523,0,10,4.478,10,10    S117.005,382.998,111.482,382.998z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M209.01,382.997h-44.15c-5.523,0-10-4.478-10-10s4.477-10,10-10h44.15c5.523,0,10,4.478,10,10    S214.533,382.997,209.01,382.997z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M237,304.997l-11.84,11.84l14.12,14.12l25.89,25.9l20.34-20.341v86.87c0,6.63-5.37,12-12,12h-200    c-6.63,0-12-5.37-12-12v-314c0-6.63,5.37-12,12-12h41v9.69c0,6.12,5.37,11.08,12,11.08h94c6.63,0,12-4.96,12-11.08v-9.69h41    c6.63,0,12,5.37,12,12v147.101L237,304.997z" fill="#D9DCE1" />

                                                            <path d="M273.51,445.387h-200c-12.131,0-22-9.869-22-22v-314c0-12.131,9.869-22,22-22h41c5.523,0,10,4.478,10,10    v9.69c0,0.313,0.701,1.08,2,1.08h94c1.299,0,2-0.767,2-1.08v-9.69c0-5.522,4.477-10,10-10h41c12.131,0,22,9.869,22,22v147.101    c0,2.652-1.054,5.195-2.929,7.071l-53.279,53.278l25.869,25.877l13.268-13.269c2.86-2.859,7.161-3.714,10.898-2.168    c3.737,1.548,6.173,5.194,6.173,9.239v86.87C295.51,435.518,285.641,445.387,273.51,445.387z M73.51,107.387c-1.103,0-2,0.897-2,2    v314c0,1.103,0.897,2,2,2h200c1.103,0,2-0.897,2-2v-62.728l-3.269,3.27c-1.875,1.875-4.419,2.929-7.071,2.929c0,0,0,0-0.001,0    c-2.652,0-5.196-1.055-7.071-2.931l-40.009-40.019c-1.875-1.876-2.929-4.419-2.929-7.071s1.054-5.196,2.929-7.071l57.421-57.421    V109.387c0-1.103-0.897-2-2-2h-31.002c-0.174,11.481-9.975,20.771-21.998,20.771h-94c-12.023,0-21.824-9.289-21.998-20.771H73.51z    " fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M232.512,87.693v19.379c0,6.121-5.37,11.08-12,11.08h-94c-6.63,0-12-4.959-12-11.08V87.693    c0-6.121,5.37-11.08,12-11.08h94C227.142,76.613,232.512,81.572,232.512,87.693z" fill="#D9DCE1" />

                                                            <path d="M220.512,128.152h-94c-12.131,0-22-9.456-22-21.08V87.693c0-11.624,9.869-21.08,22-21.08h94    c12.131,0,22,9.456,22,21.08v19.379C242.512,118.696,232.643,128.152,220.512,128.152z M126.512,86.613c-1.299,0-2,0.767-2,1.08    v19.379c0,0.313,0.701,1.08,2,1.08h94c1.299,0,2-0.767,2-1.08V87.693c0-0.313-0.701-1.08-2-1.08H126.512z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M285.468,109.883v35.5c0,6.63-5.392,12-12.05,12H75.235c-6.647,0-12.049-5.37-12.049-12v-35.5    c0-6.63,5.402-12,12.049-12h38.528v9.189c0,6.121,5.393,11.08,12.05,11.08H220.2c6.657,0,12.049-4.959,12.049-11.08v-9.189h41.168    C280.076,97.883,285.468,103.253,285.468,109.883z" fill="#3C74BA" />

                                                            <path d="M273.418,167.383H75.235c-12.158,0-22.049-9.869-22.049-22v-35.5c0-12.131,9.891-22,22.049-22h38.528    c5.523,0,10,4.478,10,10v9.189c0,0.313,0.718,1.08,2.05,1.08H220.2c1.331,0,2.049-0.767,2.049-1.08v-9.189c0-5.522,4.477-10,10-10    h41.168c12.158,0,22.05,9.869,22.05,22v35.5C295.468,157.514,285.576,167.383,273.418,167.383z M75.235,107.883    c-1.13,0-2.049,0.897-2.049,2v35.5c0,1.103,0.919,2,2.049,2h198.183c1.13,0,2.05-0.897,2.05-2v-35.5c0-1.103-0.919-2-2.05-2    h-31.185c-0.448,11.249-10.159,20.27-22.033,20.27h-94.388c-11.874,0-21.586-9.021-22.034-20.27H75.235z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M106.71,241.298L106.71,241.298c-2.652,0-5.196-1.054-7.071-2.929l-15.186-15.187    c-3.905-3.905-3.905-10.237,0-14.143c3.905-3.904,10.237-3.903,14.142,0l8.115,8.115l32.661-32.659    c3.905-3.904,10.237-3.903,14.142,0c3.905,3.905,3.905,10.237,0,14.143l-39.731,39.73    C111.906,240.244,109.363,241.298,106.71,241.298z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M104.225,328.77L104.225,328.77c-2.652,0-5.196-1.054-7.071-2.929l-15.186-15.187    c-3.905-3.905-3.905-10.237,0-14.143c3.905-3.904,10.237-3.903,14.142,0l8.115,8.115l32.661-32.659    c3.905-3.904,10.236-3.903,14.142,0c3.905,3.905,3.905,10.237,0,14.143l-39.731,39.73    C109.42,327.716,106.876,328.77,104.225,328.77z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <polygon fill="#3C74BA" points="432.4,189.637 285.51,336.517 265.17,356.857 239.28,330.957 225.16,316.837 237,304.997     392.38,149.617   " />

                                                            <path d="M265.17,366.857C265.17,366.857,265.169,366.857,265.17,366.857c-2.653,0-5.197-1.055-7.072-2.931    l-40.009-40.019c-1.875-1.876-2.929-4.419-2.929-7.071s1.054-5.196,2.929-7.071l167.22-167.22c3.905-3.904,10.237-3.904,14.142,0    l40.02,40.02c1.875,1.876,2.929,4.419,2.929,7.071s-1.054,5.196-2.929,7.071L272.241,363.929    C270.366,365.804,267.822,366.857,265.17,366.857z M239.302,316.837l25.87,25.877l153.086-153.077l-25.877-25.878L239.302,316.837    z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <polygon fill="#3C74BA" points="265.17,356.857 239.28,364.297 209.01,372.997 222.64,325.627 225.16,316.837 239.28,330.957       " />

                                                            <path d="M209.011,382.997c-2.616,0-5.171-1.027-7.073-2.93c-2.572-2.573-3.544-6.34-2.538-9.835l16.147-56.151    c0.976-3.404,3.68-6.039,7.109-6.926c3.427-0.887,7.07,0.105,9.575,2.61l40.011,40.022c2.503,2.504,3.496,6.144,2.61,9.571    s-3.518,6.132-6.92,7.109l-56.16,16.14C210.861,382.87,209.932,382.997,209.011,382.997z M230.087,335.907l-6.47,22.486    l22.489-6.463L230.087,335.907z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M432.408,199.616c-2.56,0-5.118-0.977-7.071-2.929l-40.009-40.01c-3.905-3.905-3.905-10.237,0-14.143    l18.082-18.082c1.875-1.875,4.419-2.929,7.071-2.929s5.196,1.054,7.071,2.929l40.01,40.01c1.875,1.876,2.929,4.419,2.929,7.071    s-1.054,5.196-2.929,7.071l-18.083,18.082C437.526,198.64,434.967,199.616,432.408,199.616z M406.541,149.606l25.867,25.868    l3.94-3.94l-25.868-25.867L406.541,149.606z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M259.982,221.433h-85.655c-5.523,0-10-4.478-10-10s4.477-10,10-10h85.655c5.523,0,10,4.478,10,10    S265.505,221.433,259.982,221.433z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M237,314.997h-62.67c-5.523,0-10-4.478-10-10s4.477-10,10-10H237c5.523,0,10,4.478,10,10    S242.523,314.997,237,314.997z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M111.482,382.998H91.524c-5.523,0-10-4.478-10-10s4.477-10,10-10h19.958c5.523,0,10,4.478,10,10    S117.005,382.998,111.482,382.998z" fill="#444B54" />

                                                        </g>

                                                        <g>

                                                            <path d="M209.01,382.997h-44.15c-5.523,0-10-4.478-10-10s4.477-10,10-10h44.15c5.523,0,10,4.478,10,10    S214.533,382.997,209.01,382.997z" fill="#444B54" />

                                                        </g>

                                                    </g>

                                                </svg>
                                            </div>
                                        </span>
                                        <input type="file" id="pdf" style={{ display: "none" }} accept='application/pdf' multiple onChange={(val: any) =>
                                            toast.promise(
                                                pdfRead(val),
                                                {
                                                    loading: 'Process Verify File...',
                                                    success: null,
                                                    error: null,
                                                }, {
                                                success: {
                                                    duration: 1,
                                                },
                                            }
                                            )} />
                                    </label>
                                    <div className="text-center mt-2">
                                        <Link href="/format/Format Ceklist.pdf" target="_blank">
                                            Download Example PDF
                                        </Link>
                                    </div>
                                </div>

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
                                        <Link href="/format/Format Import Efaktur PK.xlsx">
                                            Download Format ETax
                                        </Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </> : <>
                    <div className="col-12  mt-48">
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
                </>}
            </div >
        </>
    )
}