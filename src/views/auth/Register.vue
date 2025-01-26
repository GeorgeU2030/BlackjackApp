<template>
  <div class="register">
    <form @submit.prevent="handleRegister" class="bg-apple-red">
      <input type="text" v-model="username" class="border-2 border-white" required />
      <input type="email" v-model="email" required />
      <input type="password" v-model="password" required />
      <button type="submit">Registrarse</button>
    </form>
  </div>
</template>
