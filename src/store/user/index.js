import { reqPhoneCode ,reqUserRegister,reqUserLogin,reqUserInfo,reqUserLogout} from '@/api'
import {setToken,getToken,removeToken} from '@/utils/token'
let state = {
    code:'',
    token:getToken(),//这里从本地存储拿，在token返回之前是null，和空字符串没有区别，当下面拿到token并存到本地存储后，下一次刷新再读取，就是从本地存储当中读取token，实现持久化存储
    userInfo:''
}
let actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        let result = await reqPhoneCode(phone);
        // console.log(result);
        // 正常情况下面就不需要提交mutations了，只不过我们需要验证码展示，需要放入仓库当中
        if(result.code == 200) {
            commit('GETCODE',result.data)
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 用户注册
    async userRegister ({commit},user){
        let result = await reqUserRegister(user)
        if(result.code ==200){
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 用户登录
    async userLogin ({commit},data){
        let result = await reqUserLogin(data);
        // console.log(result);
        // 服务器下发token，用户的唯一标识【很重要】
        // 将来经常通过token找服务器要用户信息进行展示
        // 需要知道的是，vuex存储的数据不是持久化的，一刷新就没了，所以需要存储到本地存储

        

        
        if(result.code == 200){
            commit('USERLOGIN',result.data.token);
            // 拿到了token，将其持久化存储到本地存储
            // 这里将存储token的函数单独放到utils下的token文件当中，统一管理token，需要时直接引入那个函数即可。
            setToken(result.data.token)
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 获取用户信息
    async getUserInfo({commit}){
       let result =  await reqUserInfo()
        if(result.code == 200){
            commit('GETUSEINFO',result.data);
        }
    },
    // 退出登录
    async userLogout({commit}){
      let result =  await reqUserLogout()
    // 注意：actions内不能操作state，必须提交给mutations才能处理
        if(result.code == 200){
            commit('USERLOGOUT');
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    }
}
let mutations = {
    GETCODE(state,code){
        state.code = code;
    },
    // 用户登录
    USERLOGIN(state,token){
        state.token = token;
    },
    // 获取用户信息
    GETUSEINFO(state,userInfo){
        state.userInfo = userInfo
    },
    // 用户退出登录
    USERLOGOUT(state){
        state.code = '';
        state.userInfo = '',
        removeToken()

    }
}
let getters = {}
export default {
    state,
    actions,
    mutations,
    getters
}