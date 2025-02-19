import Instance from "../axios";

export const getEvent = async(userid: string) => {
    return Instance.get('/api/getEvent', {
        params:{
            userid
        }
    })
}