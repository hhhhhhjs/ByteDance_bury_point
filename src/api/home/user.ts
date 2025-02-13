import Instance from "../axios";


// 获取用户设备信息
export const getuserEquip = async(userid: string) => {
    return Instance.get('/api/userequipment', {
        params:{
            userid
        }
    })
}