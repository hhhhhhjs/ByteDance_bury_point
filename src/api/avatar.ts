import Instance from "./axios";

interface uploadFiles extends File {
    newFilename?: string;
    originalFilename?: string;
}

export const uploadAvatar = async (userid: string, file: uploadFiles) => {
    try {
        const formData = new FormData()
        formData.append('avatar', file)
        const res = await Instance.post(`/api/uploadAvatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                userid
            }
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const getUserAvatar = async (userid: string) => {
    try {
        const res = await Instance.get(`/api/getAvatar`, {
            params: {
                userid
            }
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}