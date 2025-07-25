<script lang="ts" setup>
import { reactive, ref } from 'vue';

const passwordMessage = ref<string>('修改密码')
const newPassword = reactive({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
})
const onChangePassword = async () => {
    if (newPassword.newPassword != newPassword.newPasswordConfirm) {
        passwordMessage.value = '两次输入的新密码不一致'
        return
    }
    if (newPassword.newPassword == newPassword.oldPassword) {
        passwordMessage.value = '新密码不能与旧密码相同'
        return
    }
    // TODO: 修改密码
}
</script>

<template>
    <div class="container">
        <div id="info-box">
            <span style="font-weight: bold;">我的账户</span>
            <span>账户信息 TODO</span>
        </div>
        <div id="info-box">
            <span>{{ passwordMessage }}</span>
            <input v-model="newPassword.oldPassword" type="password" placeholder="旧密码"/>
            <input v-model="newPassword.newPassword" type="password" placeholder="新密码"/>
            <input v-model="newPassword.newPasswordConfirm" type="password" placeholder="确认新密码"/>
            <button @click="onChangePassword">确认修改</button>
        </div>
    </div>
</template>

<style lang="css" scoped>
.container {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}
.container #info-box {
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    border: 2px solid gray;
    margin: 0.5rem;
}
</style>