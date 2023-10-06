/* eslint-disable @next/next/no-css-tags */
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/img/logo.png" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/plugin/swiper-bundle.min.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/icons/iconly/index.min.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/icons/remix-icon/index.min.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/bootstrap.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/colors.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/base/typography.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/base/base.css" />

                <link rel="stylesheet" type="text/css" href="/app-assets/css/theme/colors-dark.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/theme/theme-dark.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/custom-rtl.css" />

                <link rel="stylesheet" type="text/css" href="/app-assets/css/layouts/sider.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/layouts/header.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/layouts/page-content.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/components.css" />

                <link rel="stylesheet" type="text/css" href="/app-assets/css/plugin/apex-charts.css" />

                <link rel="stylesheet" type="text/css" href="/app-assets/css/pages/dashboard-analytics.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/pages/authentication.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/pages/page-profile.css" />
                <link rel="stylesheet" type="text/css" href="/app-assets/css/pages/app-contact.css" />

                <link rel="stylesheet" type="text/css" href="/assets/css/style.css" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}