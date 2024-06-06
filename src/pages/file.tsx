/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component, useEffect, useState, Fragment, ChangeEvent } from "react"
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import {
    Input, Textarea, Button,
    Popover,
    PopoverHandler,
    PopoverContent, Typography
} from "@material-tailwind/react";

import Select from "../components/reactSelect";
import ReactTable from "../components/reactTable";
import DebouncedInput from "../components/debouncedInput"
import Swal from "sweetalert2";
import Image from "next/image";

export default function File({ userData, setuserData }: any) {
    const [pagePermission, setpagePermission] = useState([]);
    const [dataCreate, setdataCreate] = useState();
    const [dataPermission, setdataPermission] = useState([]);
    const [refresh, setrefresh] = useState(true);
    const [currentFileView, setCurrentFileView] = useState<File[][]>([]);
    const URLAPI = "/api/file";
    const Subject = "Files";

    if (typeof document !== "undefined") {
        (document as any).title = Subject;
    }

    const handleApi = async (url: any, data: any = null) => {
        if (url === 'create_user') {
            try {
                await axios({
                    method: "POST",
                    url: "/api/user",
                    data: data,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    setdataCreate(res.data.data);
                    toast.success(res.data.massage);
                    ($('.btn-close') as any).trigger("click");
                    (document.getElementById('formCreate') as HTMLFormElement).reset();
                    handleApi('view_user')
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
    }

    useEffect(() => {
        const handleApiFirst = async (url: any, data: any = null) => {
            if (url === 'view_permission') {
                try {
                    await axios({
                        method: "GET",
                        url: "/api/permission",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }).then((res: any) => {
                        setdataPermission(res.data.data.map((val: any, i: number) => { return { label: val.name, value: val.name } }));
                    });
                } catch (error: any) {
                    toast.error(error.response.data.massage);
                }
            }
            try {
                await axios({
                    method: "GET",
                    url: URLAPI + "/" + JSON.parse(localStorage.getItem('companyActive') as string)?.label,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    if (currentFileView.length > 1) {
                        let datas: any = [];
                        currentFileView.map((mp: any, key: number) => {
                            if (key == 0) {
                                datas.push(res.data.data?.[0]?.children)
                            } else {
                                datas.push(mp)
                            }
                        })
                        setCurrentFileView(datas);
                    } else {
                        setCurrentFileView([res.data.data?.[0]?.children]);
                    }
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        }
        handleApiFirst('view_permission');
        setpagePermission(userData?.permission?.data?.map((val: any) => {
            return val.data.find((vall: any) => {
                if (vall.label == Subject) {
                    return vall;
                }
            })
        })?.filter((val: any) => val !== undefined)?.[0]?.checklist ?? [])
    }, [userData, refresh]);

    console.log(currentFileView);

    interface File {
        id: number;
        name: string;
        location: string;
        type: 'folder' | 'file';
        meta: {
            created: string;
            modified: string;
            size: string;
        };
        children?: any;
    }
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [breadcumb, setBreadcumb] = useState<string[]>([]);
    const [selectedFile, setSelectedFile] = useState<number | undefined>();
    const [selectedFileData, setselectedFileData] = useState<any>();
    const [searchValue, setSearchValue] = useState<string>('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const handleFolderClick = (file: File) => {
        if (file.type !== 'folder' || !file.children) return;
        setCurrentFileView((state) => [...state, file.children]);
        setCurrentIndex(currentIndex + 1);
        setBreadcumb((state) => [...state, file.name]);
    };

    const handleSelectFile = (file: File) => {
        setSelectedFile(file.id);
        setselectedFileData(file);
    };

    const handleBackClick = () => {
        breadcumb.pop();
        setBreadcumb([...breadcumb]);
        setselectedFileData(currentFileView[currentIndex > 0 ? currentIndex - 1 : 0]);
        setCurrentFileView(currentFileView.filter((f: any, k: number) => k !== currentIndex))
        setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const CustomMenu = ({ handleMenuItemClick, menuPosition }: any) => {
        const menuItems = selectedFileData?.type == 'file' ? ['Delete', 'Download'] : ['Delete'];
        const handleClick = (item: any) => {
            handleMenuItemClick(item);
        };

        return (
            <div className="custom-menu rounded shadow bg-white absolute  z-50" style={{ left: menuPosition.x, top: menuPosition.y }}>
                {menuItems.map((item) => (
                    <div className="cursor-pointer rounded px-4 py-2  hover:bg-gray-400 flex" key={item} onClick={() => handleClick(item)}>
                        {item == 'Delete' ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-600 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg> :
                            item == 'Rename' ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600  mr-2">
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                            </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-600 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                        } {item}
                    </div>
                ))}
            </div>
        );
    }

    const handleAction = async (data: any, type: any) => {
        let split_text: any = (data.location ?? JSON.parse(localStorage.getItem('companyActive') as string)?.label)?.split('\\')
        split_text.splice(split_text.length - 1, 1);
        let locationBefore = split_text.join('\\');
        if (type == 'delete') {
            Swal.fire({
                icon: "info",
                title: "Delete !!!",
                text: `Are You sure want to delete ${data.name ?? ''} ?`,
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#686868",
                confirmButtonText: "Delete",
            }).then(async (result: any) => {
                if (result.isConfirmed) {
                    try {
                        await axios({
                            method: "POST",
                            url: "/api/file",
                            data: {
                                type: 'delete',
                                location: data.location,
                                locationBefore,
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`
                            }
                        }).then((res: any) => {
                            toast.success(res.data.massage);
                            let datas: any = [];
                            currentFileView.map((mp: any, key: number) => {
                                if (key == currentFileView.length - 1) {
                                    datas.push([...res.data.data.filter((f: any) => f.location !== data.location)])
                                } else {
                                    datas.push(mp)
                                }
                            })
                            setselectedFileData(datas.find((f: any) => f.location === locationBefore))
                            setCurrentFileView(datas)
                            setrefresh(!refresh)
                        });
                    } catch (error: any) {
                        toast.error(error.response.data.massage);
                    }
                }
            });
        } else if (type == 'rename') {

        } else if (type == 'upload') {

            var formData = new FormData();
            for (let index = 0; index < data.file.length; index++) {
                formData.append('files', data.file[index]);

            }
            formData.append("type", type);
            formData.append("location", data.location ?? JSON.parse(localStorage.getItem('companyActive') as string)?.label);
            formData.append("locationBefore", locationBefore);

            try {
                await axios({
                    method: "POST",
                    url: "/api/file",
                    data: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res: any) => {
                    toast.success(res.data.massage);
                    let data: any = [];
                    currentFileView.map((mp: any, key: number) => {
                        if (key == currentFileView.length - 1) {
                            data.push([...res.data.data])
                        } else {
                            data.push(mp)
                        }
                    })
                    setCurrentFileView(data);
                    (document.getElementById('upload') as HTMLInputElement).value = "";
                    setrefresh(!refresh)
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }

        } else if (type == 'create_folder') {
            try {
                await axios({
                    method: "POST",
                    url: "/api/file",
                    data: {
                        type: type,
                        location: data.location ?? JSON.parse(localStorage.getItem('companyActive') as string)?.label,
                        name: data.nameFolder,
                        locationBefore,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then((res: any) => {
                    toast.success(res.data.massage);
                    let data: any = [];
                    currentFileView.map((mp: any, key: number) => {
                        if (key == currentFileView.length - 1) {
                            data.push([...res.data.data])
                        } else {
                            data.push(mp)
                        }
                    })
                    setCurrentFileView(data)
                    setrefresh(!refresh)
                });
            } catch (error: any) {
                toast.error(error.response.data.massage);
            }
        } else {
            window.location.href = "/files/" + data.location;
        }

    }


    const handleMenuItemClick = (item: any, data: any) => {
        switch (item) {
            case 'Delete':
                handleAction(selectedFileData, 'delete');
                break;
            case 'Rename':
                handleAction(selectedFileData, 'rename');
                break;
            default:
                handleAction(selectedFileData, 'Download');
                break;
        }
        setMenuVisible(false);
    };

    const handleOutsideClick = (e: any) => {
        if (!e.target.closest('.custom-menu')) {
            setMenuVisible(false);
            document.removeEventListener('click', handleOutsideClick);
        }
    };
    const handleContextMenu = (e: any, data: any) => {
        handleSelectFile(data);
        e.preventDefault();
        setMenuVisible(true);
        // Store the mouse coordinates
        const mouseY = e.clientY - 150;
        let width = window.innerWidth;
        let mouseX = e.clientX
        if (width > 1024) {
            mouseX = e.clientX - 360;
        } else {
            mouseX = e.clientX;
        }
        setMenuPosition({ x: mouseX, y: mouseY });
        document.addEventListener('click', handleOutsideClick);
    };


    return (
        <>
            <div className="col-12 mb-5">
                <h1 className="hp-mb-0 text-4xl font-bold" id="subject">{Subject}</h1>
            </div>
            <div className="row mb-32 gy-32">
                <div className="col-12">
                    <div className="card hp-contact-card mb-32 -mt-3 shadow-md">
                        <div className="card-body px-0">
                            <div className="file-manager-container">
                                <div className="header">
                                    <div className="breadcumb">
                                        <span
                                            onClick={() => {
                                                setBreadcumb([]);
                                                setCurrentIndex(0);
                                            }}
                                        >
                                            {JSON.parse(localStorage.getItem('companyActive') as string)?.label}
                                        </span>
                                        {breadcumb.map((b, i) => {
                                            return (
                                                <Fragment key={b}>
                                                    <b>/</b>
                                                    <span
                                                        onClick={() => {
                                                            const index = breadcumb.indexOf(b);
                                                            if (index > -1) {
                                                                breadcumb.splice(index + 1);
                                                            }
                                                            setBreadcumb([...breadcumb]);
                                                            setCurrentIndex(i + 1);
                                                        }}
                                                    >
                                                        {b.toLowerCase()}
                                                    </span>
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                    <div className="search-container flex items-center gap-2 text-center">
                                        {/* {currentFileView.length == 1 ? */}
                                        <Popover placement="bottom"
                                            animate={{
                                                mount: { scale: 1, y: 0 },
                                                unmount: { scale: 0, y: 25 },
                                            }}>
                                            <PopoverHandler>
                                                <Button className="w-80 " variant="gradient" color="cyan" > Create Folder</Button>
                                            </PopoverHandler>
                                            <PopoverContent className="w-96 p-3">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="mb-1 font-bold"
                                                >
                                                    Name Folder
                                                </Typography>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="nameFolder"
                                                        size="lg"
                                                        variant="standard"
                                                        placeholder="name"
                                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900 border-b-1"
                                                        labelProps={{
                                                            className: "before:content-none after:content-none",
                                                        }}
                                                    />
                                                    <Button onClick={() => {
                                                        handleAction({ ...selectedFileData, nameFolder: (document.getElementById('nameFolder') as HTMLInputElement)?.value }, 'create_folder');
                                                        (document.getElementById('nameFolder') as HTMLInputElement).value = ""
                                                    }} className="w-32 h-10 mt-2 " variant="gradient" color="cyan" >
                                                        Create
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        {/* : null} */}
                                        <input onChange={(val: any) => handleAction({
                                            ...selectedFileData, file: val.target.files
                                        }, 'upload')} type="file" multiple className="hidden" name="upload" id="upload" />
                                        <Button className="w-80 cursor-pointer" variant="gradient" color="cyan" >
                                            <label htmlFor="upload" className=" cursor-pointer">
                                                Upload File
                                            </label>
                                        </Button>
                                        <input
                                            type="text"
                                            placeholder="Search files..."
                                            onChange={handleSearch}
                                            value={searchValue}
                                        />
                                    </div>
                                </div>

                                <div className="body">
                                    <div className="file-container-headers">
                                        <div>File</div>
                                        <div>Size</div>
                                        <div>Modified</div>
                                    </div>
                                    {currentIndex > 0 && (
                                        <div
                                            className="files-list"
                                            style={{ marginBottom: "0px", height: "35px" }}
                                            onClick={() => handleBackClick()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                            </svg>

                                        </div>
                                    )}
                                    {menuVisible && <CustomMenu handleMenuItemClick={handleMenuItemClick} menuPosition={menuPosition} />}
                                    {currentFileView[currentIndex]?.filter((file) =>
                                        file.name.toLowerCase().includes(searchValue.toLowerCase())
                                    ).map((file) => {
                                        return (
                                            <div
                                                key={file.id + file.name ?? "0000"}
                                                className={`files-list ${file.id === selectedFile ? 'active' : ''}`}
                                                onClick={() => handleSelectFile(file)}
                                                onDoubleClick={() => handleFolderClick(file)}
                                                onContextMenu={(e: any) => handleContextMenu(e, file)}
                                            >
                                                <div className={`file-container`}>
                                                    <div className={`${file.type}`}></div>
                                                    <div className={`filename`} style={{ pointerEvents: 'none' }}>
                                                        {file.name}
                                                    </div>
                                                </div>
                                                <div className="size">{file.meta.size}</div>
                                                <div className="date">{file.meta.modified}</div>
                                            </div>
                                        );
                                    })}
                                    {!currentFileView.length || !currentFileView?.[0].length ? <div className="text-center w-full text-gray-500">
                                        <div className="flex justify-center mt-1 -mb-7 ">
                                            <Image src="/img/noResult.gif" width={200} height={200} alt="noResult" /> </div>
                                        <div className="text-lg">No results found</div>
                                    </div> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

