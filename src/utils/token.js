// 对外暴露一个函数
// 本地存储token
export const setToken = (token)=>{
    localStorage.setItem('TOKEN',token)
}

// 读取token
export const getToken = ()=>{
    // 注意这个函数要有返回值
   return  localStorage.getItem('TOKEN')
}


// 从本地中删除token
export const removeToken = ()=>{
    localStorage.removeItem('TOKEN')
}

