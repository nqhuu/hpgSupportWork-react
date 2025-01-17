import { uploadsFile } from "../services/userService"


const handleUploadFile = async (task, imgSelect) => {
    if (!imgSelect) {
        return ({
            errCode: 1,
            errMessage: "Vui lòng chọn tệp để tải lên!"
        });
    }
    const formData = new FormData();
    formData.append("file", imgSelect);  // "file" là tên trường phải khớp với server

    try {
        const response = await uploadsFile(task, formData);
        if (response) {
            return response
        } else {
            throw new Error("Lỗi tải lên!");
        }
    } catch (error) {
        console.log(error)
    }
};

export default handleUploadFile