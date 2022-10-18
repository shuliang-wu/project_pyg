import { reqGoodsInfo ,reqAddOrUpdateshopCart} from '@/api/index'
import { getUUID } from '@/utils/uuid_token'
let state = {
    goodsInfo: {},
    // 游客临时身份
    uuid_token:getUUID()
}
let actions = {
    async getGoodsInfo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId)
        if (result.code == 200) {
            commit('GETGOODSINFO', result.data)
        }
    },
    async addOrUpdateShopCart({commit},{skuId,skuNum}){
        // 加入购物车以后发送请求，前台将参数带给服务器
        // 服务器写入数据成功，并没有返回其他数据，只是返回code= 200 ，代表这次操作成功
        // 因为服务器没有返回其他数据，因此在咱们不需要三连环存储数据
        let result = await reqAddOrUpdateshopCart(skuId,skuNum)
        // console.log(result);
        // 代表服务器加入购物车成功
        if(result.code == 200){
            // async函数返回的结果一定是一个promise，如果返回的是非空字符串，则代表成功
            return 'ok'
        }else {
            // 代表服务器加入购物车失败
            return Promise.reject(new Error('fail'))
        }
    }
}
let mutations = {
    GETGOODSINFO(state, goodsInfo) {
        state.goodsInfo = goodsInfo
    },
    
    
}
let getters = {
    categoryView(state) {
        return state.goodsInfo.categoryView || {};
    },
    skuInfo(state) {
        return state.goodsInfo.skuInfo || {};
    },
    spuSaleAttrList(state){
        return state.goodsInfo.spuSaleAttrList || []
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}