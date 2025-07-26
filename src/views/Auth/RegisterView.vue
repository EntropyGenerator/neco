<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
  password2: '',
})

const onRegister = async () => {
  console.log(`登录 ${form.username} ${form.password}`)
}
</script>

<template>
  <div class="register-area">
    <p>注册 NMO Ecosystem</p>
    <input v-model="form.username" placeholder="用户名" />
    <input v-model="form.password" placeholder="密码" />
    <input v-model="form.password2" placeholder="确认密码" />
    <div class="button-area">
      <button @click="router.push('/auth/login')">登录</button>
      <button @click="onRegister">注册</button>
    </div>
  </div>
</template>

<style lang="css" scoped>
.register-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-area input {
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
