export class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

export const handleError = (error, res) => {
    const { statusCode, errorMessage } = error;
    const message = setErrorMessage(statusCode, errorMessage)

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};

const setErrorMessage = (status, defaultError) => {
    switch (status) {
        case 400:
            return "Request is invalid."
        case 404:
            return "Record does not exist.";
        case 409:
            return "Entry already exists.";
        default:
            return defaultError;
    }
}