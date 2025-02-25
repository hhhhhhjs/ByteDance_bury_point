import Instance from "../axios";

interface reportUV {
    userid: string;
    username: string;
    visit_date: string; //这里为了方便查看，将时间格式约束为 iso1086 格式
}

export const reportUserview = async (message: reportUV):Promise<Response> => {
    return Instance.post('/api/reportUserView', message)
}

export const getUvData = async (start_date: string, end_date: string) => {
    return Instance.get('/api/getUserView', {
        params: {
            start_date,
            end_date,
        }
    })
}