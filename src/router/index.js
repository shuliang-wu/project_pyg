import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '@/store'

Vue.use(VueRouter)



//把人家原型对象的push方法进行保存
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//VueRouter.prototype原型对象添加一个方法
//location:路由跳转相关的信息
VueRouter.prototype.push = function (location, resolve, reject) {
    //当前函数this：即为VueRouter类的实例
    //相当于push方法里面this，是windows【完犊子了】
    //利用人家push方法实现路由跳转，保证push里面this,应该vueRouter类的实例

    //面试:函数apply与call区别?
    //相同的地方:都可以篡改函数里面this
    //不同的地方:apply传递参数 数组  call传递参数 逗号分割

    if (resolve && reject) {
        //代表真:代表着两个形参接受参数【箭头函数】
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { });
    }
}


VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        //代表真:代表着两个形参接受参数【箭头函数】
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { });
    }
}
let router = new VueRouter({
    routes,
    // 路由滚动
    scrollBehavior(to, from, savedPosition) {
        // 这个方法返回滚动位置的对象信息，长这样：    
        // { x: number, y: number }
        // 始终滚动到顶部
        return { y: 0 }
    },

})


router.beforeEach(async (to, from, next) => {
    // console.log(store);
    // 先判断用户是否已经登录,通过token判断用户是否已经登录
    let token = store.state.user.token;
    let name = store.state.user.name
    if (token) {
        // 如果用户已经登录
        // 需要判断用户是不是想去登录页面，不能让他去登录页面,让他呆在首页
        if (to.path == '/login' || to.path == '/register') {
            next('/home')
        } else {
            // 如果去的不是登录页面【home|search|detail|shopcart】
            // 先判断有没有用户信息,这里不能直接判断userInfo，因为它空对象也是为真，所以我们需要判断其中的某一个字段【比如name】
            if (name) {
                // 登录了且有有用户信息，放行
                next();
            } else {
                // 登录了没有用户信息，需要发送获取用户信息的请求
                try {
                    await store.dispatch('getUserInfo')
                    // 获取用户信息成功之后，再放行
                    next()
                } catch (error) {
                    // 如果获取用户信息没有成功，说明token已经过期了，那么就需要清除token，重新登录
                    await store.dispatch('userLogout')
                    next('/login')

                }

            }

        }

    } else {
        // 如果没有登录，不能去交易相关、不能去支付相关【pay|paysuccess】、不能去个人中心
        // 未登录去上面的这些路由---跳转到登录页面
        let toPath = to.path;
        // console.log(toPath);
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            next('/login?redirect=' + toPath)
            // 在用户未登录的时候，想去一些去不了的组件，可以先跳转到登录页面，然后想去的页面以参数的形式存储在路径当中【路由】，在login组件当中进行判断，如果路径当中存在query参数，那么，在用户登录之后就跳转到参数当中的路由，如果没有，就跳到home首页。
        } else {
            // 去的不是上面这些路由（home|search|shopCart） --放行
            next()

        }
    }

})

export default router