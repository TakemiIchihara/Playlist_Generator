const Loading = () => {
	const appScreen = document.getElementById("main");
	const  height: string = appScreen ? `${appScreen.offsetHeight}px` : "";

    return (
        <div className="loading-holder" style={{ height }}>
            <h1>You are genius and doing great (；ω；)</h1>
        </div>
    )

}

export default Loading;