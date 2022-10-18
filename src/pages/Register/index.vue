<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>
        注册新用户
        <span class="go"
          >我有账号，去 <router-link to="/login">登陆</router-link>
        </span>
      </h3>
      <div class="content">
        <label>手机号:</label>
        <input
          placeholder="请输入你的手机号"
          v-model="phone"
          name="phone"
          v-validate="{ required: true, regex: /^1\d{10}$/ }"
          :class="{ invalid: errors.has('phone') }"
        />
        <span class="error-msg">{{ errors.first("phone") }}</span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input
          placeholder="请输入验证码"
          v-model="code"
          name="code"
          v-validate="{ required: true, regex: /^\d{6}$/ }"
          :class="{ invalid: errors.has('code') }"
        />
        <button class="cbtn" @click="getCode()">获取验证码</button>
        <span class="error-msg">{{ errors.first("code") }}</span>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input
          placeholder="请输入你的密码"
          v-model="password"
          name="password"
          v-validate="{ required: true, regex: /^[0-9A-Za-z]{8,20}$/ }"
          :class="{ invalid: errors.has('password') }"
        />
        <span class="error-msg">{{ errors.first("password") }}</span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input
          placeholder="确认密码"
          v-model="comfirmPassword"
          name="comfirmPassword"
          v-validate="{ required: true, is: password }"
          :class="{ invalid: errors.has('comfirmPassword') }"
        />
        <span class="error-msg">{{ errors.first("comfirmPassword") }}</span>
      </div>
      <div class="controls">
        <input
          type="checkbox"
          v-model="agree"
          name="agree"
          v-validate="{ required: true, agreement: true }"
          :class="{ invalid: errors.has('agree') }"
        />
        <span id="agree"
          >我已阅读并接受以下条款：
          <a href="#">《品优购用户协议》</a>
          <a href="#">《品优购隐私政策》</a>
          <a href="#">《品优支付用户服务协议》</a>
        </span>
      </div>
      <div class="btn">
        <button @click="userRegister">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机品优购</li>
        <li>销售联盟</li>
        <li>品优购社区</li>
      </ul>
      <div class="address">地址：海南省澄迈县金江镇</div>
      <div class="beian">琼ICP备20221014号</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      // 收集手机号
      phone: "",
      // 收集验证码
      code: "",
      // 密码
      password: "",
      // 确认密码
      comfirmPassword: "",
      // 同意协议
      agree: true,
    };
  },
  methods: {
    // 获取验证码
    async getCode() {
      try {
        // 简单判断一下，至少用数据
        const { phone } = this;
        phone && (await this.$store.dispatch("getCode", phone));
        this.code = this.$store.state.user.code;
      } catch (error) {
        alert(error.message);
      }
    },
    // 用户注册
    async userRegister() {
      const success = await this.$validator.validateAll(); //全部表单验证
      // 如果全部表单验证成功，再向服务器发送请求，进行注册
      // 只要有一个表单没有成功，不会发请求
      if (success) {
        try {
          const { phone, code, password } = this;
          await this.$store.dispatch("userRegister", {
            phone,
            code,
            password,
          });
          // 成功之后跳转到登录页面
          this.$router.push("/login");
        } catch (error) {
          alert(error.message);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;
      .cbtn {
        margin-left: 10px;
        font-size: 15px;
        width: 100px;
        height: 38px;
      }

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        border-radius: 5px;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      margin: 0 auto;
      width: 320px;
      height: 40px;
      text-align: center;
      position: relative;
      a {
        color: #1a73e8;
      }

      input,
      span {
        vertical-align: middle;
      }
      #agree {
        margin-left: 5px;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>