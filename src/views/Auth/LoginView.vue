<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

const onLogin = async () => {
  console.log(`登录 ${form.username} ${form.password}`)
}
</script>

<template>
  <div class="login-area">
    <p>登录 NMO Ecosystem</p>
    <input v-model="form.username" placeholder="用户名" />
    <input v-model="form.password" placeholder="密码" />
    <div class="button-area">
      <button @click="router.push('/auth/register')">注册</button>
      <button @click="onLogin">登录</button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.login-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-area input {
  margin-top: 0.5rem;
}
.button-area {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 5rem;
}
</style>
