import { toast } from "react-toastify";


const handleUploadFile = async (task, imgSelect) => {
    // const { imgSelect } = this.state;
    if (!imgSelect) {
        toast.error("Vui lòng chọn tệp để tải lên!");
        return;
    }
    const formData = new FormData();
    formData.append("file", imgSelect);  // "file" là tên trường phải khớp với server
    formData.append("task", task);   // Bạn có thể thay đổi task tùy ý

    try {
        const response = await fetch("http://localhost:8686/uploads", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            toast.success("Tải lên thành công!");
            console.log(data);  // In ra kết quả trả về từ server
        } else {
            throw new Error("Lỗi tải lên!");
        }
    } catch (error) {
        toast.error(error.message);
    }
};

export default handleUploadFile