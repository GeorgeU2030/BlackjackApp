<template>
  <div class="flex flex-col min-h-screen items-center bg-apple-graylight p-4">
    <nav class="h-20 flex w-full items-center gap-2">
        <img src="/icon.png" alt="image" class="w-12 h-16 border rounded-xl" >
        <h1 class="text-apple-black text-2xl">Black<span class="text-apple-red">jack</span></h1>
    </nav>
    <div class="flex flex-col flex-grow w-full justify-center items-center">
        <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-md border border-apple-graydark">
        <h2 class="mb-4 text-center text-2xl font-semibold text-apple-black">Register</h2>
        <form @submit.prevent="handleRegister" class="space-y-4 flex flex-col items-center">
            <img :src="avatar" alt="avatar" class="w-18 h-18 rounded-full object-cover" />
            <div>
            <label class="block text-sm font-medium text-gray-600">Avatar</label>
            <input 
                type="url" 
                v-model="avatarInput" 
                @input="updateAvatar"
                required 
                class="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring" 
            />
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-600">Nickname</label>
            <input 
                type="text" 
                v-model="name" 
                required 
                class="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring" 
            />
            </div>
            <div>
            <label class="block text-sm font-medium text-gray-600">Email</label>
            <input 
                type="email" 
                v-model="email" 
                required 
                class="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring" 
                placeholder="email@example.com"
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
            <div>
            <label class="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input 
                type="password" 
                v-model="confirmPassword" 
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
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatarInput: '',
      avatar: 'https://cdn-icons-png.flaticon.com/512/7342/7342181.png',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      reason: '',
      apiurl: import.meta.env.VITE_API_URL
    };
  },
  methods: {
    updateAvatar() {
      if (this.isValidUrl(this.avatarInput.trim())){
        this.avatar = this.avatarInput;
      }else {
        this.avatar = 'https://cdn-icons-png.flaticon.com/512/7342/7342181.png'
      }
    },
    isValidUrl(string) {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
    },
    async handleRegister() {
      try {
        const response = await fetch(`${this.apiurl}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            avatar: this.avatar,
            name: this.name,
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword
          })
        });
        const data = await response.json();
        if (response.ok) {
          this.$router.push('/login');
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

