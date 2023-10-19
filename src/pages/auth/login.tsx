import {
    Button, Badge, Input, Textarea,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    IconButton
} from "@material-tailwind/react";
import Image from "next/image";

export default function login({ submitLogin }: any) {

    if (typeof document !== "undefined") {
        (document as any).title = "EcoSystem";
    }

    return (

        <div className="row hp-authentication-page ">
            <div className=" hp-bg-black-20 hp-bg-color-dark-90 col-lg-6 col-12 d-none d-lg-block">
                <div className="row hp-image-row h-100 px-8 px-sm-16 px-md-0 pb-32 pb-sm-0 pt-32 pt-md-0">
                    <div className="hp-logo-item m-16 m-sm-32 m-md-64 w-auto px-0 col-12">
                        <div className="hp-header-logo d-flex align-items-center">
                        </div>
                    </div>

                    <div className="col-12 px-0">
                        <div className="row h-100 w-100 mx-0 align-items-center justify-content-center">
                            <div className="hp-bg-item text-center mb-32 mb-md-0 px-0 col-12">
                                <Image className="hp-dark-none m-auto w-100" width={100} height={100} src="/app-assets/img/pages/authentication/authentication-bg.svg" alt="Background Image" />
                                <Image className="hp-dark-block m-auto w-100" width={100} height={100} src="/app-assets/img/pages/authentication/authentication-bg-dark.svg" alt="Background Image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-6 py-sm-64 py-lg-0">
                <div className="row align-items-center justify-content-center h-100 mx-4 mx-sm-n32">
                    <div className="col-12 col-md-9 col-xl-7 col-xxxl-5 px-8 px-sm-0 pt-24 pb-48">
                        <div className="flex justify-center w-full mb-5 ">
                            <Image src="/img/logo.png" width={150} height={150} alt="logo" />
                        </div>
                        <form className=" mt-sm-32 mb-8" onSubmit={submitLogin}>
                            <div className="mb-18">
                                <Input label="Email" variant="standard" required type="email" className="border-b-1" name="email" id="email" />
                            </div>

                            <div className="mb-18">
                                <Input label="Password" variant="standard" required type="password" className="border-b-1" name="password" autoComplete="" id="password" />
                            </div>

                            <div className="row align-items-center justify-content-between mb-16">
                                {/* <div className="col hp-flex-none w-auto">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label ps-4" htmlFor="exampleCheck1">Remember me</label>
                                    </div>
                                </div> */}

                                {/* <div className="col hp-flex-none w-auto">
                                    <a className="hp-button text-black-80 hp-text-color-dark-40" href="auth-recover.html">Forgot Password?</a>
                                </div> */}
                            </div>

                            <Button type="submit" color="blue" className=" w-100 ">
                                Sign in
                            </Button>
                        </form>

                        {/* <div className="col-12 hp-form-info text-center">
                            <span className="text-black-80 hp-text-color-dark-40 hp-caption me-4">Don’t you have an account?</span>
                            <a className="text-primary-1 hp-text-color-dark-primary-2 hp-caption" href="auth-register.html">Create an account</a>
                        </div> */}

                        <div className="mt-48 mt-sm-96 col-12">
                            <p className="hp-p1-body text-center hp-text-color-black-60 mb-8"> Copyright EcoSystem </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}