import React, { Component, useEffect, useState, useMemo } from "react"
import Image from "next/image";
import Link from "next/link";
import moment from "moment"
import toast, { Toaster } from 'react-hot-toast';

import * as PDFJS from 'pdfjs-dist';
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;
import XLSX, { read, utils, writeFile } from 'xlsx';
import numeral from "numeral";

export default function StockData({ userData, setuserData }: any) {
    const Subject = "Converter";

    const convertToPdfRekeningGiroBCA = async (textList: any) => {
        const convertToExcel = async (data: any) => {
            let data1 = data.map((mp: any) => {
                if (mp.tanggal)
                    return {
                        tanggal: mp.tanggal,
                        keterangan: mp.keterangan,
                        cbg: mp.cbg,
                        kredit: mp.kredit,
                        debit: mp.debit,
                        saldo: mp.saldo,
                    }
            }).filter((f: any) => f);
            let data2 = data.filter((mp: any) => {
                if (mp.title)
                    return {
                        title: mp.title,
                        saldo: mp.saldo
                    }
            });

            const ws1 = XLSX.utils.json_to_sheet(data1);
            const ws2 = XLSX.utils.json_to_sheet(data2);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, ws1, "Data 1");
            XLSX.utils.book_append_sheet(workbook, ws2, "Data 2");

            XLSX.writeFile(workbook, "BCA DEBIT KREDIT.xlsx", { compression: true });
        }
        let ulang = await textList.map((mp: any) => {
            let tgl = false;
            let brs = false;

            let arr: any = [];
            let batastgl = false;
            mp.items.map((mp1: any) => {
                if (mp1.str == 'TANGGAL') tgl = true;
                if (mp1.str == 'Bersambung') {
                    brs = true;
                    tgl = false;
                }
                if (tgl && !brs) {
                    return mp1.str
                }
            }).filter((fl: any, k: number) => fl).map((mp2: any, kk: number, values: any) => {
                let split: any = mp2.split('/');

                if (split.length == 2) {
                    if (split?.[0].length == 2 && split?.[1].length == 2) {
                        if (!batastgl) {
                            arr.push({ tanggal: mp2 })
                        } else {
                            arr.push(mp2)
                        }
                        batastgl = true
                    } else {
                        if (mp2.indexOf(',') !== -1 && mp2.indexOf('.') !== -1) {
                            if (batastgl) {
                                if (mp2.indexOf('DB') !== -1 || values[kk + 1].indexOf('DB') !== -1 || values[kk + 2].indexOf('DB') !== -1) {
                                    values[kk + 1] = values[kk + 1].replace('DB', '');
                                    values[kk + 2] = values[kk + 2].replace('DB', '');
                                    arr.push({ debit: mp2.replace('DB', '') })
                                } else {
                                    arr.push({ kredit: mp2 })
                                }

                            } else {
                                arr.push({ saldo: mp2 })
                            }
                            batastgl = false;
                        } else {
                            arr.push(mp2)
                        }
                    }
                } else {
                    if (mp2.indexOf(',') !== -1 && mp2.indexOf('.') !== -1) {
                        if (batastgl) {
                            if (mp2.indexOf('DB') !== -1 || values[kk + 1].indexOf('DB') !== -1 || values[kk + 2].indexOf('DB') !== -1) {
                                values[kk + 1] = values[kk + 1].replace('DB', '');
                                values[kk + 2] = values[kk + 2].replace('DB', '');
                                arr.push({ debit: mp2.replace('DB', '') })
                            } else {
                                arr.push({ kredit: mp2 })
                            }

                        } else {
                            arr.push({ saldo: mp2 })
                        }
                        batastgl = false;

                    } else {
                        arr.push(mp2)
                    }
                }


            })

            return arr;
        })
        let ulang1 = await ulang.map((mp1: any) => {
            let aryy: any = []
            mp1.map((mp2: any, key: number, values: any) => {
                if (key > 8) {
                    if (mp2?.kredit || mp2?.debit) {
                        if (Number(values[key - 2])) {
                            aryy[key - 11] = { cbg: values[key - 2] }
                        }
                        aryy.push(mp2)
                    } else {
                        aryy.push(mp2)
                    }
                }
            })
            return aryy
        })

        let saldoAwal = false;
        let penutup = false;
        let penutupTulis = false;
        let ulang2 = await ulang1.map((mp1: any) => {
            return mp1.map((mp2: any, key: number, values: any) => {
                if (mp2 == 'SALDO' && values[key + 2] == 'AWAL' && penutup) {
                    penutupTulis = true;
                    return { penutup: mp2 }
                } else {
                    if (penutupTulis) {
                        return { penutup: mp2 }
                    } else {
                        if (mp2 == 'SALDO' && values[key + 2] == 'AWAL') {
                            saldoAwal = true;
                            penutup = true
                        }
                        if (mp2?.kredit && saldoAwal) {
                            let dt = { saldo: mp2.kredit }
                            saldoAwal = false;
                            return dt
                        } else {
                            if (mp2?.tanggal || mp2?.saldo || mp2?.debit || mp2?.kredit || mp2?.cbg) {
                                return mp2;
                            } else {
                                return { keterangan: mp2 };
                            }
                        }
                    }
                }
            })
        })

        let result: any = [];
        let penyatuan: any = {}

        let penutupanArr = []
        let penutupanObj: any = {}
        await ulang2.map((mp: any) => {
            mp.map((mp1: any) => {
                if (mp1?.tanggal) {
                    if (penyatuan?.tanggal) {
                        result.push(penyatuan);
                        penyatuan = {};
                        penyatuan.tanggal = mp1.tanggal
                    } else {
                        penyatuan.tanggal = mp1.tanggal
                    }
                } else if (mp1?.keterangan) {
                    if (penyatuan.keterangan) {
                        penyatuan.keterangan = penyatuan.keterangan + ' ' + mp1.keterangan
                    } else {
                        penyatuan.keterangan = mp1.keterangan
                    }
                } else if (mp1?.debit) {
                    penyatuan.debit = numeral(mp1.debit).value()
                } else if (mp1?.kredit) {
                    penyatuan.kredit = numeral(mp1.kredit).value()
                } else if (mp1?.saldo) {
                    penyatuan.saldo = numeral(mp1.saldo).value()
                } else if (mp1?.cbg) {
                    penyatuan.cbg = mp1.cbg
                } else if (mp1?.penutup) {
                    if (!mp1?.penutup?.saldo) {
                        if (penutupanObj.title) {
                            penutupanObj.title = penutupanObj.title + ' ' + mp1?.penutup
                        } else {
                            penutupanObj.title = mp1?.penutup
                        }
                    } else {
                        penutupanObj.saldo = mp1?.penutup.saldo
                        penutupanArr.push(penutupanObj)
                        penutupanObj = {}
                    }

                }
            })

        });
        penutupanArr.push(penutupanObj)
        result.push(penyatuan);
        result.push(...penutupanArr);
        convertToExcel(result)
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

                    convertToPdfRekeningGiroBCA(textList)
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
                // await handleApi('proof', data);
            }

        } else {
            toast.error(`File tidak terdeteksi`);
        }

        val.target.value = '';
    }

    const importFile = (val: any) => {

        const RPtoNumber = (val: string) => {
            if (val) {
                let res = val.replaceAll(',', '').replaceAll('Rp', '').replaceAll('-', '');
                return Number(res)
            } else {
                return 0;
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

            pom.setAttribute('download', (localStorage.getItem('companyActive') ? (JSON.parse(localStorage.getItem('companyActive') as string)?.label) + '_' : '') + 'PK.csv');
            pom.click();
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

        const jenisFaktur = (val: any) => {
            if (val === 'Faktur Pajak') {
                return '0'
            } else if (val === 'Faktur Pajak Pengganti') {
                return '1'

            }
        }

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
                    })?.filter((cek: any) => {
                        if (cek !== "undefined_undefined") {
                            return cek;
                        }
                    });

                    let data: any = [];
                    let err: any = [];

                    let countRows = 2;

                    sampleArr.map((val: any, ii: number) => {
                        let sub: any = val.split('_');


                        let dtRes: any = rows.filter((vall: any, i: number) => {
                            if (vall["Tanggal"] && vall['No Faktur']) {
                                return vall["Tanggal"] == sub[0] && vall['No Faktur'] == sub[1];
                            }
                        });

                        if (dtRes.length) {
                            dtRes.map((valll: any, i: number) => {

                                if (!valll['Tanggal']) {
                                    err.push(countRows + " : " + "Cek Tanggal Tidak Ada");
                                }

                                if (!valll['No Faktur']) {
                                    err.push(countRows + " : " + "Cek No Faktur Tidak Ada");
                                }

                                if (!valll['NPWP/NIK']) {
                                    err.push(countRows + " : " + " Cek NPWP/NIK Tidak Ada");
                                }

                                if (!valll['Nama Barang']) {
                                    err.push(countRows + " : " + "Cek Nama Barang Tidak Ada");
                                }

                                if (!valll['Alamat']) {
                                    err.push(countRows + " : " + "Cek Alamat Tidak Ada");
                                }

                                if (!valll['Nama NPWP/NIK']) {
                                    err.push(countRows + " : " + "Cek Nama NPWP/NIK Tidak Ada");
                                }

                                if (!valll['Jenis Faktur']) {
                                    err.push(countRows + " : " + "Cek Jenis Faktur Tidak Ada");
                                }

                                if (!valll['Jenis Transaksi']) {
                                    err.push(countRows + " : " + "Cek Jenis Transaksi Tidak Ada");
                                }


                                let hargaSatuan = RPtoNumber(valll['Harga Satuan']);
                                let jumlahBarang = RPtoNumber(valll['Jumlah Barang']);
                                let hargaTotal = RPtoNumber(valll['Harga Total']);
                                let diskon = RPtoNumber(valll['Diskon']);
                                let dpp = Math.round(RPtoNumber(valll['DPP']));
                                let ppn = Math.round(RPtoNumber(valll['PPN']));
                                let tarif_ppnbm = RPtoNumber(valll['Tarif PPNBM']);
                                let ppnbm = Math.round(RPtoNumber(valll['PPNBM']));
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
                                let NpWp = valll['NPWP/NIK']?.replaceAll(',', '').replaceAll('.', '').replaceAll('-', '').replaceAll('"', '');
                                if (NpWp?.length === 15) {
                                    NPWPDetec = NpWp;
                                    NAMEDetec = valll['Nama NPWP/NIK']?.replaceAll(',', '').replaceAll('.', '').replaceAll('-', '').replaceAll('"', '');
                                } else if (valll['NPWP/NIK']?.length === 16) {
                                    NPWPDetec = '000000000000000';
                                    NAMEDetec = `${NpWp}#NIK#NAMA#${valll['Nama NPWP/NIK']?.replaceAll(',', '').replaceAll('.', '').replaceAll('-', '').replaceAll('"', '')}`;
                                } else {
                                    err.push(countRows + " : " + "NPWP Tidak Valid");
                                }

                                countRows++;

                                if (!i) {
                                    let jumlahPPN = 0;
                                    let jumlahPPNBM = 0;
                                    let jumlahDPP = 0;
                                    dtRes.map((vallll: any) => {
                                        jumlahDPP += Math.round(RPtoNumber(vallll['DPP']));
                                        jumlahPPNBM += Math.round(RPtoNumber(vallll['PPNBM']));
                                        jumlahPPN += Math.round(RPtoNumber(vallll['PPN']));
                                    });

                                    let totalPPN = Math.round(jumlahPPN);
                                    let totalPPNBM = Math.round(jumlahPPNBM);
                                    let totalDPP = Math.round(jumlahDPP);

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
                                        valll['Alamat']?.replaceAll(',', '').replaceAll('"', ''),
                                        totalDPP,
                                        totalPPN,
                                        totalPPNBM,
                                        IDKet ?? '',
                                        valll['FG Uang Muka'] ?? 0,
                                        valll['Uang Muka DPP'] ?? 0,
                                        valll['Uang Muka PPN'] ?? 0,
                                        valll['Uang Muka PPNBM'] ?? 0,
                                        valll['Referensi']?.replaceAll(',', '').replaceAll('"', '') ?? '',
                                        valll['Kode Dokumen Pendukung'] ?? ''
                                    ]);
                                    data.push([
                                        "OF",
                                        valll['Kode Barang']?.replaceAll(',', '').replaceAll('"', '') ?? '',
                                        valll['Nama Barang']?.replaceAll(',', '').replaceAll('"', ''),
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
                                        valll['Kode Barang']?.replaceAll(',', '').replaceAll('"', '') ?? '',
                                        valll['Nama Barang']?.replaceAll(',', '').replaceAll('"', ''),
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
                        }

                    })

                    let arrayFinal = [...subject, ...data];

                    if (err.length) {
                        toast.error(err.filter((value: any, index: any, array: any) => array.indexOf(value) === index).map((val: any) => {
                            return val + '\n'
                        }, {
                            duration: 6000,
                        }));

                    } else {
                        ConvertToCSV(arrayFinal);
                    }
                }
            }
            reader.readAsArrayBuffer(file);
            val.target.value = '';
        }

    };

    return (
        <>
            <div className="col-12">
                <h1 className="hp-mb-0 text-4xl font-bold">{Subject}</h1>
            </div>
            <div className="row mb-32 gy-32">
                <div className="col-12 mt-48">
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
                                    <input type="file" id="fileConvert" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style={{ display: "none" }} onChange={(val: any) => importFile(val)} />
                                </label>
                                <div className="text-center mt-1">
                                    <Link href="/format/Format Import Efaktur PK.xlsx">
                                        Example Format
                                    </Link>
                                </div>
                            </div>

                            <div className="mb-5">
                                <label htmlFor="fileConvert2">
                                    <span className="dropdown-item text-center rounded-lg  cursor-pointer" aria-hidden="true">Convert BCA Rekening Giro
                                        <div className="flex justify-center mt-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="50px" width="50px" version="1.1" id="Layer_1" viewBox="0 0 303.188 303.188" >
                                                <g>
                                                    <polygon style={{ fill: '#E8E8E8' }} points="219.821,0 32.842,0 32.842,303.188 270.346,303.188 270.346,50.525  " />
                                                    <path style={{ fill: '#FB3449' }} d="M230.013,149.935c-3.643-6.493-16.231-8.533-22.006-9.451c-4.552-0.724-9.199-0.94-13.803-0.936   c-3.615-0.024-7.177,0.154-10.693,0.354c-1.296,0.087-2.579,0.199-3.861,0.31c-1.314-1.36-2.584-2.765-3.813-4.202   c-7.82-9.257-14.134-19.755-19.279-30.664c1.366-5.271,2.459-10.772,3.119-16.485c1.205-10.427,1.619-22.31-2.288-32.251   c-1.349-3.431-4.946-7.608-9.096-5.528c-4.771,2.392-6.113,9.169-6.502,13.973c-0.313,3.883-0.094,7.776,0.558,11.594   c0.664,3.844,1.733,7.494,2.897,11.139c1.086,3.342,2.283,6.658,3.588,9.943c-0.828,2.586-1.707,5.127-2.63,7.603   c-2.152,5.643-4.479,11.004-6.717,16.161c-1.18,2.557-2.335,5.06-3.465,7.507c-3.576,7.855-7.458,15.566-11.815,23.02   c-10.163,3.585-19.283,7.741-26.857,12.625c-4.063,2.625-7.652,5.476-10.641,8.603c-2.822,2.952-5.69,6.783-5.941,11.024   c-0.141,2.394,0.807,4.717,2.768,6.137c2.697,2.015,6.271,1.881,9.4,1.225c10.25-2.15,18.121-10.961,24.824-18.387   c4.617-5.115,9.872-11.61,15.369-19.465c0.012-0.018,0.024-0.036,0.037-0.054c9.428-2.923,19.689-5.391,30.579-7.205   c4.975-0.825,10.082-1.5,15.291-1.974c3.663,3.431,7.621,6.555,11.939,9.164c3.363,2.069,6.94,3.816,10.684,5.119   c3.786,1.237,7.595,2.247,11.528,2.886c1.986,0.284,4.017,0.413,6.092,0.335c4.631-0.175,11.278-1.951,11.714-7.57   C231.127,152.765,230.756,151.257,230.013,149.935z M119.144,160.245c-2.169,3.36-4.261,6.382-6.232,9.041   c-4.827,6.568-10.34,14.369-18.322,17.286c-1.516,0.554-3.512,1.126-5.616,1.002c-1.874-0.11-3.722-0.937-3.637-3.065   c0.042-1.114,0.587-2.535,1.423-3.931c0.915-1.531,2.048-2.935,3.275-4.226c2.629-2.762,5.953-5.439,9.777-7.918   c5.865-3.805,12.867-7.23,20.672-10.286C120.035,158.858,119.587,159.564,119.144,160.245z M146.366,75.985   c-0.602-3.514-0.693-7.077-0.323-10.503c0.184-1.713,0.533-3.385,1.038-4.952c0.428-1.33,1.352-4.576,2.826-4.993   c2.43-0.688,3.177,4.529,3.452,6.005c1.566,8.396,0.186,17.733-1.693,25.969c-0.299,1.31-0.632,2.599-0.973,3.883   c-0.582-1.601-1.137-3.207-1.648-4.821C147.945,83.048,146.939,79.482,146.366,75.985z M163.049,142.265   c-9.13,1.48-17.815,3.419-25.979,5.708c0.983-0.275,5.475-8.788,6.477-10.555c4.721-8.315,8.583-17.042,11.358-26.197   c4.9,9.691,10.847,18.962,18.153,27.214c0.673,0.749,1.357,1.489,2.053,2.22C171.017,141.096,166.988,141.633,163.049,142.265z    M224.793,153.959c-0.334,1.805-4.189,2.837-5.988,3.121c-5.316,0.836-10.94,0.167-16.028-1.542   c-3.491-1.172-6.858-2.768-10.057-4.688c-3.18-1.921-6.155-4.181-8.936-6.673c3.429-0.206,6.9-0.341,10.388-0.275   c3.488,0.035,7.003,0.211,10.475,0.664c6.511,0.726,13.807,2.961,18.932,7.186C224.588,152.585,224.91,153.321,224.793,153.959z" />
                                                    <polygon style={{ fill: '#FB3449' }} points="227.64,25.263 32.842,25.263 32.842,0 219.821,0  " />
                                                    <g>
                                                        <path style={{ fill: '#A4A9AD' }} d="M126.841,241.152c0,5.361-1.58,9.501-4.742,12.421c-3.162,2.921-7.652,4.381-13.472,4.381h-3.643    v15.917H92.022v-47.979h16.606c6.06,0,10.611,1.324,13.652,3.971C125.321,232.51,126.841,236.273,126.841,241.152z     M104.985,247.387h2.363c1.947,0,3.495-0.546,4.644-1.641c1.149-1.094,1.723-2.604,1.723-4.529c0-3.238-1.794-4.857-5.382-4.857    h-3.348C104.985,236.36,104.985,247.387,104.985,247.387z" />
                                                        <path style={{ fill: '#A4A9AD' }} d="M175.215,248.864c0,8.007-2.205,14.177-6.613,18.509s-10.606,6.498-18.591,6.498h-15.523v-47.979    h16.606c7.701,0,13.646,1.969,17.836,5.907C173.119,235.737,175.215,241.426,175.215,248.864z M161.76,249.324    c0-4.398-0.87-7.657-2.609-9.78c-1.739-2.122-4.381-3.183-7.926-3.183h-3.773v26.877h2.888c3.939,0,6.826-1.143,8.664-3.43    C160.841,257.523,161.76,254.028,161.76,249.324z" />
                                                        <path style={{ fill: '#A4A9AD' }} d="M196.579,273.871h-12.766v-47.979h28.355v10.403h-15.589v9.156h14.374v10.403h-14.374    L196.579,273.871L196.579,273.871z" />
                                                    </g>
                                                    <polygon style={{ fill: '#D1D3D3' }} points="219.821,50.525 270.346,50.525 219.821,0  " />
                                                </g>
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
                                    <input type="file" id="fileConvert2" name="file" accept="application/pdf" style={{ display: "none" }} onChange={(val: any) => pdfRead(val)} />
                                </label>
                                <div className="text-center mt-1">
                                    <Link href="/format/Format BCA Rekening Giro.pdf">
                                        Example Format
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}