// import Home from '@/pages/Home'
// import Login from '@/pages/Login'
// import Register from '@/pages/Register'
// import Search from '@/pages/Search'
// import Detail from '@/pages/Detail'
// import AddCartSuccess from '@/pages/AddCartSuccess'
// import ShopCart from '@/pages/ShopCart'
// import Trade from '@/pages/Trade'
// import Pay from '@/pages/Pay'
// import PaySuccess from '@/pages/PaySuccess'
// import Center from '@/pages/Center'
// 引入二级路由
// import MyOrder from '@/pages/Center/myOrder'
// import GroupOrder from '@/pages/Center/groupOrder'
// 各个路由的配置项
export default [
    {
        path: '/center',
        component: () => import('@/pages/Center'),
        meta: { show: true },
        children: [
            {
                path: 'myorder',
                component: () => import('@/pages/Center/myOrder')
            },
            {
                path: 'grouporder',
                component: () => import('@/pages/Center/groupOrder')
            },
            // 重定向到myorder页面
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        path: '/paysuccess',
        component: () => import('@/pages/PaySuccess'),
        meta: { show: true }
    },
    {
        name: 'pay',
        path: '/pay',
        component: () => import('@/pages/Pay'),
        meta: { show: true },
        // 路由独享守卫，决定着进入次路由的条件
        beforeEnter: (to, from, next) => {
            // 想要进入pay页面，必须从交易页面来的才能进入
            if (from.path == '/trade') {
                next()
            } else {
                // 不是从交易页面来的，就停留在当前
                next(false)
            }
        }
    },
    {
        name: 'trade',
        path: '/trade',
        component: () => import('@/pages/Trade'),
        meta: { show: true },
        // 路由独享守卫，决定着进入次路由的条件
        beforeEnter: (to, from, next) => {
            // 想要进入trade页面，必须从购物车页面来的才能进入
            if (from.path == '/shopcart') {
                next()
            } else {
                // 不是从购物车页面来的，就停留在当前
                next(false)
            }
        }
    },
    {
        // 路由的路径一定都是小写的
        name: 'shopcart',
        path: '/shopcart',
        component: () => import('@/pages/ShopCart'),
        meta: { show: true }
    },
    {
        // 路由的路径一定都是小写的
        name: 'addcartsuccess',
        path: '/addcartsuccess',
        component: () => import('@/pages/AddCartSuccess'),
        meta: { show: true }
    },
    {
        path: '/detail/:skuId',
        component: () => import('@/pages/Detail'),
        meta: { show: true }
    },
    {
        path: '/home',
        component: () => import('@/pages/Home'),
        meta: { show: true }
    },
    {
        path: '/login',
        component: () => import('@/pages/Login'),
        meta: { show: false }
    },
    {
        path: '/register',
        component: () => import('@/pages/Register'),
        meta: { show: false }
    },
    {
        name: 'search',
        path: '/search/:keyword?',
        // path:'/search',
        component: () => import('@/pages/Search'),
        meta: { show: true },
        // 路由组件可以传递props数据
        // 布尔值写法 ，只能传递params参数
        // props:true,
        // 对象写法
        // props:{a:1,b:2}
        // 函数写法：可以params参数，query参数
        props($route) {
            return { keyword: $route.params.keyword }
        }
    },
    // 重定向，项目开始时定向到首页
    {
        path: '*',
        redirect: '/home'
    }
]