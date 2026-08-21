// client/src/store/gameStore.js
import { create } from 'zustand';

const defaultDeck = [
  // --- Let's Get Drunk / Core Deck ---
  { id: 1, type: "rule", text: "Waterfall! Everyone starts drinking. You can't stop until the person to your right stops." },
  { id: 2, type: "dare", text: "[Player A], let the group send one text to anyone in your contacts, or finish your drink." },
  { id: 3, type: "truth", text: "[Player A], who in this room are you most attracted to? Refuse to answer and take 2 sips." },
  { id: 4, type: "action", text: "Categories: Fast Food Chains. First to pause or repeat drinks." },
  { id: 5, type: "callout", text: "[Player A], point to the person most likely to get arrested tonight. They take 1 sip." },
  { id: 6, type: "truth", text: "[Player A], what is the most childish secret you still hide from your parents?" },
  { id: 7, type: "dare", text: "[Player A] and [Player B] must lock arms and finish your next drink together without using your hands." },
  { id: 8, type: "rule", text: "New Law: For the rest of the game, no one is allowed to say the word 'Drink'. Violation = 2 sips." },
  { id: 9, type: "action", text: "[Player A], act out your favorite movie title using only body movements until someone guesses it." },
  { id: 10, type: "truth", text: "[Player A], what is the most embarrassing lie you've ever told to get out of hanging out with someone?" },

  // --- Truth or Dare (Classic & Extreme) ---
  { id: 11, type: "truth", text: "[Player A], what is the weirdest text message sitting in your drafts right now?" },
  { id: 12, type: "dare", text: "[Player A], let [Player B] style your hair however they want for the next 3 rounds." },
  { id: 13, type: "truth", text: "[Player A], what's your most toxic dating trait that you refuse to fix?" },
  { id: 14, type: "dare", text: "[Player A], do an impression of your absolute least favorite celebrity until someone guesses who it is." },

  // --- Never Have I Ever ---
  { id: 15, type: "never-have-i-ever", text: "Never have I ever pretended to be asleep or busy to avoid talking to someone in this room." },
  { id: 16, type: "never-have-i-ever", text: "Never have I ever stalked an ex's new partner on social media and accidentally liked a photo." },
  { id: 17, type: "never-have-i-ever", text: "Never have I ever walked out of a movie theater because the film was completely trash." },

  // --- Rulebook & Physical Laws ---
  { id: 18, type: "rule", text: "T-Rex Arms: For the next 3 rounds, you must keep your elbows tucked tightly against your ribs when holding your cup." },
  { id: 19, type: "rule", text: "The Floor is Lava: The last person to lift their feet off the ground takes 2 sips." },
  { id: 20, type: "rule", text: "Accent Challenge: Everyone must speak in a British accent for the next 2 rounds. Breaking character = 1 sip." },

  // --- Would You Rather (Brutal Edition) ---
  { id: 21, type: "dilemma", text: "[Player A], would you rather accidentally text your mom your search history or let your boss read your direct messages for a month?" },
  { id: 22, type: "dilemma", text: "[Player A], would you rather have skin that changes color based on your mood or hair that permanently grows 1 inch every hour?" }
];

export const useGameStore = create((set) => ({
  deck: defaultDeck,
  currentIndex: 0,
  
  nextCard: () => set((state) => ({
    currentIndex: (state.currentIndex + 1) % state.deck.length 
  })),

  shuffleDeck: () => set((state) => {
    const shuffled = [...state.deck].sort(() => Math.random() - 0.5);
    return { deck: shuffled, currentIndex: 0 };
  })
}));
