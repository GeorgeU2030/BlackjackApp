<script setup>
import LandingImage from '@/assets/images/landing.webp';
</script>

<template>
  <div class="min-h-screen bg-apple-graylight flex flex-col items-center">
    
    <h1 class="text-5xl mt-6 font-bold">
      Black<span class="text-apple-red">jack</span>
    </h1>
    
    <h2 class="text-xl text-gray-600 mt-2">
      The most fun way to play Blackjack
    </h2>
    
    <section class="p-6 w-11/12 lg:w-1/3 mt-4 bg-apple-gray rounded-xl border border-apple-red shadow-lg">
      <img :src="LandingImage" alt="Blackjack preview" class="w-full h-80 rounded-xl"/>
    </section>
    
    <section class="flex flex-col items-center justify-center gap-4 mt-6">
      <router-link
        to="/login"
        class="bg-apple-blue text-white font-bold w-48 py-2 text-center rounded-xl shadow-lg hover:shadow-2xl transition-all"
      >
        Login
      </router-link>
      <router-link
        to="/register"
        class="bg-apple-blue text-white font-bold w-48 py-2 text-center rounded-xl shadow-lg hover:shadow-2xl transition-all"
      >
        Register
      </router-link>
    </section>
    
    <p class="text-center text-apple-black w-5/6 lg:w-1/3 mt-4">
      Enjoy the classic card game from anywhere. Compete against other players, climb the rankings and test your Blackjack skills.
    </p>
    
    <footer class="mt-auto py-4 bg-gray-200 text-center text-gray-600 text-sm w-full">
      © 2025 Blackjack. All rights reserved.
    </footer>
  </div>
</template>
