import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
  }),
  getters: {
      isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(userData, token) {
        this.user = userData;
        this.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    },
    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    async updateUserBalance(newData) {
      try {
        // API call to update user balance
        const response = await fetch(`${import.meta.env.VITE_API_URL}/players/update/${this.user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify(newData)
        });
        
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error: ${response.status} - ${errorMessage}`);
        }
        // Update local user data
        this.user = {
          ...this.user,
          currentBalance: newData.currentBalance,
          wins: newData.wins,    
          blackjacks: newData.blackjacks,
        };
        
        localStorage.setItem('user', JSON.stringify(this.user));
        return response;
      } catch (error) {
        console.error('Failed to update balance:', error);
        throw error;
      }
    }
  }
})