<template>
    <div class="min-h-screen bg-apple-graydark flex flex-col items-center">
        <!-- Navbar for home -->
        <nav class="h-20 flex w-full items-center lg:px-6 bg-white shadow-md border border-apple-graydark rounded-xl relative">
            
            <div class="items-center gap-2 flex cursor-pointer" @click="goHome">
                <img src="/icon.png" alt="image" class="w-12 h-16 border rounded-xl">
                <h1 class="text-apple-black text-2xl">Black<span class="text-apple-red">jack</span></h1>
            </div>
        
            <div class="absolute left-1/2 transform -translate-x-1/2 flex my-1 bg-apple-blue text-apple-white justify-center rounded-xl p-3 text-xl w-1/3">
                Balance: {{ availableBalance }} 🪙
            </div>
        </nav>
        <div v-if="currentBet > 0" class="mt-2 text-apple-black bg-yellow-200 p-3 rounded-xl w-5/6 lg:w-1/4 flex justify-center">
            Current Bet: ${{ currentBet }}
        </div>
        
        <!-- Main content area -->
        <div class="flex-grow w-full flex flex-col items-center ">
        
            <!-- Dealer Area-->
            <div v-if="gameState == 'playing' || gameState ==='finished'" class="mb-8 mt-2">
                <h2 class="text-apple-black text-lg mb-4 text-center">Dealer: {{ dealerScore }}</h2>
                <div class="flex justify-center gap-4">
                    <div v-for="(card, index) in dealerCards" 
                        :key="index" 
                        class="relative transition-all duration-500"
                        :style="{ transform: `translateX(${index * 20}px)` }">
                    <div class="w-24 h-40 bg-white rounded-lg shadow-lg border-2 border-apple-red flex items-center justify-center"
                        :class="{ 'animate-flip': card.isRevealing }">
                        <template v-if="card.isHidden">
                        <div class="w-full h-full bg-red-600 rounded-lg flex items-center justify-center">
                            <div class="text-white text-2xl font-bold">♠</div>
                        </div>
                        </template>
                        <template v-else>
                        <div class="text-4xl" :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                            {{ card.value }}{{ card.suit }}
                        </div>
                        </template>
                    </div>
                    </div>
                </div>
            </div>
  
            <!-- Player area -->
            <div v-if="gameState == 'playing' || gameState ==='finished'" class="mb-8">
                <h2 class="text-apple-black text-lg mb-4 text-center">Player: {{ playerScore }}</h2>
                <div class="flex justify-center gap-4">
                    <div v-for="(card, index) in playerCards" 
                        :key="index" 
                        class="relative transition-all duration-500"
                        :style="{ transform: `translateX(${index * 20}px)` }">
                        <div class="w-24 h-40 bg-white rounded-lg shadow-xl border-2 border-apple-red flex items-center justify-center animate-deal">
                            <div class="text-4xl" :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                            {{ card.value }}{{ card.suit }}
                            </div>
                        </div>
                    <!-- Select the value of A -->
                        <div v-if="card.value === 'A' && !card.aceValueSelected" 
                            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg p-2 shadow-xl">
                            <div class="text-center text-sm font-bold mb-2">Value:</div>
                            <div class="flex gap-2">
                            <button @click="selectAceValue(index, 1)" 
                                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400">
                                1
                            </button>
                            <button @click="selectAceValue(index, 11)" 
                                    class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400">
                                11
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Controls of Game -->
            <div class="flex justify-center lg:w-1/3 flex-grow items-center gap-3">
                <template v-if="gameState === 'playing'">
                <button @click="hit" 
                        :disabled="hasUnselectedAce"
                        class="px-6 py-2 bg-apple-blue h-12 w-28 cursor-pointer text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50">
                    Hit
                </button>
                <button @click="stand" 
                        :disabled="hasUnselectedAce"
                        class="px-6 py-2 bg-apple-blue h-12 w-28 cursor-pointer text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50">
                    Stand
                </button>
                <button v-if="canDouble" 
                        @click="double"
                        :disabled="hasUnselectedAce"
                        class="px-6 py-2 bg-apple-blue h-12 w-28 cursor-pointer text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50">
                    Double
                </button>
                </template>
                <template v-else-if="gameState === 'finished' ">
                  <button @click="newRound" 
                          :disabled="chips === 0"
                          class="px-6 py-2 bg-apple-blue h-12 w-40 cursor-pointer text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50">
                    New Round
                  </button>
                </template>
            </div>
            
            <!-- Result Message -->
            <div v-if="message" 
                 class="mt-8 text-center text-lg text-white font-bold p-4 rounded-lg"
                 :class="[
                   messageType === 'success' ? 'bg-green-400' : 
                   messageType === 'error' ? 'bg-apple-red' : 
                   'bg-apple-blue',
                   { 'animate-bounce': gameState === 'finished' }
                 ]">
              {{ message }}
            </div>
        </div>
                
        <!-- Betting Panel -->
        <div v-if="gameState === 'betting' && availableBalance > 0" class="w-full lg:w-1/3 text-center mb-4 flex justify-center items-center h-72 lg:h-72 bg-yellow-200">
            <div class=" w-full rounded-lg p-4 flex h-full bg-apple-blue flex-col items-center justify-center">
                    <div class="text-white text-center mb-4 text-lg">Select your Bet</div>
                    <div class="flex gap-4 justify-center flex-wrap w-2/3">
                        <button v-for="bet in availableChips" 
                                :key="bet"
                                @click="placeBet(bet)"
                                :disabled="availableBalance < bet"
                                class="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-transform hover:scale-110 bg-yellow-200 hover:bg-yellow-300 cursor-pointer"
                                >
                            ${{ bet }}
                        </button>
                    </div>
                <div class="flex justify-center w-full gap-3">
                    <button 
                        v-if="currentBet > 0"
                        @click="resetBet"
                        class="mt-4 w-32 py-2 bg-apple-red text-white rounded-lg hover:bg-red-600 cursor-pointer">
                        Reset Bet
                    </button>
                    <button 
                        v-if="currentBet > 0"
                        @click="startRound"
                        class="mt-4 w-32 py-2 bg-apple-graylight rounded-lg hover:bg-apple-graydark cursor-pointer">
                        To Deal
                    </button>
                </div>
            </div>
        </div>
        <div v-else-if="availableBalance == 0" class="w-full lg:w-1/3 text-center mb-4 flex justify-center items-center h-72 lg:h-60 bg-yellow-200 rounded-xl flex-col">
            <h1>You have run out of coins, to get 100 coins click the button</h1>
            <button class="p-3 bg-apple-blue text-white rounded-xl mt-2 cursor-pointer" @click="getCoins">
            GET COINS
            </button>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { ref, computed, defineComponent, onMounted } from 'vue';

export default defineComponent({
    name: 'BlackjackGame',
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();
        
        // Messages for the Game
        const message = ref('');
        const messageType = ref('');
        
        // State of the Game
        const gameState = ref('betting');
        const currentBet = ref(0);
        const initialChips = [5, 10, 20, 50, 100, 200, 500];
        
        // Cards for dealer and player
        const playerCards = ref([]);
        const dealerCards = ref([]);
        
        // Deck of cards
        const deck = ref([]);
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        // functions
        // Create a deck of cards with the suites and values
        function createDeck() {
          const newDeck = [];
          for (const suit of suits) {
            for (const value of values) {
              newDeck.push({ suit, value, isHidden: false });
            }
          }
          return shuffle(newDeck);
        }
        
        // Shuffle the deck
        function shuffle(array) {
          const newArray = [...array];
          for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
          }
          return newArray;
        }
        
        // Draw a card from the deck
        function drawCard() {
          const card = deck.value.pop();
          if (card.value === 'A') {
            card.aceValueSelected = false;
            card.aceValue = null;
          }
          return card;
        }
        
        // select the ace value 1 or 11
        function selectAceValue(cardIndex, value) {
          const card = playerCards.value[cardIndex];
          card.aceValue = value;
          card.aceValueSelected = true;
        
          if (playerScore.value > 21) {
            endRound('¡Te has pasado! Pierdes', 'error');
          }
        }
        
        // Scores
        
        // this function calculate the score for the dealer
        function calculateScore(cards) {
          let score = 0;
          let aces = 0;
        
          for (const card of cards) {
            if (card.value === 'A') {
              aces += 1;
              score += 11;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
              score += 10;
            } else {
              score += parseInt(card.value);
            }
          }
        
          while (score > 21 && aces > 0) {
            score -= 10;
            aces -= 1;
          }
        
          return score;
        }
        
        // Calculate the score of the cards for the player 
        const playerScore = computed(() => {
          let score = 0;
          for (const card of playerCards.value) {
            if (card.value === 'A') {
              score += card.aceValue || 0;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
              score += 10;
            } else {
              score += parseInt(card.value) || 0;
            }
          }
          return score;
        });
        
        // Calculate the score of the cards for the dealer
        const dealerScore = computed(() => {
          const visibleCards = dealerCards.value.filter(card => !card.isHidden);
          return calculateScore(visibleCards);
        });
        
        // Verifications
        // Verify aces without verification
        const hasUnselectedAce = computed(() => {
          return playerCards.value.some(card => 
            card.value === 'A' && !card.aceValueSelected
          );
        });
        
        // Verify if the player can double
        const canDouble = computed(() => {
          return gameState.value === 'playing' && 
                 playerCards.value.length === 2 && 
                 availableBalance.value >= currentBet.value;
        });
        
        // Computed properties
        // Calculate the available balance
        const availableBalance = ref(authStore.user?.currentBalance || 0);


        // Calculate the available chips
        const availableChips = computed(() => {
            return initialChips.filter(chip => chip <= availableBalance.value);
        });
        
        // Methods
        // Update the current bet and available balance
        const placeBet = (amount) => {
            if (availableBalance.value >= amount) {
                currentBet.value += amount;
                availableBalance.value -= amount;
            }
        };

        // Reset the current bet
        const resetBet = () => {
            currentBet.value = 0;
        };
        
        async function dealerPlay() {
          // Reveal the hidden card
          dealerCards.value[1].isHidden = false;
          dealerCards.value[1].isRevealing = true;
          
          // Wait for the card to reveal
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Dealer draws cards until score is 17 or higher
          while (calculateScore(dealerCards.value) < 17) {
            dealerCards.value.push(drawCard());
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          // Calculate the final score
          const dealerFinalScore = calculateScore(dealerCards.value);
          
          if (dealerFinalScore > 21) {
            endRound('¡Dealer se pasa! ¡Ganas!', 'success');
          } else if (dealerFinalScore > playerScore.value) {
            endRound('¡Dealer gana!', 'error');
          } else if (dealerFinalScore < playerScore.value) {
            endRound('¡Ganas!', 'success');
          } else {
            endRound('¡Empate!', 'info');
          }
        }
        
        // End the round
        async function endRound(msg, type) {
            message.value = msg;
            messageType.value = type;
            gameState.value = 'finished';
            
            // Init the increments
            let newWins = 0;
            let newBlackjacks = 0;
            let newBalance = authStore.user.currentBalance; 
            
            // Verify blackjack
            if (playerScore.value === 21) {
                newBlackjacks += 1;
            }
            
            // update the balance
            if (type === 'success') {
                newBalance += currentBet.value;
                newWins += 1;
            } else if (type === 'info') { // Draw

            } else {
                newBalance -= currentBet.value;
            }
            
            try {
                await authStore.updateUserBalance({
                    currentBalance: newBalance,
                    wins: newWins,
                    blackjacks: newBlackjacks
                });
                
                // update the balance in the ui
                availableBalance.value = newBalance;
            } catch (error) {
                console.error('Error updating user data:', error);
                message.value = 'Error al actualizar los datos. Por favor, recarga la página.';
                messageType.value = 'error';
            }
        }
        
        // New round
        function newRound() {
          if (availableBalance.value === 0) {
            message.value = '¡Te has quedado sin fichas! Refresca la página para empezar de nuevo.';
            messageType.value = 'error';
            return;
          }
          
          currentBet.value = 0;
          gameState.value = 'betting';
          playerCards.value = [];
          dealerCards.value = [];
          message.value = '';
        }
        
        // Actions of player
        // Hit action
        function hit() {
          if (hasUnselectedAce.value) return;
          
          playerCards.value.push(drawCard());
          
          if (playerScore.value > 21) {
            endRound('¡Te has pasado! Pierdes', 'error');
          }
        }
        
        // Stand action
        function stand() {
          if (hasUnselectedAce.value) return;
          dealerPlay();
        }
        
        // Double action
        function double() {
          if (hasUnselectedAce.value || !canDouble.value) return;
          
          currentBet.value *= 2;
          
          playerCards.value.push(drawCard());
          
          if (playerScore.value > 21) {
            endRound('¡Te has pasado! Pierdes', 'error');
          } else {
            dealerPlay();
          }
        }
        
        // To deal action to start the round
        const startRound = () => {
          if (currentBet.value == 0) return;
          // the state change to playing, not show more the betting panel
          gameState.value = 'playing';
          // create the deck
          deck.value = createDeck();
          
          // deal the cards, for the player and the dealer
          playerCards.value = [drawCard(), drawCard()];
          dealerCards.value = [drawCard(), { ...drawCard(), isHidden: true }];
          
          // message
          message.value = '';
        };
        
        // home action
        const goHome = () => {
            router.push('/home');
        };
        
        // Get coins action
        const getCoins = async () => {
          try {
            await authStore.updateUserBalance({
              currentBalance: 100,
              wins: 0,
              blackjacks: 0
            });
            availableBalance.value = 100;
            goHome();
          }catch(error) {
            console.error('Error updating user data:', error);
            message.value = 'Error al actualizar los datos. Por favor, recarga la página.';
            messageType.value = 'error';
          }
        }
        
        // Lifecycle hooks
        onMounted(() => {
            // Verify the user
            if (!authStore.user) {
                router.push('/login');
                return;
            }
            currentBet.value = 0;
        });

        return {
            gameState,
            currentBet,
            availableChips,
            availableBalance,
            placeBet,
            resetBet,
            goHome,
            authStore,
            playerCards,
            dealerCards,
            startRound,
            message,
            messageType,
            playerScore,
            dealerScore,
            hasUnselectedAce,
            selectAceValue,
            canDouble,
            hit,
            stand,
            double,
            newRound,
            getCoins
        };
    }
});
</script>