export default function loadingPage({ process }: any) {
    if (process) {
        return (
            <div className="text-center" style={{ position: "fixed", paddingTop: "50vh", background: "white", height: "100vh", width: "100%", zIndex: 9, top: 0, left: 0 }}>
                <div className="spinner-border" role="status">
                </div>
            </div>)
    }
}