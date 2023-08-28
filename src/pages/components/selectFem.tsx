
import React, { useState, useRef, useEffect } from "react";
import { Select, Option, Input } from "@material-tailwind/react";

export default function SelectFem({
    search,
    create,
    multi,
    id,
    name,
    data,
    defaultValue,
    className,
    csrf_token,
    createUrl,
    method,
    api_token,
    datapost,
    setSearchValue,
    required,
    label
}: any) {


    return (
        <>
            <div className="container">
                <form>

                    <div className="form-group">
                        <input type="text" />
                        <label htmlFor="input" className="control-label">Textfield</label><i className="bar"></i>
                    </div>
                    <div className="form-group">
                        <textarea ></textarea>
                        <label htmlFor="textarea" className="control-label">Textarea</label><i className="bar"></i>
                    </div>
                </form>
            </div>
        </>
    )

}