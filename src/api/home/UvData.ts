import Instance from "../axios";

interface reportUV {
   userid: string;
   username: string;
   visit_date: string; //这里为了方便查看，将时间格式约束为 iso1086 格式
}

export const reportUserview = async(message:reportUV) => {
    return Instance.post('/api/reportUserView', message)
}

export const getUvData = async () => {
    return Instance.get('/api/getUserView')
}