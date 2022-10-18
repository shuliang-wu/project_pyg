import {reqUserAddress,reqOrderInfo} from '@/api'
let state = {
    address:[],
    order:{}
};
let actions = {
    // 获取用户地址信息
   async getUserAdrress({commit}){
    let result = await reqUserAddress()
    // console.log(result);
    if(result.code == 200){
        commit('GETUSERADDRESS',result.data);
        return 'ok'
    }else {
        return Promise.reject(new Error('faile'))
    }
   },
// 获取商品清单
   async getOrderInfo({commit}){
    let result = await reqOrderInfo();
    if(result.code == 200){
        commit('GETORDERINFO',result.data)
        return 'ok'
    }else {
        return Promise.reject(new Error('faile'))
    }
   }
};
let mutations = {
    GETUSERADDRESS(state,address){
        state.address = address
    },
    // 获取商品清单
    GETORDERINFO(state,order){
        state.order = order
    }
};

let getters = {}
export default {
    actions,
    mutations,
    state,
    getters
}