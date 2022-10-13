//search模块的小仓库
import { reqSearchList } from '@/api'
let state = {
     //搜索模块返回的数据
     searchList: {}
};
let mutations = {
     GETSEARCHLIST(state, searchList) {
          state.searchList = searchList;
     }
};
let actions = {
     async getSearchList({ commit }, Params={}) {
          // reqSearchList在调用获取服务器数据的时候至少传递一个参数(空对象)
          // params形参：是当用户派发action的时候，第二个参数传递过来的，至少是一个空对象
          let result = await reqSearchList(Params);
          if (result.code == 200) {
               commit('GETSEARCHLIST', result.data);
          }
     }
};

//getters:仓库的计算属性
//项目中:vuex的getters,为了简化数据而生。
let getters = {
     //计算新的属性:state,当前小仓库的数据
     goodsList(state) {
          // 假如没有网络，返回的是一个undefined，但至少应该是一个空数组，不然那边遍历就会报错
          return state.searchList.goodsList || [];
     },
     //品牌的数据
     trademarkList(state) {
          return state.searchList.trademarkList || [];
     },
     //商品属性
     attrsList(state) {
          return state.searchList.attrsList || [];
     }
};

//对外暴露
export default {
     state,
     mutations,
     actions,
     getters
}