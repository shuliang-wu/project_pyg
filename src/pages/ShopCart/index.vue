<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="cartInfo in cartInfoList"
          :key="cartInfo.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cartInfo.isChecked"
              @change="changeChecked(cartInfo, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl" />
            <div class="item-msg">{{ cartInfo.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cartInfo.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('minus', -1, cartInfo)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cartInfo.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cartInfo)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('add', 1, cartInfo)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cartInfo.skuPrice * cartInfo.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cartInfo)">删除</a>
            <br />
            <a>移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked&&cartInfoList.length>0" @change="updateAllChecked($event)"/>
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllChecked">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <!-- <div class="chosed">已选择 <span>0</span>件商品</div> -->
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">￥{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(["cartList"]),
    // 购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    // 计算总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach((item) => {
        // console.log(item);
        sum += item.skuPrice * item.skuNum;
      });
      return sum;
    },
    // 点击全选
    // every方法也是遍历数组当中的每一项，如果里面所有的项的某个属性满足条件，返回的是true，只要有一项的某个属性不满足，则返回false，这里计算全选非常合适。
    isAllChecked() {
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
  },
  methods: {
    getData() {
      this.$store.dispatch("getShopCartList");
    },
    // 修改某一个产品的数量【节流】
    handler: throttle(async function (type, disNum, cartInfo) {
      // type:区分点击的是 +按钮 还是 -按钮 或者是 输入
      // disNum: + 变化量(1)  -变化量(-1)   input最终的个数(并不是变化量)
      // cartInfo：可以区分点击的是哪一个商品，因为它的身上有商品id
      switch (type) {
        case "add":
          disNum = 1;
          break;

        case "minus":
          // 判断产品的个数大于1，才可以传递给服务器-1
          // 如果出现产品的个数小于1，传递给服务器的个数0(原封不动)
          disNum = cartInfo.skuNum > 1 ? -1 : 0;
          break;

        case "change":
          // 这里的disNum传递给服务器的是变化的量
          // 如果用户输入是非法的，我们就让带给服务器的变化量为0
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            // 这里代表用户输入是合法的，但是要考虑小数的情况，先取整，然后减去原来的数量，求出变化量，再发送给服务器。
            // 这里 parseInt(disNum) 中的disNum代表的是用户输入的最终的值，而不是我们的变化的值
            disNum = parseInt(disNum) - cartInfo.skuNum;
          }
          // 可简写
          // disNum = isNaN(disNum) || disNum <1 ? 0:parseInt(disNum) - cartInfo.skuNum
          break;
      }
      // 发送请求
      try {
        // 代表的是修改成功
        await this.$store.dispatch("addOrUpdateShopCart", {
          skuId: cartInfo.skuId,
          skuNum: disNum,
        });
        // 再一次获取服务器最近的数据进行展示
        this.getData();
      } catch (error) {}
    }, 500),
    // 删除一个商品
    async deleteCartById(cartInfo) {
      try {
        await this.$store.dispatch("deleteShopCart", cartInfo.skuId);
        // 如果成功，发送请求获取新的数据进行展示
        this.getData();
      } catch (error) {
        // 失败，弹出失败提示
        alert(error.message);
      }
    },
    // 修改某一个产品的选中状态
    async changeChecked(cartInfo, event) {
      // 要想修改某一个产品的选中状态，必须给服务器传递两个参数，一个是发生状态改变的商品的id，还有一个就是改变改变后的状态：选中传递1，不选择传递0
      let isChecked = event.target.checked ? "1" : "0";
      try {
        await this.$store.dispatch('changeCartChecked',{skuId:cartInfo.skuId,isChecked});
        // 如果修改成功，重新发送请求，获取最新数据进行展示
        this.getData()
      } catch (error) {
        // 如果失败，弹出错误信息
        alert(error.message);
        
      }
    },
    // 删除所有选中的产品
    async deleteAllChecked(){
     try {
      await this.$store.dispatch('deleteAllCheckedCart');
      // 如果成功，再次发送请求，获取最新数据进行展示
      this.getData()
     } catch (error) {
      // 如果失败，弹出提示信息
      alert(error.message);
     }
    },
    // 全选按钮的实现
    async updateAllChecked(event){
     try {
      // 这里要注意判断，传递给服务器的并不是true或者false，而是1或0
      let isChecked = event.target.checked?'1':'0';
      await this.$store.dispatch('updateAllCartChecked',isChecked);
      // 成功之后，再次发送请求，展示最新数据
      this.getData();
     } catch (error) {
      alert(error.meaasge)
     }
    }
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;
          a {
            text-decoration: none;
          }
          a:hover {
            color: white;
            background-color: #f13718;
          }

          .mins {
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;
          a {
            color: #000;
            font-weight: bold;
            display: block;
            position: relative;
            width: 85px;
            height: 32px;
            line-height: 32px;
            border-radius: 5px;
            text-align: center;
            font-size: 15px;
            // font-family: "Microsoft YaHei";
            background: #eaeaea;
            overflow: hidden;
            text-decoration: none;
          }
          a:hover {
            cursor: pointer;
            color: white;
            background-color: #e1251b;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        cursor: pointer;
        float: left;
        padding: 0 10px;
        color: #666;
      }
      a:hover {
        color: #e1251b;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
          text-decoration: none;
        }
      }
    }
  }
}
</style>
