<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const logout = () => {

}
</script>
<template>
    <div class="management-area">
        <div class="management-menu">
            <span>NMO管理后台</span>
            <button @click="router.push('/management/user')">用户管理</button>
            <button @click="router.push('/management/club')">社团管理</button>
            <button @click="router.push('/management/server')">服务器信息</button>
            <button @click="router.push('/management/activity')">活动管理</button>
            <button @click="router.push('/management/news')">新闻管理</button>
            
            <button @click="logout" style="margin-top: auto;">登出</button>
        </div>
        main
        <RouterView/>
    </div>
</template>
<style lang="css" scoped>
.management-area {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
}
.management-menu {
    display: flex;
    flex-direction: column;
    padding:1rem;
}
.management-menu button {
    margin-top:0.5rem;
}
</style>