//统一管理项目前部的接口
import requests from "./requests";
import mockRequests from './mockRequests';
//封装函数:复用
//将来这个函数可以在别的地方使用,需要对外暴露【分别暴露】
//获取商品分类的数据
export const reqCategory = () => {
   //箭头函数可以在程序任意地方使用,箭头函数返回即为服务器的数据
   //下面箭头函数返回值：返回的是什么? promise,即为返回服务器的数据
   //return关键字，千万别忘记书写，如果忘记书写，你在任意地方获取的都是undeinfed
   return requests({ method: 'get', url: '/product/getBaseCategoryList' });
}


//获取首页轮播图数据的接口
export const reqBannerList = () => mockRequests({ url: '/banner', method: 'get' });

//获取Floor数据接口
export const reqFloorList = () => mockRequests({ url: '/floor', method: 'get' });

//搜索模块的请求接口函数:
//将来根据不同的搜索条件,需要给服务器携带不同的参数
//请求体携带搜索的参数
//搜索的条件:它应该是一个对象10K,可有可无，但是data至少是一个空对象
//没有发现:
//第一步:整理搜索的参数
//第二步：根据最新的搜索参数，获取最新的数据展示!!
export const reqSearchList = (params) => requests({ url: '/list', method: 'post', data: params })


// 获取商品详情信息
// url /api/item/{ skuId }  get 
export const reqGoodsInfo = (skuId) => requests({ url: `/item/${skuId}`, method: 'get' });

// 将产品添加到购物车中、更新某一个产品的个数
// /api/cart/addToCart/{ skuId }/{ skuNum }   post 
export const reqAddOrUpdateshopCart = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' })


// 获取购物车列表
// /api/cart/cartList   get 无参数
export const reqShopCartList = () => requests({url:'/cart/cartList',method:'get'})

// 删除购物车里某一个商品
// /api/cart/deleteCart/{skuId}  请求方式：delete   参数：skuID
export const reqDeleteShopCart = (skuId)=> requests({url:`/cart/deleteCart/${skuId}`,method:'delete'})

// 修改某一个产品的选中状态
// /api/cart/checkCart/{skuId}/{isChecked}  get 
export const reqUpdateChecked = (skuId,isChecked) => requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})


// 获取验证码
// /api/user/passport/sendCode/{phone}   get 
export const reqPhoneCode = (phone)=> requests({url:`/user/passport/sendCode/${phone}`,method:'get'})

// 用户注册
// /api/user/passport/register   post
export const reqUserRegister = (data) => requests({url:'/user/passport/register',data,method:'post'})

// 用户登录
//  /api/user/passport/login  post
export const reqUserLogin = (data) => requests({url:'/user/passport/login',data,method:'post'})

// 获取用户登录后的信息
// api/user/passport/auth/getUserInfo   get
export const reqUserInfo = () => requests({url:'/user/passport/auth/getUserInfo',method:'get'})


// 退出登录
// /api/user/passport/logout   get 
export const reqUserLogout = () => requests({url:'/user/passport/logout',method:'get'})


// 获取用户地址信息
// /api/user/userAddress/auth/findUserAddressList   get
export const reqUserAddress = ()=> requests({url:'/user/userAddress/auth/findUserAddressList',method:'get'})


//商品清单接口
// /api/order/auth/trade  get 
export const reqOrderInfo = ()=> requests({url:'/order/auth/trade',method:'get'})


// 提交订单
// /api/order/auth/submitOrder?tradeNo={tradeNo}   post
export const reqSubmitOrder = (tradeNo,data) => requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})


// 获取支付信息
// /api/payment/weixin/createNative/{orderId}  get 
export const reqPayInfo = (orderId) => requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'})


// 查询订单支付状态
// /api/payment/weixin/queryPayStatus/{orderId}     get 
export const reqPayStatus = (orderId) => requests({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})


// 获取我的订单列表
// /api/order/auth/{page}/{limit}    get 
export const reqMyOrder = (page,limit) => requests({url:`/order/auth/${page}/${limit}`,method:'get'})



