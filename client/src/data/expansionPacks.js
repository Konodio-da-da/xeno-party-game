// client/src/data/expansionPacks.js

export const expansionPacks = [
  {
    id: 'spicyLagos',
    title: 'Afro-Lounge & Spicy Pack',
    price: '1,500 NGN ($1.50)',
    numericPrice: 1500, // <-- Added raw integer for Paystack
    description: 'Unlocks unfiltered Lagos nightlife prompts, savage roasts, and wild street-pop dares.',
    color: 'var(--accent-pink)',
    gamesIncluded: ['imposterGame', 'mostLikelyTo', 'confessionBooth']
  },
  {
    id: 'brutalTruths',
    title: 'Brutal Truths & Chaos',
    price: '1,000 NGN ($1)',
    numericPrice: 1000, // <-- Added raw integer for Paystack
    description: 'No holding back. Deep secrets, harsh relationship callouts, and maximum penalty cards.',
    color: 'var(--accent-cyan)',
    gamesIncluded: ['twoTruthsAndALie', 'biddingWar', 'upvoteDownvote']
  },
  {
    id: "after_dark_bundle",
    title: "After Dark & Couples Bundle",
    price: '2,500 NGN ($2.50)', 
    numericPrice: 2500, // <-- Added raw integer for Paystack
    description: "Unlocks all 18+, Couples, and spicy card games for the ultimate night in.",
    coverColor: "#FF1E56", 
    gamesIncluded: [
      "kinkOrPass",
      "dirtyTruthOrDrink",
      "freakyTrivia",
      "spicyDealbreakers",
      "stripOrSip",
      "naughtyBlanks",
      "dareOrDrink",
      "intimateDesires",
      "cleanAnswersDirtyMinds",
      "deepConnections",
      "kamasutraRoulette",
      "tagTheLoser",
      "girlsNightOut",
      "emojiDecryptor"
    ]
  }
];
