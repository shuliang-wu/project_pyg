import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
// 各个路由的配置项
export default[
    {
        // 路由的路径一定都是小写的
        name:'addcartsuccess',
        path:'/addcartsuccess',
        component:AddCartSuccess,
        meta:{show:true}
    },
    {
        path:'/detail/:skuId',
        component:Detail,
        meta:{show:true}
    },
    {
        path:'/home',
        component:Home,
        meta:{show:true}
    },
    {
        path:'/login',
        component:Login,
        meta:{show:false}
    },
    {
        path:'/register',
        component:Register,
        meta:{show:false}
    },
    {
        name:'search',
        path:'/search/:keyword?',
        // path:'/search',
        component:Search,
        meta:{show:true},
        // 路由组件可以传递props数据
        // 布尔值写法 ，只能传递params参数
        // props:true,
        // 对象写法
        // props:{a:1,b:2}
        // 函数写法：可以params参数，query参数
        props($route){
            return {keyword:$route.params.keyword}
        }
    },
    // 重定向，项目开始时定向到首页
    {
        path:'*',
        redirect:'/home'
    }
]