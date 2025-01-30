<template>
  <div class="flex flex-col min-h-screen items-center bg-apple-graylight p-4">
   
    <nav class="h-20 flex w-full items-center justify-between lg:px-6 bg-white shadow-md border border-apple-graydark rounded-xl">
      <div class="items-center gap-2 hidden lg:flex">
        <img src="/icon.png" alt="image" class="w-12 h-16 border rounded-xl">
        <h1 class="text-apple-black text-2xl">Black<span class="text-apple-red">jack</span></h1>
      </div>
      <div class="flex gap-2 items-center justify-center bg-apple-gray rounded-xl px-1 mx-1 lg:mx-0 lg:px-6 my-1 border border-apple-red">
        <img :src="authStore.user?.avatar" alt="avatar" class="h-14 w-14 rounded-full" />
        <h1 class="text-xl"> {{ authStore.user?.name }}</h1>
      </div>
      <button 
        @click="logout" 
        class="bg-apple-red text-white px-4 py-2 mr-1 lg:mr-0 rounded-lg hover:bg-red-600 transition duration-200 cursor-pointer"
      >
        Logout
      </button>
    </nav>

    
    <div class="flex flex-col flex-grow w-full max-w-2xl justify-center items-center text-center space-y-6">
      
      <div class="w-full bg-white shadow-md border border-apple-graydark rounded-xl p-6">
        <h2 class="text-xl font-semibold text-apple-black mb-4">🏆 Top 10 Players</h2>
        <ul v-if="ranking.length" class="space-y-2">
          <li 
            v-for="(player, index) in ranking" 
            :key="index" 
            class="flex justify-between p-2 border-b border-gray-200"
          >
            <span class="font-medium w-full text-center sm:w-48 sm:text-start">{{ index + 1 }}. {{ player.name }}</span>
            <span class="text-apple-blue font-bold w-48 hidden sm:flex justify-center">{{ player.maxBalance }} 🪙 </span>
            <span class="w-32 hidden sm:flex justify-center"> {{ player.wins }} W</span>
            <span class="w-32 hidden sm:flex justify-center"> {{ player.blackjacks }} BJ</span>
          </li>
        </ul>
        <p v-else class="text-gray-500">No ranking data available</p>
      </div>

     
      <button 
        @click="startGame" 
        class="w-40 bg-apple-blue text-white text-xl font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer"
      >
        Play Now
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue"

export default {
  
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const ranking = ref([]);
    const apiurl = import.meta.env.VITE_API_URL;
    
    const logout = () => {
      authStore.logout();
      router.push("/login");
    };
    
    const fetchTop = async () => {
      const response = await fetch(`${apiurl}/players/top`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      const data = await response.json();
      ranking.value = data;
    };
    
    onMounted(() => {
      fetchTop();
    });
    
    return { authStore, logout, ranking };
  },
  methods: {
    
    startGame() {
      this.$router.push("/game");
    }
  }
};
</script>


