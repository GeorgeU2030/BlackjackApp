<template>
  <div class="flex min-h-screen items-center justify-center bg-apple-graylight p-4">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-md border border-apple-graydark">
      <h2 class="mb-4 text-center text-2xl font-semibold text-apple-black">Log<span class="text-apple-red">in</span></h2>
      <form @submit.prevent="handleLogin" class="space-y-4 flex flex-col items-center">
        <div>
          <label class="block text-sm font-medium text-gray-600">Email</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            class="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring" 
            placeholder="tucorreo@example.com"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600">Password</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            class="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring" 
          />
        </div>
        <p v-if="reason" class="mt-2 text-center text-apple-red w-3/4">{{ reason }}</p>
        <button 
          type="submit" 
          class="w-full rounded-md bg-apple-blue p-2 text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          Continue
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-gray-600">
        You don't have an account? <a href="/register" class="text-blue-500 hover:underline">Register</a>
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      reason: '',
      apiurl: import.meta.env.VITE_API_URL
    };
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch(`${this.apiurl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.reason || 'Login failed');
        
        this.authStore.login(data.user, data.token);
        
        if (response.ok) {
          localStorage.setItem('token', data.token);
          this.$router.push('/home');
        } else {
          this.reason = data.reason;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>