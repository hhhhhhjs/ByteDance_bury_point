import Instance from "../axios";

interface PvData {
    userid: string;
    username: string;
    page_url: string;
    access_complete_date: string;
}


export const reportPageView = (data: PvData) => {
    return Instance.post("/api/reportPageView", data);
}

export const getPvData = (start_date: string, end_date: string) => {
    return Instance.get("/api/getPageView", {
        params: {
            start_date,
            end_date,
        }
    }) 
}