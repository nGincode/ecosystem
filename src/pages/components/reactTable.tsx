/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component, useEffect, useState, useReducer, useMemo } from "react"
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2'

import Select from "./reactSelect";


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

export default function ReactTable({ search, action, modalData, dataFatch, urlFatch }: any) {
    const [dataEdit, setdataEdit] = useState<any>();
    const [click, setclick] = useState<any>();
    const [data, setdata] = useState<any>();
    const [pageActive, setpageActive] = useState<any>();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    useEffect(() => {
        setGlobalFilter(search);
    }, [search]);


    useEffect(() => {
        handleApi('view')
    }, [])

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
                } else {
                    array.push({
                        accessorKey: val,
                        header: () => <div>{convertCamelCase(val)}</div>,
                        cell: (info: any) => info.getValue() ?? '-',
                        footer: (props: any) => props.column.id,
                    })
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

    if (data) {
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
                <div className="flex items-center gap-2 mt-3 ml-5">
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
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" >
                            <div className="modal-header py-16 px-24">
                                <h5 className="modal-title" id="editUserLabel">Edit Users</h5>
                                <button type="button" className="btn-close hp-bg-none d-flex align-items-center justify-content-center" data-bs-dismiss="modal" aria-label="Close">
                                    <i className="ri-close-line hp-text-color-dark-0 lh-1" style={{ fontSize: "24px" }}></i>
                                </button>
                            </div>

                            <div className="divider m-0"></div>

                            <form onSubmit={handleSubmit} id="editForm">
                                <div className="modal-body">
                                    <div className="row gx-8">
                                        {modalData.length ? modalData?.map((val: any, i: number) => {
                                            return <div className="col-12 col-md-6" key={i}>
                                                {
                                                    val.type === 'text' ?
                                                        <div className="mb-24">
                                                            <label htmlFor={val.id} className="form-label">
                                                                <span className="text-danger me-4">*</span>
                                                                {convertCamelCase(val.name)}
                                                            </label>
                                                            <input type={val.type} defaultValue={dataEdit?.[val.name]} className="form-control" name={val.name} id={val.id} />
                                                        </div>
                                                        : val.type === 'email' ?
                                                            <div className="mb-24">
                                                                <label htmlFor={val.id} className="form-label">
                                                                    <span className="text-danger me-4">*</span>
                                                                    {convertCamelCase(val.name)}
                                                                </label>
                                                                <input type={val.type} defaultValue={dataEdit?.[val.name]} className="form-control" name={val.name} id={val.id} />
                                                            </div>
                                                            : val.type === 'date' ?
                                                                <div className="mb-24">
                                                                    <label htmlFor={val.id} className="form-label">
                                                                        <span className="text-danger me-4">*</span>
                                                                        {convertCamelCase(val.name)}
                                                                    </label>
                                                                    <input type={val.type} defaultValue={dataEdit?.[val.name]} className="form-control" name={val.name} id={val.id} />
                                                                </div>
                                                                : val.type === 'textarea' ?
                                                                    <div className="mb-24">
                                                                        <label htmlFor={val.id} className="form-label">
                                                                            <span className="text-danger me-4">*</span>
                                                                            {convertCamelCase(val.name)}
                                                                        </label>
                                                                        <textarea id={val.id} name={val.name} className="form-control" defaultValue={dataEdit?.[val.name]}></textarea>
                                                                    </div>
                                                                    : val.type === 'reactSelect' ?
                                                                        <div className="mb-24">
                                                                            <label htmlFor={val.id} className="form-label">
                                                                                <span className="text-danger me-4">*</span>
                                                                                {convertCamelCase(val.name)}
                                                                            </label>
                                                                            <Select
                                                                                id={val.id}
                                                                                name={val.name}
                                                                                data={val.select}
                                                                                defaultValue={dataEdit?.[val.name] ? { label: convertCamelCase(dataEdit?.[val.name]), value: dataEdit?.[val.name] } : ''} />
                                                                        </div>
                                                                        : null
                                                }</div>
                                        }) : null}
                                    </div>
                                </div>
                                <div className="modal-footer pt-0 px-24 pb-24">
                                    <div className="divider"></div>
                                    <button type="submit" className="m-0 btn btn-primary w-100">Edit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return <div className="text-center">Not data</div>
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