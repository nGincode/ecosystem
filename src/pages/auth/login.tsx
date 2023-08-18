/* eslint-disable @next/next/no-img-element */
export default function login({ submitLogin }: any) {

    return (

        <div className="row hp-authentication-page overflow-hidden">
            <div className="hp-bg-black-20 hp-bg-color-dark-90 col-lg-6 col-12">
                <div className="row hp-image-row h-100 px-8 px-sm-16 px-md-0 pb-32 pb-sm-0 pt-32 pt-md-0">
                    <div className="hp-logo-item m-16 m-sm-32 m-md-64 w-auto px-0 col-12">
                        <div className="hp-header-logo d-flex align-items-center">
                            <h1 className="position-relative text-5xl font-bold">
                                EcoSystem
                            </h1>
                        </div>
                    </div>

                    <div className="col-12 px-0">
                        <div className="row h-100 w-100 mx-0 align-items-center justify-content-center">
                            <div className="hp-bg-item text-center mb-32 mb-md-0 px-0 col-12">
                                <img className="hp-dark-none m-auto w-100" src="/app-assets/img/pages/authentication/authentication-bg.svg" alt="Background Image" />
                                <img className="hp-dark-block m-auto w-100" src="/app-assets/img/pages/authentication/authentication-bg-dark.svg" alt="Background Image" />
                            </div>

                            <div className="hp-text-item text-center col-xl-9 col-12">
                                <h2 className="hp-text-color-black-100 hp-text-color-dark-0 mx-16 mx-lg-0 mb-16 text-3xl"> Very good works are waiting for you </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-6 py-sm-64 py-lg-0">
                <div className="row align-items-center justify-content-center h-100 mx-4 mx-sm-n32">
                    <div className="col-12 col-md-9 col-xl-7 col-xxxl-5 px-8 px-sm-0 pt-24 pb-48">
                        <h1 className="mb-0 mb-sm-24 font-bold text-5xl">Login</h1>
                        <p className="mt-sm-8 mt-sm-0 text-black-60">Welcome back, please login to your account.</p>

                        <form className="mt-16 mt-sm-32 mb-8" onSubmit={submitLogin}>
                            <div className="mb-16">
                                <label htmlFor="email" className="form-label">Email :</label>
                                <input type="email" className="form-control" name="email" id="email" />
                            </div>

                            <div className="mb-16">
                                <label htmlFor="password" className="form-label">Password :</label>
                                <input type="password" className="form-control" name="password" id="password" />
                            </div>

                            <div className="row align-items-center justify-content-between mb-16">
                                <div className="col hp-flex-none w-auto">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label ps-4" htmlFor="exampleCheck1">Remember me</label>
                                    </div>
                                </div>

                                <div className="col hp-flex-none w-auto">
                                    <a className="hp-button text-black-80 hp-text-color-dark-40" href="auth-recover.html">Forgot Password?</a>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                <a className="d-block w-100" style={{ color: "inherit" }}>Sign in</a>
                            </button>
                        </form>

                        <div className="col-12 hp-form-info text-center">
                            <span className="text-black-80 hp-text-color-dark-40 hp-caption me-4">Don’t you have an account?</span>
                            <a className="text-primary-1 hp-text-color-dark-primary-2 hp-caption" href="auth-register.html">Create an account</a>
                        </div>

                        <div className="mt-48 mt-sm-96 col-12">
                            <p className="hp-p1-body text-center hp-text-color-black-60 mb-8"> Copyright EcoSystem </p>

                            <div className="row align-items-center justify-content-center mx-n8">
                                <div className="w-auto hp-flex-none px-8 col">
                                    <a className="hp-text-color-black-80 hp-text-color-dark-40"> Privacy Policy </a>
                                </div>

                                <div className="w-auto hp-flex-none px-8 col">
                                    <a className="hp-text-color-black-80 hp-text-color-dark-40"> Term of use </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}