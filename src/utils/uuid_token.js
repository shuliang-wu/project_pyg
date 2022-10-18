import {v4 as uuidv4} from 'uuid';
// 要随机生成一个字符串，且每次执行不能发送变化，游客身份持久存储
export const getUUID = ()=>{
    // 先从本地存储获取uuid
    let uuid_token = localStorage.getItem('UUIDTOKEN');
    if(!uuid_token){
        // 如果本地存储没有，那么我就生成一个
        uuid_token = uuidv4();
        // 生成之后，存储到本地存储当中
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    // 切记有返回值，没有返回值是undefined
    return uuid_token;
}