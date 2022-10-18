import {reqShopCartList,reqDeleteShopCart,reqUpdateChecked} from '@/api'
let state = {
    shopCartList:[]
}
let actions = {
    // 获取购物车数据
    async getShopCartList({commit}){
        let result = await reqShopCartList()
        // console.log(result);
        if(result.code == 200){
            commit('GETSHOPCARTLIST',result.data)
        }
    },
    // 删除某一个产品
    async deleteShopCart ({commit},skuId){
        let result = await reqDeleteShopCart(skuId);
        if(result.code == 200){
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'));
        }
    },
    // 修改某一个产品的选中状态
    async changeCartChecked({commit},{skuId,isChecked}){
        let result = await reqUpdateChecked(skuId,isChecked)
        if(result.code == 200){
            return 'ok'
        }else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 删除所有选中的产品
    deleteAllCheckedCart({dispatch,getters}){
        // console.log(context);
        // context:是一个小仓库，它身上有很多方法和属性，其中包括：commit【提交mutations修改state】、dispatch【派发actions】、getters【计算属性】、state【当前仓库数据】
        // 我们不需要提交mutations，所以不需要结构commit，我们需要dispatch和getters就可以

        let promiseAll = [];
        // 遍历getters中商品的数组,拿到购物车当中的每一项，如果每一项的isChecked属性为1(被选中)，那么就派发删除一个产品的action，否则啥也不干【相当于只删除被选中的产品】
        getters.cartList.cartInfoList.forEach(item => {
           let promise =  item.isChecked == 1?dispatch('deleteShopCart',item.skuId) : '';
        //  将删除单个产品返回的promise存入数组
           promiseAll.push(promise);
            
        });
        return Promise.all(promiseAll)



    },
    // 全选按钮功能实现
    updateAllCartChecked({dispatch,state},isChecked){
        // console.log(state,isChecked);
        let promiseAll = [];
        state.shopCartList[0].cartInfoList.forEach(item => {
            // 这里不需要判断每一项产品的选中状态，点击全选按钮，所有产品状态跟着改变，取消全选也是如此
            let promise = dispatch('changeCartChecked',{skuId:item.skuId,isChecked});
            // 将返回的promise加入数组，后续用来判断
            promiseAll.push(promise)
        });
        return Promise.all(promiseAll)
    }
}
let mutations = {
    GETSHOPCARTLIST(state,shopCartList){
        state.shopCartList = shopCartList
    }
}

let getters = {
    cartList(state){
        return state.shopCartList[0] || {}
    }
}
export default{
    actions,
    mutations,
    state,
    getters
}