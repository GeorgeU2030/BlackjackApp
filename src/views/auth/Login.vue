<template>
  <div class="login">
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" required />
      <input type="password" v-model="password" required />
      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
</template>