export const Default = ({ addPage }) => {

    return (
        <>
            <link href="https://fonts.googleapis.com/css?family=VT323" rel="stylesheet" type="text/css"/>
            <div className="home-default">
                <div className="pixel" onClick={addPage}>
                    <p>Create new page</p>
                </div>

                <div>
                    Or select a page to view its contents...
                </div>
            </div>
        </>
    );
};

export default Default;
