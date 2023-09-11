/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component, useEffect, useState, useReducer, useMemo } from "react"
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'
import moment from "moment";


import { Input, Textarea, Button, Checkbox, IconButton } from "@material-tailwind/react";

import Select from "./reactSelect";
import Cekbox from "./cekBox";


import {
    Column,
    Table,
    useReactTable,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    sortingFns,
    getSortedRowModel,
    FilterFn,
    SortingFn,
    ColumnDef,
    flexRender,
    FilterFns,
} from '@tanstack/react-table'

import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils'


declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
        itemRank,
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0

    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank!,
            rowB.columnFiltersMeta[columnId]?.itemRank!
        )
    }

    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const convertCamelCase = (text: any) => {
    if (text) {
        const result = text.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    } else {
        return '';
    }
}

export default function ReactTable({ search, action, modalData, dataFatch, urlFatch, Subject, reload }: any) {
    const [dataEdit, setdataEdit] = useState<any>();
    const [click, setclick] = useState<any>();
    const [data, setdata] = useState<any>([]);
    const [pageActive, setpageActive] = useState<any>();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    useEffect(() => {
        setGlobalFilter(search);
    }, [search]);

    useEffect(() => {
        handleApi('view')
    }, [reload])

    const handleSubmit = (event: any) => {
        event.preventDefault();
        let dataPost = new FormData(($("#editForm") as any)[0]);
        handleApi('edit', urlFatch, dataEdit.uuid, dataPost);
    }

    const handleStatus = (type: any, url: any, dataHandle: any) => {
        setclick({ type: type, url: url, uuid: dataHandle.uuid })
        if (type === 'edit') {
            setdataEdit(dataHandle);
        } else {
            Swal.fire({
                icon: "info",
                title: "Delete data !!!",
                text: `Are You sure want to delete ${dataHandle.name ?? ''} ?`,
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#686868",
                confirmButtonText: "Delete",
            }).then((result: any) => {
                if (result.isConfirmed) {
                    handleApi('delete', url, dataHandle.uuid, dataHandle)
                }
            });
        }
    }

    let array: any = [];
    if (data?.[0]) {
        Object.keys(data[0]).map((val: any, i: number) => {
            if (val !== 'uuid') {
                if (val !== 'addressJson') {
                    if (val === 'img') {
                        array.push({
                            id: 'img',
                            header: () => null,
                            cell: ({ row }: any) => {
                                if (row.original.img) {
                                    return <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle"><img src={row.original.img} alt={row.original.name} />
                                    </div>
                                } else {
                                    return <div className="avatar-item avatar-lg d-flex align-items-center justify-content-center bg-primary-4 hp-bg-dark-primary text-primary hp-text-color-dark-0 rounded-circle">{(row.original.name ?? row.original.username).substring(0, 2)}</div>
                                }
                            },
                            footer: (props: any) => props.column.id,
                        })
                    } else if (val === 'status') {
                        array.push({
                            accessorKey: val,
                            header: () => <div>{convertCamelCase(val)}</div>,
                            cell: ({ row }: any) => {
                                if (row.original.status === 'active') {
                                    return <div className="badge bg-success-4 hp-bg-dark-success text-success border-success">active</div>
                                } else if (row.original.status === 'pending') {
                                    return <div className="badge bg-warning-4 hp-bg-dark-warning text-warning border-warning">pending</div>
                                } else if (row.original.status === 'inactive') {
                                    return <div className="badge bg-danger-4 hp-bg-dark-danger text-danger border-danger">inactive</div>
                                }
                            },
                            footer: (props: any) => props.column.id,
                        })
                    } else if (val === 'permission') {
                        array.push({
                            accessorKey: val,
                            header: () => <div>{convertCamelCase(val)}</div>,
                            cell: ({ row }: any) => {
                                return row.original.permission.map((vall: any, i: number) => {
                                    return (<div key={i}>
                                        {vall.check ?
                                            <>
                                                {vall.data.map((map: any, ii: number) => {
                                                    let check = false;
                                                    let view = map.checklist.find((find: any) => find == 'create') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg> : null;
                                                    let create = map.checklist.find((find: any) => find == 'create') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                                        </svg> : null;
                                                    let edit = map.checklist.find((find: any) => find == 'edit') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                                            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                                        </svg> : null;
                                                    let del = map.checklist.find((find: any) => find == 'delete') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg> : null;
                                                    if (view) {
                                                        check = true;
                                                    }
                                                    if (check)
                                                        return <div key={ii} className="flex  w-full">
                                                            <div className="w-full">{vall.label} {map.label}
                                                                <div className="float-right w-13 flex">
                                                                    {view}
                                                                    {create}
                                                                    {edit}
                                                                    {del}
                                                                </div></div>
                                                        </div>;
                                                })}
                                            </> : null}</div>)
                                })
                            },
                            footer: (props: any) => props.column.id,
                        })
                    } else {
                        array.push({
                            accessorKey: val,
                            header: () => <div>{val === "npwp" ? "NPWP" : convertCamelCase(val)}</div>,
                            cell: (info: any) => info.getValue() ?? '-',
                            footer: (props: any) => props.column.id,
                        })
                    }
                }
            }
        });
    }

    const columns = [
        ...array,
        {
            id: 'action',
            header: () => null,
            cell: ({ row }: any) => {
                if (action.edit && action.delete) {
                    return <>
                        <i onClick={() => { handleStatus('edit', action.edit, row.original) }} data-bs-toggle="modal" data-bs-target="#editUser" className="iconly-Curved-Edit hp-cursor-pointer hp-transition hp-hover-text-color-primary-1 text-black-80" style={{ fontSize: "24px" }} />
                        <i onClick={() => { handleStatus('delete', action.delete, row.original) }} className="ml-2 iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }} />
                    </>
                } else {
                    if (action.edit) {
                        return <i onClick={() => { handleStatus('edit', action.edit, row.original) }} data-bs-toggle="modal" data-bs-target="#editUser" className="iconly-Curved-Edit hp-cursor-pointer hp-transition hp-hover-text-color-primary-1 text-black-80" style={{ fontSize: "24px" }} />
                    } else if (action.delete) {
                        return <i onClick={() => { handleStatus('delete', action.delete, row.original) }} className="iconly-Light-Delete hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 text-black-80" style={{ fontSize: "24px" }} />
                    } else {
                        return "-"
                    }
                }

            },
        }];

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    })

    useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }])
            }
        }
    }, [table.getState().columnFilters[0]?.id])

    const handleApi = async (type: any, urlData: any = null, uuid: any = null, dataPost: any = null) => {
        if (type === 'edit') {
            try {
                await axios({
                    method: "PUT",
                    url: urlData + '/' + uuid,
                    data: dataPost,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    toast.success(res.data.massage);
                    handleApi('view');
                    ($('.btn-close') as any).trigger("click");
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (type === 'delete') {
            try {
                await axios({
                    method: "DELETE",
                    url: urlData + uuid,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    toast.success(res.data.massage);
                    handleApi('view')
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else if (type === 'view') {
            try {
                await axios({
                    method: "GET",
                    url: urlFatch,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdata(res.data.data)
                    if (pageActive) table.setPageIndex(pageActive);
                });
            } catch (error: any) {
                // toast.error(error.response.data.massage);
                console.log(error)
            }
        }
    }



    if (data.length) {
        ($("#nophoneEdit") as any).mask("(+62) 000-0000-0000");
        return (
            <>
                <div className="table-responsive">
                    <table className="table align-middle table-hover table-borderless">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <th key={header.id} colSpan={header.colSpan}>
                                                {header.isPlaceholder ? null : (
                                                    <>
                                                        <div
                                                            {...{
                                                                className: header.column.getCanSort()
                                                                    ? 'cursor-pointer select-none text-center'
                                                                    : '',
                                                                onClick: header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                            {{
                                                                asc: ' 🔼',
                                                                desc: ' 🔽',
                                                            }[header.column.getIsSorted() as string] ?? null}
                                                        </div>
                                                        {header.column.getCanFilter() ? (
                                                            <div className="mt-2">
                                                                <Filter column={header.column} table={table} />
                                                            </div>
                                                        ) : null}
                                                    </>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => {
                                return (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => {
                                            return (
                                                <td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="h-2" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 ml-5">
                    <button
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => { table.nextPage(); setpageActive(table.getState().pagination.pageIndex + 1) }}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()} |  Total {table.getPrePaginationRowModel().rows.length} Rows
                        </strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            className="border p-1 rounded w-16"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal fade" id="editUser" tabIndex={-1} aria-labelledby="editUserLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content" >
                            <div className="modal-header py-16 px-24">
                                <h5 className="modal-title font-bold" id="editUserLabel">Edit {Subject}</h5>
                                <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                    <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                </button>
                            </div>

                            <div className="divider m-0"></div>

                            <form onSubmit={handleSubmit} id="editForm">
                                <div className="modal-body">
                                    <div className="row gx-8">
                                        {modalData ? modalData?.map((val: any, i: number) => {
                                            console.log(dataEdit)

                                            return <div className={val.full ? "col-12 col-md-12" : "col-12 col-md-6"} key={i}>
                                                {
                                                    val.type === 'text' || val.type === 'number' || val.type === 'email' || val.type === 'date' ?
                                                        <div className="mb-24">
                                                            <Input required={val.required} label={convertCamelCase(val.name)} variant="standard" className="border-b-1" type={val.type} defaultValue={val.type === 'date' ? dataEdit?.[val.name] ? moment(dataEdit?.[val.name], 'DD/MM/YYYY').format('YYYY-MM-DD') : dataEdit?.[val.name] : dataEdit?.[val.name]} name={val.name} id={`${val.id}Edit`} />
                                                        </div>
                                                        : val.type === 'group' ?
                                                            <div className="mb-24">
                                                                {val.label || val.name ?
                                                                    <label htmlFor={val.id} className="form-label">
                                                                        <span className="text-danger me-4">*</span>
                                                                        {convertCamelCase(val.label ?? val.name)}
                                                                    </label>
                                                                    : null}
                                                                <div className="input-group">
                                                                    {val.group.map((vall: any, ii: number) => {
                                                                        return (<input key={ii} type={vall.type} required={val.required} defaultValue={dataEdit?.address ? dataEdit?.addressJson[vall.name] : dataEdit?.[val.name]} readOnly={vall.readOnly} placeholder={vall.placeholder} name={vall.name} className="form-control" />)
                                                                    })}
                                                                </div>
                                                            </div>
                                                            : val.type === 'textarea' ?
                                                                <div className="mb-24">
                                                                    <Textarea required={val.required} label={convertCamelCase(val.name)} variant="standard" className="border-b-1" defaultValue={dataEdit?.[val.name]} name={val.name} id={`${val.id}Edit`} />
                                                                </div>
                                                                : val.type === 'reactSelect' ?
                                                                    <div className="mb-24">
                                                                        <Select
                                                                            id={`${val.id}Edit`}
                                                                            name={val.name}
                                                                            data={val.select}
                                                                            required={val.required}
                                                                            label={convertCamelCase(val.name)}
                                                                            defaultValue={dataEdit?.[val.name] ? { label: convertCamelCase(dataEdit?.[val.name]), value: dataEdit?.[val.name] } : ''} />
                                                                    </div>
                                                                    : val.type === 'address' ?
                                                                        <div className="w-full">
                                                                            <div className="mb-3">
                                                                                <div className="border-1 border-gray-500 p-2 rounded-lg shadow-sm">
                                                                                    <label className="-mt-5 absolute bg-white px-1 text-gray-500">Address</label>
                                                                                    <div className="xl:flex">
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.jalan} required name='jalan' className="border-b-1" type="text" variant="standard" label="Jalan" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.block} required name='block' className="border-b-1" type="text" variant="standard" label="Block" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.no} required name='no' className="border-b-1" type="number" variant="standard" label="No" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.rt} required name='rt' className="border-b-1" type="number" variant="standard" label="RT" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.rw} required name='rw' className="border-b-1" type="number" variant="standard" label="RW" /></div>
                                                                                    </div>
                                                                                    <div className="xl:flex">
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.kec} required name='kec' className="border-b-1" type="text" variant="standard" label="Kecamatan" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.kel} required name='kel' className="border-b-1" type="text" variant="standard" label="Keluarahan" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.prov} required name='prov' className="border-b-1" type="text" variant="standard" label="Provinsi" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.kabkot} required name='kabkot' className="border-b-1" type="text" variant="standard" label="Kabupaten/Kota" /></div>
                                                                                        <div className="mt-3 w-full"><Input defaultValue={dataEdit?.addressJson?.kodepos} required name='kodepos' className="border-b-1" type="number" variant="standard" label="Kode POS" /></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        : val.type === 'permission' ? <div>
                                                                            <input type="hidden" value={JSON.stringify(val.data)} name="format" />

                                                                            <div className="flex mb-3">
                                                                                <div className="w-1/2"></div>
                                                                                <div className="w-1/6 justify-center flex">
                                                                                    <IconButton size="sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                    </svg>
                                                                                    </IconButton>
                                                                                </div>
                                                                                <div className="w-1/6 justify-center flex">

                                                                                    <IconButton color="blue" size="sm">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                                                                        </svg>
                                                                                    </IconButton>
                                                                                </div>
                                                                                <div className="w-1/6  justify-center flex">
                                                                                    <IconButton color="green" size="sm">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                                                            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                                                                            <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                                                                                        </svg>
                                                                                    </IconButton>
                                                                                </div>
                                                                                <div className="w-1/6  justify-center flex">
                                                                                    <IconButton color="red" size="sm">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                        </svg>
                                                                                    </IconButton>
                                                                                </div>
                                                                            </div>
                                                                            {val.data.map((val: any, i: number) => {
                                                                                return (<div key={i}>
                                                                                    <div className="flex mt-3 font-bold">
                                                                                        <div className="w-1/2">{val.label}</div>
                                                                                    </div>
                                                                                    {val.data.map((vall: any, ii: number) => {
                                                                                        let perm = dataEdit?.permission.find((fill: any) => fill.label === val.label)?.data?.find((fil: any) => fil.name === vall.name);

                                                                                        return (
                                                                                            <div key={ii} className="flex mt-1">
                                                                                                <div className="w-1/2 ml-2 m-auto">- {vall.label}</div>
                                                                                                <div className="w-1/6 justify-center flex">
                                                                                                    <Cekbox name={vall.name} id={dataEdit?.name + val.label + vall.name + ii + 1} checked={perm?.checklist.find((fil: any) => fil === 'view') ? true : false} />
                                                                                                </div>
                                                                                                <div className="w-1/6 justify-center flex">
                                                                                                    <Cekbox color="blue" name={vall.name} id={dataEdit?.name + val.label + vall.name + ii + 2} checked={perm?.checklist.find((fil: any) => fil === 'create') ? true : false} />
                                                                                                </div>
                                                                                                <div className="w-1/6  justify-center flex">
                                                                                                    <Cekbox color="green" name={vall.name} id={dataEdit?.name + val.label + vall.name + ii + 3} checked={perm?.checklist.find((fil: any) => fil === 'edit') ? true : false} />
                                                                                                </div>
                                                                                                <div className="w-1/6  justify-center flex">
                                                                                                    <Cekbox color="red" name={vall.name} id={dataEdit?.name + val.label + vall.name + ii + 4} checked={perm?.checklist.find((fil: any) => fil === 'delete') ? true : false} />
                                                                                                </div>
                                                                                            </div>)
                                                                                    })}
                                                                                </div>)
                                                                            })}
                                                                        </div> : null
                                                }</div>
                                        }) : null}
                                    </div>
                                </div>
                                <div className="modal-footer pt-0 px-24 pb-24">
                                    <div className="divider"></div>
                                    <Button type="submit" className="w-full" color="blue">Edit</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return <div className="text-center w-full text-gray-500">
            <div className="flex justify-center "><svg xmlns="http://www.w3.org/2000/svg" className="svg-icon" style={{ width: "10em", height: "10em", verticalAlign: "middle", fill: "currentColor", overflow: "hidden" }} viewBox="0 0 1024 1024" version="1.1"><path d="M672 128a32 32 0 0 1 32 32v256h54.56a32 32 0 0 1 22.496 9.248l137.44 135.872a32 32 0 0 1 9.504 22.752V896a32 32 0 0 1-32 32H448a32 32 0 0 1-32-32v-64H128a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h544z" fill="#FFFFFF" /><path d="M672 128a32 32 0 0 1 32 32v256h-32V160H128v640h288v32H128a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h544z" fill="#808FA1" /><path d="M758.56 416a32 32 0 0 1 22.496 9.248l137.44 135.872a32 32 0 0 1 9.504 22.752V896a32 32 0 0 1-32 32H448a32 32 0 0 1-32-32V448a32 32 0 0 1 32-32h310.56zM896 583.872L758.56 448H448v448h448v-312.128z" fill="#5D6D7E" /><path d="M592 352a16 16 0 0 1 2.88 31.744L592 384h-384a16 16 0 0 1-2.88-31.744L208 352h384z m-96-96a16 16 0 0 1 2.88 31.744L496 288h-288a16 16 0 0 1-2.88-31.744L208 256h288z" fill="#95A1AF" /><path d="M527.488 496a16 16 0 0 1 15.744 13.12l0.256 2.88v96a16 16 0 0 1-31.744 2.88l-0.256-2.88v-96a16 16 0 0 1 16-16z m64 0a16 16 0 0 1 15.712 13.12l0.256 2.88v96a16 16 0 0 1-31.744 2.88l-0.256-2.88v-96a16 16 0 0 1 16-16z" fill="#808FA1" /><path d="M800 704a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32h-256a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h256z m0 32h-256v64h256v-64z" fill="#32AD99" /></svg>
            </div>
            <div className="ml-2">No results found</div></div>
    }
}

function Filter({
    column,
    table,
}: {
    column: Column<any, unknown>
    table: Table<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () =>
            typeof firstValue === 'number'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column.getFacetedUniqueValues()]
    )

    return typeof firstValue === 'number' && column.id !== 'phone' ? (
        <div className="text-center">
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
                        ? `(${column.getFacetedMinMaxValues()?.[0]})`
                        : ''
                        }`}
                    className="w-24 border text-xs p-1 rounded"
                />
                <DebouncedInput
                    type="number"
                    min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                    max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
                        ? `(${column.getFacetedMinMaxValues()?.[1]})`
                        : ''
                        }`}
                    className="w-24 border text-xs p-1 rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : (
        <div className="text-center">
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.slice(0, 5000).map((value: any, i: number) => (
                    <option value={value} key={i} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-36 border rounded p-1 text-xs"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </div>
    )
}

// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}