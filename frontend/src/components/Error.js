import React from "react";

const Error = ({ error }) => {
    return (
        <>
            {error &&
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 my-3 rounded relative"
                 role="alert">
                {error}
            </div>
            }
        </>
    );
};
export default Error;