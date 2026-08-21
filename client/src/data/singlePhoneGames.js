// client/src/data/singlePhoneGames.js

export const singlePhoneGamesCatalog = {
  letsGetDrunk: {
    id: "letsGetDrunk",
    title: "Let's Get Drunk",
    category: "Single Phone",
    description: "The core card-drawing game mixing group rules, single-target penalties, and mini-challenges.",
    prompts: [
      // --- ORIGINAL CORE PROMPTS ---
      { type: "rule", text: "Waterfall! Everyone starts drinking. You can't stop until the person to your right stops." },
      { type: "dare", text: "[Player A], let the group send one text to anyone in your contacts, or finish your drink." },
      { type: "truth", text: "[Player A], who in this room are you most attracted to? Refuse to answer and take 2 sips." },
      { type: "action", text: "Categories: Fast Food Chains. First to pause or repeat drinks." },
      { type: "callout", text: "[Player A], point to the person most likely to get arrested tonight. They take 1 sip." },
      { type: "rule", text: "Thumb Master! Whenever you place your thumb on the edge of the table, everyone else must do the same. Last person drinks." },
      { type: "dare", text: "[Player A], do your best impression of crying like a baby after losing money in a bet." },
      { type: "truth", text: "[Player A], what is the most embarrassing lie you've ever told to impress a crush?" },
      { type: "action", text: "Rhyme Time! Say a word, and go around the circle rhyming. First person to fail drinks 2 sips." },
      { type: "callout", text: "[Player A] and [Player B] must arm wrestle right now. Loser finishes their drink." },
      
      // --- SPICY & LEWD TRUTHS ---
      { type: "truth", text: "[Player A], what is the highest number of times you've 'done it' in one day? Refuse to answer? 3 sips." },
      { type: "truth", text: "[Player A], who is the last person you thought about while touching yourself? Drink 3 sips if you lie." },
      { type: "truth", text: "[Player A], have you ever sent nudes to someone in this room? Drink 2 sips if you plead the fifth." },
      { type: "truth", text: "[Player A], what's your favorite bedroom position? Explain it in detail or take a shot." },
      { type: "truth", text: "[Player A], have you ever hooked up with two different people in the same 24 hours? 2 sips if yes." },
      { type: "truth", text: "[Player A], what's the weirdest or riskiest place you've ever had sex? Refuse to answer and finish your drink." },
      { type: "truth", text: "[Player A], who in this room do you think is a complete freak in the sheets? Name them or take 3 sips." },
      { type: "truth", text: "[Player A], have you ever faked an orgasm? If yes, who was it with? Drink if you won't say." },
      { type: "truth", text: "[Player A], describe your worst sexual experience without naming names. Take 3 sips if you refuse." },
      { type: "truth", text: "[Player A], what is your wildest sexual fantasy? Keep it a secret and take a shot." },

      // --- WILD DARES ---
      { type: "dare", text: "[Player A], let [Player B] send a voice note to the last person you texted, or take a shot." },
      { type: "dare", text: "[Player A], demonstrate how you whine your waist to an Amapiano beat, or drink 3 sips." },
      { type: "dare", text: "[Player A], let the group blindfold you and guess who is touching your face. Guess wrong? Drink." },
      { type: "dare", text: "[Player A], give the person to your right a sensual neck massage for 30 seconds, or down your drink." },
      { type: "dare", text: "[Player A], show the group your phone's screen time and most used apps. If a dating app is in the top 3, take a shot." },
      { type: "dare", text: "[Player A], fake an orgasm for 10 seconds right now. Refuse? Finish your drink." },
      { type: "dare", text: "[Player A], let the person across from you sit on your lap for the next 3 turns, or drink 4 sips." },
      { type: "dare", text: "[Player A], do a body shot off [Player B] or both of you take 3 sips." },
      { type: "dare", text: "[Player A], let someone go through your camera roll's 'Recently Deleted' folder for 15 seconds, or take a shot." },
      { type: "dare", text: "[Player A], text your ex 'I miss us' or down your entire drink right now." },

      // --- BRUTAL CALLOUTS ---
      { type: "callout", text: "[Player A], pick the person you think is the biggest toxic player in the room. They must drink 3 sips." },
      { type: "callout", text: "Whoever is wearing the most expensive outfit right now, take 2 sips for flexing on us." },
      { type: "callout", text: "Anyone who has ever kissed someone of the same sex, take 2 sips." },
      { type: "callout", text: "If you've ever paid for Tinder Gold or Bumble Premium, take 3 sips of absolute shame." },
      { type: "callout", text: "[Player A], point to the person you'd call if you needed to hide a body. They drink 2 sips." },
      { type: "callout", text: "Anyone who is currently single, drink 2 sips to your freedom (or loneliness)!" },
      { type: "callout", text: "[Player A] and [Player B], you are now drinking buddies. When one drinks, the other drinks. Ends in 4 rounds." },
      { type: "callout", text: "Anyone who has ghosted someone in the last 3 months, take 2 sips." },

      // --- GROUP ACTIONS & RULES ---
      { type: "rule", text: "T-Rex Arms! Everyone must drink with their elbows pinned to their sides. Last to do it drinks 2 sips." },
      { type: "action", text: "The Floor is Lava! Last person to get their feet off the ground takes 3 sips." },
      { type: "rule", text: "No pointing! Anyone who points with their finger must drink. Use your lips or elbows to point instead. Ends in 3 rounds." },
      { type: "rule", text: "Accents only! Everyone must speak in a fake accent. Break character, take a sip. Ends next round." },
      { type: "rule", text: "Left-hand drinking! Hold your cup with your non-dominant hand. Caught using the wrong hand? 2 sips." },
      { type: "action", text: "Categories: Sex Toys. First person to pause, repeat, or run out of ideas takes 2 sips." },
      { type: "action", text: "Rhyme Time! The word is 'Spicy'. Go around the circle. First to fail takes 2 sips." },
      { type: "action", text: "Never Have I Ever: Had a one-night stand. Anyone who has takes 2 sips." },
      { type: "action", text: "Most Likely To: Steal someone's partner. On the count of 3, point! The person with the most fingers pointing at them drinks." },
      { type: "action", text: "Categories: Afrobeats Artists. First to stutter drinks." },
      { type: "action", text: "Medusa! Everyone look down at your laps. On the count of 3, look up at someone. If you make eye contact, both drink!" },
      { type: "action", text: "Categories: Excuses to avoid having sex. Go! First to pause drinks 3 sips." }
    ]
  },
  truthOrDare: {
    id: "truthOrDare",
    title: "Truth or Dare (Extreme)",
    category: "Single Phone",
    description: "Swipe left for a spicy truth, right for a wild dare.",
    prompts: [
      // --- ORIGINAL PROMPTS ---
      { type: "truth", text: "[Player A], what is the weirdest search history item you've hidden this month?" },
      { type: "dare", text: "[Player A], let the group scroll through your hidden photos folder for 30 seconds." },
      { type: "truth", text: "[Player A], who in this room are you most sexually attracted to? Refuse and take 3 sips." },
      { type: "dare", text: "[Player A], demonstrate your favorite bedroom position using a pillow." },
      { type: "truth", text: "[Player A], what is the most illegal thing you've ever done during a night out?" },
      { type: "dare", text: "[Player A], show the room your last 5 Google searches, no matter how bad they are." },
      { type: "truth", text: "[Player A], what's your most toxic dating trait that you refuse to fix?" },
      { type: "dare", text: "[Player A], do your best street-hop dance move right now or take 3 sips." },
      { type: "truth", text: "[Player A], have you ever cheated or been the 'other person' in a relationship?" },
      { type: "dare", text: "[Player A], send a 'You up?' text to the third person in your recent contacts." },
      { type: "truth", text: "[Player A], what is the biggest lie you've ever told to get someone into bed?" },
      { type: "dare", text: "[Player A], let the person to your right send an Instagram DM to anyone they want from your account." },
      { type: "truth", text: "[Player A], what is the most embarrassing place you have ever thrown up?" },
      { type: "dare", text: "[Player A], let another player text your ex and you cannot explain it until tomorrow." },
      { type: "truth", text: "[Player A], what is the pettiest reason you've ever swiped left on someone?" },
      { type: "dare", text: "[Player A], lick the neck of the person sitting to your left." },
      { type: "truth", text: "[Player A], what is a kink you have that you've never told anyone about?" },
      { type: "dare", text: "[Player A], take a shot off the stomach of the player across from you." },
      { type: "truth", text: "[Player A], rank the top 3 people in this room by looks." },
      { type: "dare", text: "[Player A], give the person to your right a lap dance for 1 full minute." },
      { type: "truth", text: "[Player A], what is the worst date you've ever been on and why?" },
      { type: "dare", text: "[Player A], take off one item of clothing right now." },
      { type: "truth", text: "[Player A], have you ever hooked up with a friend's sibling?" },
      { type: "dare", text: "[Player A], call a random contact and whisper heavily into the phone for 10 seconds." },
      { type: "truth", text: "[Player A], what is the most desperate thing you've done to get someone's attention?" },
      { type: "dare", text: "[Player A], let the group look at the DMs of the last person you messaged on Instagram." },

      // --- BRAND NEW SPICY PROMPTS (25+) ---
      { type: "truth", text: "[Player A], what is the longest you have gone without sex since losing your virginity? Drink if you lie." },
      { type: "truth", text: "[Player A], based purely on vibes, who in this room do you think would be the best in bed?" },
      { type: "truth", text: "[Player A], have you ever slept with an ex while they were in a new relationship? Refuse and take 3 sips." },
      { type: "truth", text: "[Player A], what is the most awkward text you've received immediately after hooking up with someone?" },
      { type: "truth", text: "[Player A], have you ever faked being drunk just to have an excuse to kiss or touch someone?" },
      { type: "truth", text: "[Player A], name the person in this room you would most want to be handcuffed to a bed with for 24 hours." },
      { type: "truth", text: "[Player A], what is the biggest 'ick' you've discovered about someone right before getting intimate?" },
      { type: "truth", text: "[Player A], have you ever lied about your location so you could go link up with someone secretly?" },
      { type: "truth", text: "[Player A], who is the last person you searched for on Instagram when you were feeling lonely or horny?" },
      { type: "truth", text: "[Player A], what is the most scandalous photo currently hiding in your 'My Eyes Only' or locked folder?" },
      { type: "truth", text: "[Player A], have you ever caught serious feelings for a friend with benefits?" },
      { type: "truth", text: "[Player A], have you ever accidentally sent a spicy text or picture to a family member?" },
      { type: "truth", text: "[Player A], describe your absolute worst walk of shame in full detail." },
      { type: "dare", text: "[Player A], let the person to your left send a risky text to anyone in your contacts. Refuse and take a shot." },
      { type: "dare", text: "[Player A], put on a blindfold. Someone in the group will kiss your neck. You have to guess who it was. Drink if wrong." },
      { type: "dare", text: "[Player A], call an ex and tell them you had a very dirty dream about them last night. Refuse and take 4 sips." },
      { type: "dare", text: "[Player A], post a highly suggestive, cryptic status on your WhatsApp right now and leave it up for 1 hour." },
      { type: "dare", text: "[Player A], let the group pick one person to whisper something incredibly dirty into your ear." },
      { type: "dare", text: "[Player A], take a shot or sip of your drink without using your hands (someone else has to pour it into your mouth)." },
      { type: "dare", text: "[Player A], demonstrate your absolute best 'O-face' for 5 full seconds while looking at the person across from you." },
      { type: "dare", text: "[Player A], swap a piece of clothing with the person to your right immediately. Refuse and down your drink." },
      { type: "dare", text: "[Player A], twerk or whine your waist for 15 seconds to a song of the group's choice, or take 3 sips." },
      { type: "dare", text: "[Player A], you must speak in a seductive whisper for the next 3 rounds. If you speak normally, take a sip." },
      { type: "dare", text: "[Player A], sit on the floor at the feet of the person to your left until it's your turn again." },
      { type: "dare", text: "[Player A], open your photo gallery, close your eyes, and scroll randomly. You must post the photo your finger lands on to your story." }
    ]
  },
  neverHaveIEver: {
    id: "neverHaveIEver",
    title: "Never Have I Ever (Uncensored)",
    category: "Single Phone",
    description: "The app feeds prompts. Anyone who has done it loses a life or takes a sip.",
    prompts: [
      { type: "never", text: "Never have I ever role-played during sex." },
      { type: "never", text: "Never have I ever sent my partner a spicy picture while they were at work." },
      { type: "never", text: "Never have I ever hooked up with someone without knowing their last name." },
      { type: "never", text: "Never have I ever joined or paid for an OnlyFans." },
      { type: "never", text: "Never have I ever had a friend with benefits." },
      { type: "never", text: "Never have I ever had sex at a wedding or a major party." },
      { type: "never", text: "Never have I ever lied about my 'body count'." },
      { type: "never", text: "Never have I ever hooked up with a co-worker." },
      { type: "never", text: "Never have I ever stalked an ex's new partner and accidentally liked a photo." },
      { type: "never", text: "Never have I ever recorded a bedroom video." },
      { type: "never", text: "Never have I ever faked an orgasm just to get it over with." },
      { type: "never", text: "Never have I ever claimed I knew a famous artist just to impress someone at a club." },
      { type: "never", text: "Never have I ever sent or received nudes." },
      { type: "never", text: "Never have I ever had a dirty dream about someone in this exact room." },
      { type: "never", text: "Never have I ever been caught in the act by a family member." },
      { type: "never", text: "Never have I ever kissed more than two people in one night." },
      { type: "never", text: "Never have I ever used a dating app just for a free meal." },
      { type: "never", text: "Never have I ever cried during sex." },
      { type: "never", text: "Never have I ever sent a risky text and immediately turned my phone on airplane mode." },
      { type: "never", text: "Never have I ever had a crush on a teacher or professor." },
      { type: "never", text: "Never have I ever snuck out of the house to meet a link up." },
      { type: "never", text: "Never have I ever fought a bouncer or a conductor." },
      { type: "never", text: "Never have I ever gone to work completely hungover or still drunk." },
      { type: "never", text: "Never have I ever lied about my income on a date." }
    ]
  },
  categoriesWaterfall: {
    id: "categoriesWaterfall",
    title: "Categories / Waterfall",
    category: "Single Phone",
    description: "The screen displays a category. Players take turns naming one. First to pause or repeat drinks.",
    prompts: [
      { type: "category", text: "Category: Brands of Tequila or Vodka. Go!" },
      { type: "category", text: "Category: Things you find in a hotel room that you shouldn't steal. Go!" },
      { type: "category", text: "Category: Excuses to leave a party early. Go!" },
      { type: "category", text: "Category: High-end luxury fashion brands. Go!" },
      { type: "category", text: "Category: Car brands. Go!" },
      { type: "category", text: "Category: Red flags to look out for on a first date. Go!" },
      { type: "category", text: "Category: Popular Afrobeats artists. Go!" },
      { type: "category", text: "Category: Slang words for being completely drunk or high. Go!" },
      { type: "category", text: "Category: Places you would absolutely not want to be caught naked. Go!" },
      { type: "category", text: "Category: Classic Nigerian street food and party small chops. Go!" },
      { type: "category", text: "Category: Lies people tell their parents to sneak out. Go!" },
      { type: "category", text: "Category: The worst possible places to break up with someone. Go!" },
      { type: "category", text: "Category: Things that instantly ruin the mood in the bedroom. Go!" }
    ]
  },
  simonSays: {
    id: "simonSays",
    title: "Simon Says (Reflexes)",
    category: "Single Phone",
    description: "Quick-time screen taps. Last person to touch or follow instructions drinks.",
    prompts: [
      { type: "reflex", text: "Simon Says: Slap the screen! Last person drinks 2 sips." },
      { type: "reflex", text: "Touch your nose! (Simon didn't say. Whoever touched their nose drinks!)." },
      { type: "reflex", text: "Simon Says: Hold your breath for 10 seconds. Anyone who exhales early drinks." },
      { type: "reflex", text: "Simon Says: Touch the floor! Last person to touch the floor takes 2 sips." },
      { type: "reflex", text: "Stand up right now! (Simon didn't say. Anyone who stood up takes 3 sips)." },
      { type: "reflex", text: "Simon Says: Point at the most toxic person in the room. Last person to point drinks." },
      { type: "reflex", text: "Simon Says: Freeze completely! Anyone who moves, laughs, or blinks in the next 5 seconds drinks." },
      { type: "reflex", text: "Simon Says: Put your hands on your head. Last person to do it takes a shot." },
      { type: "reflex", text: "Simon Says: Tap the person to your left on the shoulder. Last one to tap drinks." },
      { type: "reflex", text: "Yell out your ex's name! (Simon didn't say. Anyone who yelled takes 3 sips)." },
      { type: "reflex", text: "Simon Says: Raise your glass to the ceiling! Last person takes 2 sips." },
      { type: "reflex", text: "Simon Says: Close your eyes and keep them closed. ... Open them! (Simon didn't say to open them. Anyone who opened their eyes drinks)." },
      { type: "reflex", text: "Simon Says: Touch the phone screen! Last person's finger to touch it drinks." }
    ]
  },
  doOrDrink: {
    id: "doOrDrink",
    title: "Do or Drink",
    category: "Single Phone",
    description: "Extreme challenges. If you refuse the challenge on screen, take the listed penalty.",
    prompts: [
      // --- ORIGINAL PROMPTS ---
      { type: "do-or-drink", text: "[Player A], let someone write a random word on your forehead with a pen, or take 3 sips." },
      { type: "do-or-drink", text: "[Player A], let the group blindfold you and feed you one random item from the fridge, or finish your drink." },
      { type: "do-or-drink", text: "[Player A], swap shirts with the person to your left, or take 4 sips." },
      { type: "do-or-drink", text: "[Player A], let the group read your last 3 text messages out loud, or take a shot." },
      { type: "do-or-drink", text: "[Player A], give a 30-second lap dance to the person across from you, or down your drink." },
      { type: "do-or-drink", text: "[Player A], call your ex right now and ask them how their day was, or take 5 sips." },
      { type: "do-or-drink", text: "[Player A], let the group post a random status on your WhatsApp, or finish your drink." },
      { type: "do-or-drink", text: "[Player A], let the person to your right sit on your lap for the next 2 rounds, or take 3 sips." },
      { type: "do-or-drink", text: "[Player A], show the group the most embarrassing photo in your camera roll, or take a shot." },

      // --- 25 BRAND NEW EXTREME CHALLENGES ---
      { type: "do-or-drink", text: "[Player A], let [Player B] whisper a dirty secret into your ear, then repeat it out loud to the room, or finish your drink." },
      { type: "do-or-drink", text: "[Player A], let the person on your right smell your armpit, or take 3 sips." },
      { type: "do-or-drink", text: "[Player A], do 20 fast push-ups right now while the room counts down, or take 4 sips." },
      { type: "do-or-drink", text: "[Player A], unlock your phone and hand it to [Player B] to look through your Instagram DMs for 30 seconds, or take a shot." },
      { type: "do-or-drink", text: "[Player A], let the person to your left give you a wet hickey on your neck or arm, or take 4 sips." },
      { type: "do-or-drink", text: "[Player A], send a random flirtatious emoji (😏 or 😈) to your boss or strict contact, or finish your drink." },
      { type: "do-or-drink", text: "[Player A], do a body shot off the person sitting across from you, or both of you take 3 sips." },
      { type: "do-or-drink", text: "[Player A], let the group pick one person to take a video of you doing a ridiculous dance and post it to your story for 1 hour, or take 5 sips." },
      { type: "do-or-drink", text: "[Player A], call a local fast food restaurant or taxi driver and dramatically confess your love to them, or take a shot." },
      { type: "do-or-drink", text: "[Player A], let [Player C] draw a mustache on your face with an eyeliner or pen, or take 3 sips." },
      { type: "do-or-drink", text: "[Player A], confess the dirtiest thought you've had about someone in this room tonight, or finish your drink." },
      { type: "do-or-drink", text: "[Player A], hold a ice cube in your mouth until it completely melts without spitting it out, or take 3 sips." },
      { type: "do-or-drink", text: "[Player A], let the person to your right go through your WhatsApp archived chats for 15 seconds, or take a shot." },
      { type: "do-or-drink", text: "[Player A], sit on the floor for the next 3 rounds and refer to everyone in the room as 'My Lord', or take 3 sips every time you forget." },
      { type: "do-or-drink", text: "[Player A], let someone slap your cheek as hard as they want (within reason), or down your drink." },
      { type: "do-or-drink", text: "[Player A], let [Player B] style your hair using whatever liquids/gels are on the table, or take 4 sips." },
      { type: "do-or-drink", text: "[Player A], bite gently on the lip or neck of the person to your left, or finish your drink." },
      { type: "do-or-drink", text: "[Player A], call your mom or dad and tell them you got a massive tattoo today, or take 5 sips." },
      { type: "do-or-drink", text: "[Player A], exchange pants/bottoms with [Player B] for the remainder of the game, or take a shot." },
      { type: "do-or-drink", text: "[Player A], perform your best seductive walk across the room and end with a pose, or take 3 sips." },
      { type: "do-or-drink", text: "[Player A], let [Player C] scroll through your TikTok watch history or search history out loud, or take 4 sips." },
      { type: "do-or-drink", text: "[Player A], let the room choose a song and you must sing the lyrics with full passion like you're at a concert, or take a shot." },
      { type: "do-or-drink", text: "[Player A], give a sincere 30-second speech on why the person to your right is sexy, or take 3 sips." },
      { type: "do-or-drink", text: "[Player A], take a shot of whatever mixture the group crafts for you in a cup, or forfeit and drink two full shots." },
      { type: "do-or-drink", text: "[Player A], let the person across from you look at your notes app, or finish your drink immediately." }
    ]
  },
  theRulebook: {
    id: "theRulebook",
    title: "The Rulebook",
    description: "Enforce hilarious physical laws. Break them and drink.",
    category: "Single Phone",
    prompts: [
      { type: "New Rule", text: "[Player A] must cross their legs until the game ends. If they uncross them, they drink 3 sips." },
      { type: "New Rule", text: "[Player B] must hold their drink with their non-dominant hand. If caught using the dominant hand, drink!" },
      { type: "New Rule", text: "[Player C] must speak with a fake accent for the next 3 rounds. Break character = drink." }
    ]
  },
  spinTheWheel: {
    id: "spinTheWheel",
    title: "Spin the Wheel",
    category: "Single Phone",
    description: "Digital roulette loaded with custom punishments, shots, or free passes.",
    prompts: [
      // --- ORIGINAL PROMPTS ---
      { type: "wheel", text: "Wheel Result: BODY SHOT! Take a shot off another player's body." },
      { type: "wheel", text: "Wheel Result: GIVE AWAY 3 SIPS. Pick anyone in the room to drink." },
      { type: "wheel", text: "Wheel Result: SHOTGUN! Down your drink immediately." },
      { type: "wheel", text: "Wheel Result: CLOTHING SWAP! Swap one item of clothing with the person to your right." },
      { type: "wheel", text: "Wheel Result: TRUTH SERUM! The group gets to ask you one completely unfiltered question. Answer or finish your drink." },
      { type: "wheel", text: "Wheel Result: FLOOR IS LAVA! Last person to lift their feet off the ground drinks." },
      { type: "wheel", text: "Wheel Result: IMMUNITY! You are safe from all dares and drinks for the next 2 rounds." },
      { type: "wheel", text: "Wheel Result: EVERYONE DRINKS! Cheers!" },

      // --- 35 NEW ABSURD, LEWD & CRAZY WHEEL OUTCOMES ---
      { type: "wheel", text: "Wheel Result: LAP DANCE SPECIAL! Give the person sitting across from you a 30-second lap dance to no music, or take 4 sips." },
      { type: "wheel", text: "Wheel Result: EX TOXICITY! Send a single '🙈' emoji to your ex on WhatsApp without any context. Refuse and down your drink." },
      { type: "wheel", text: "Wheel Result: HICKY ROULETTE! Let the person on your left give you a visible bite or mark on your neck, or take a shot." },
      { type: "wheel", text: "Wheel Result: THE FOOT FETISH! Let [Player B] place their foot in your lap for the next 2 rounds, or take 3 sips." },
      { type: "wheel", text: "Wheel Result: FREAKY CONFESSION! Describe your absolute most shameful bedroom fantasy in detail, or finish your cup." },
      { type: "wheel", text: "Wheel Result: SENSUAL FEEDING! Put on a blindfold while [Player C] feeds you a mystery drink or snack off a spoon." },
      { type: "wheel", text: "Wheel Result: DUMMY THICK! Twerk or whine your waist aggressively for 15 seconds while everyone claps, or take 3 sips." },
      { type: "wheel", text: "Wheel Result: PHONE INVASION! Hand your unlocked phone to [Player B] to scroll through your Instagram DMs for 30 seconds." },
      { type: "wheel", text: "Wheel Result: THE SLAP OF DESTINY! Let [Player C] gently slap your butt or cheeks, or down your drink." },
      { type: "wheel", text: "Wheel Result: MOAN MASTER! Make your loudest, most convincing sexual moan right now, or take a full shot." },
      { type: "wheel", text: "Wheel Result: DIRTY WHISPER! Whisper the filthiest sentence you can think of into the ear of the person to your right." },
      { type: "wheel", text: "Wheel Result: SECRET ATTRACTION! Point directly at the person in this room you'd most likely have a one-night stand with. They drink 2 sips." },
      { type: "wheel", text: "Wheel Result: STRIP POKER! Take off two items of clothing (shoes count) right now, or take 4 sips." },
      { type: "wheel", text: "Wheel Result: ICE CUBE MELT! Let an ice cube melt against your collarbone or stomach without using your hands, or take 3 sips." },
      { type: "wheel", text: "Wheel Result: LIP LOCK! Mime your best kissing technique on the back of your own hand for 10 seconds while everyone watches." },
      { type: "wheel", text: "Wheel Result: LIQUID COURAGE! Take a double shot mixed by the person sitting to your left." },
      { type: "wheel", text: "Wheel Result: THE INTERROGATION! Answer 3 rapid-fire questions about your body count and exes from the group, or finish your drink." },
      { type: "wheel", text: "Wheel Result: BOTTLE OF SIN! Spin an empty bottle on the table—whoever it points to must kiss your cheek or neck." },
      { type: "wheel", text: "Wheel Result: DEMON HOURS! Post 'Who's up? 😈' on your WhatsApp or Instagram story right now and keep it up for 30 minutes." },
      { type: "wheel", text: "Wheel Result: NECK TASTER! Lick the neck of the person sitting to your left, or finish your entire drink." },
      { type: "wheel", text: "Wheel Result: SIAMESE TWINS! You must sit attached at the hip/thigh with [Player B] for the next 3 rounds. Disconnect = 2 sips each." },
      { type: "wheel", text: "Wheel Result: SEARCH HISTORY REVEAL! Read the last 5 things in your private search browser out loud to the room." },
      { type: "wheel", text: "Wheel Result: SLOW MOTION SEDUCTION! Walk across the room in slow motion doing your absolute best runway model strut." },
      { type: "wheel", text: "Wheel Result: BELLY SHOT! Pour a splash of your drink on [Player B]'s stomach and take a sip off them." },
      { type: "wheel", text: "Wheel Result: HUMILIATING VOICE NOTE! Send a 10-second voice note singing horribly to your crush or recent match." },
      { type: "wheel", text: "Wheel Result: NO HANDS DRINKING! You can only drink for the next 3 rounds if someone else holds the cup to your lips." },
      { type: "wheel", text: "Wheel Result: BLINDFOLDED TOUCH! Put on a blindfold, feel someone's thigh or arm, and guess who it belongs to. Guess wrong = 3 sips." },
      { type: "wheel", text: "Wheel Result: BARK FOR IT! Bark like a hungry dog at the person across from you for 5 seconds, or take 3 sips." },
      { type: "wheel", text: "Wheel Result: RECENTLY DELETED! Open your 'Recently Deleted' photo album and display the first photo to the whole room." },
      { type: "wheel", text: "Wheel Result: BEDROOM POSITION DEMO! Use a couch pillow to demonstrate your absolute favorite bedroom position right now." },
      { type: "wheel", text: "Wheel Result: TOXIC EX RATING! Rate your last ex's bedroom performance out of 10 and explain why to the room." },
      { type: "wheel", text: "Wheel Result: MASSAGE THERAPY! Give the person to your left a firm shoulder/back massage until your next turn." },
      { type: "wheel", text: "Wheel Result: DRINK SWAP! Swap your current drink with whoever has the strongest mixture in the room." },
      { type: "wheel", text: "Wheel Result: THE COURT JESTER! Tell your dirtiest joke. If no one laughs, you take 3 sips. If anyone laughs, they drink!" },
      { type: "wheel", text: "Wheel Result: JACKPOT! Give away 5 sips total to any combination of players in the room!" }
    ]
  },
  charadesAdult: {
    id: "charadesAdult",
    title: "Charades (Adult Edition)",
    category: "Single Phone",
    description: "Hold the phone to your forehead; group acts out the funny/adult word on screen.",
    prompts: [
      // --- ORIGINAL EASY ACT-OUTS ---
      { type: "charades", text: "Walk of Shame" },
      { type: "charades", text: "Texting Your Ex" },
      { type: "charades", text: "Falling Asleep in the Club" },

      // --- EASY GENERAL KNOWLEDGE & POPULAR ADULT THEMES ---
      { type: "charades", text: "Sneaking Out at Night" },
      { type: "charades", text: "Getting Caught Naked" },
      { type: "charades", text: "Twerking at a Party" },
      { type: "charades", text: "Fake Moaning" },
      { type: "charades", text: "Giving a Lap Dance" },
      { type: "charades", text: "One-Night Stand" },
      { type: "charades", text: "Getting Hungover" },
      { type: "charades", text: "Buying Condoms at a Pharmacy" },
      { type: "charades", text: "Getting Thrown Out by a Bouncer" },
      { type: "charades", text: "Flirting with a Bartender" },
      { type: "charades", text: "Taking a Body Shot" },
      { type: "charades", text: "Stalking Your Crush on Instagram" },
      { type: "charades", text: "Sending a Risky DM" },
      { type: "charades", text: "Drunk Tweeting" },
      { type: "charades", text: "Faking an Orgasm" },
      { type: "charades", text: "Strip Poker" },
      { type: "charades", text: "Taking a Mirror Selfie" },
      { type: "charades", text: "Getting a Hickey" },
      { type: "charades", text: "Speed Dating" },
      { type: "charades", text: "Drinking Straight from the Bottle" },
      { type: "charades", text: "Ghosting Someone" },
      { type: "charades", text: "Getting Drunk off Tequila" },
      { type: "charades", text: "Dancing on a Bar Counter" },
      { type: "charades", text: "Unzipping Someone's Pants" },
      { type: "charades", text: "Throwing Up in a Party Toilet" },
      { type: "charades", text: "Losing Your Clothes" },
      { type: "charades", text: "Making Out in an Uber" },
      { type: "charades", text: "Swiping Right on Tinder" },
      { type: "charades", text: "Whispering Something Dirty" }
    ]
  },
  blinkOrDrink: {
    id: "blinkOrDrink",
    title: "Blink or Drink (Staredown)",
    category: "Single Phone",
    description: "Two players face off. First to break eye contact or laugh drinks.",
    prompts: [
      { type: "staredown", text: "[Player A] vs [Player B]: Lock eyes. First one to blink, look away, or laugh takes 3 sips." },
      { type: "staredown", text: "[Player A] vs [Player C]: Staredown battle. No smiling allowed." }
    ]
  },
  kingsCup: {
    id: "kingsCup",
    title: "King's Cup (Ring of Fire)",
    category: "Single Phone",
    description: "Virtual deck of cards around a digital cup. Drawing cards triggers classic ring rules.",
    prompts: [
      { type: "king-card", text: "Ace: WATERFALL! Everyone drinks and cannot stop until the person to your left stops." },
      { type: "king-card", text: "King: THE CUP! Pour some of your drink into the central cup. Whoever draws the 4th King downs the cup." },
      { type: "king-card", text: "Queen: QUESTION MASTER! If anyone answers your questions, they drink." },
      { type: "king-card", text: "Jack: THUMB MASTER! Place your thumb on the table. Last to do so drinks." }
    ]
  },
  metronome: {
    id: "metronome",
    title: "The Metronome / Beat Keep",
    category: "Single Phone",
    description: "Keep the rhythm. Go around the circle saying a word that fits the category on the beat.",
    prompts: [
      // --- ORIGINAL PROMPTS ---
      { type: "beat", text: "Category: Car Brands. Keep the beat going around the room! Hesitate = 2 sips." },
      { type: "beat", text: "Category: Curses or Swear Words. Go on the beat!" },

      // --- 15 NEW FAST-PACED CATEGORIES ---
      { type: "beat", text: "Category: Popular Cocktails or Alcoholic Drinks. Stay on beat!" },
      { type: "beat", text: "Category: Excuses to break up with someone. Keep the rhythm!" },
      { type: "beat", text: "Category: Body parts you can touch in public. Snap on beat!" },
      { type: "beat", text: "Category: Afrobeats & Street-Pop Artists. Don't lose the rhythm!" },
      { type: "beat", text: "Category: Things you find in a club VIP section. Go on beat!" },
      { type: "beat", text: "Category: Red flags on a dating profile. Keep the pace!" },
      { type: "beat", text: "Category: High-end Fashion Brands. Snap along to the beat!" },
      { type: "beat", text: "Category: Words used to describe someone sexy. Keep moving!" },
      { type: "beat", text: "Category: Things you do right before going to bed. On the beat!" },
      { type: "beat", text: "Category: Types of fast food or late-night party snacks. Keep it going!" },
      { type: "beat", text: "Category: Words that rhyme with 'Spicy'. Don't hesitate!" },
      { type: "beat", text: "Category: Things you find inside a bathroom nightstand. Stay on rhythm!" },
      { type: "beat", text: "Category: Emojis used when flirting. Keep the beat!" },
      { type: "beat", text: "Category: Reasons to call out sick from work. On beat!" },
      { type: "beat", text: "Category: Names of popular dating or social media apps. Keep the rhythm!" }
    ]
  },
  higherOrLower: {
    id: "higherOrLower",
    title: "Higher or Lower",
    category: "Single Phone",
    description: "Guess if the next card drawn is higher or lower than the current one.",
    prompts: [
      { type: "card-guess", text: "Current Card is 7. Will the next card be HIGHER or LOWER? Guess wrong = drink 2 sips." }
    ]
  },
  reverseCharades: {
    id: "reverseCharades",
    title: "Reverse Charades",
    category: "Single Phone",
    description: "The whole group acts out the prompt while one person holds the phone and guesses.",
    prompts: [
      // --- ORIGINAL PROMPT ---
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Trying to sneak into your house at 4 AM without waking parents.'" },

      // --- 15 NEW GROUP ACT-OUT PROMPTS ---
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Getting caught red-handed cheating on an exam.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'A wild bouncer throwing a drunk person out of the club.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Pretending to be rich in a VIP section with zero money.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'An overly aggressive street vendor trying to sell tomatoes.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Trying to hold in extreme diarrhea on a first date.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'A dramatic Nollywood crying scene at a funeral.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Getting stuck in a Danfo bus during heavy Lagos traffic.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'An awkward group lap dance performance.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Stalking an ex's new partner on Instagram and accidentally liking a photo.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Trying to order food at a loud club using hand gestures.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'A slow-motion walk of shame the morning after a party.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: ' Getting pulled over by police while carrying something illegal.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'A frantic wedding fight over who gets the last plate of party rice.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Pretending your phone battery died to escape a terrible date.'" },
      { type: "rev-charades", text: "[Player A] holds the phone. Everyone else acts out: 'Twerking aggressively at an Afrobeats concert.'" }
    ]
  },
  wouldYouRatherBrutal: {
    id: "wouldYouRatherBrutal",
    title: "Would You Rather (Brutal Edition)",
    category: "Single Phone",
    description: "Two terrible scenarios. If the group unanimously disagrees with your logic, you drink.",
    prompts: [
      // --- ORIGINAL PROMPTS ---
      { type: "wyr", text: "Would you rather have your search history made public, or your camera roll sent to your parents?" },
      { type: "wyr", text: "Would you rather accidentally sleep with your cousin, or your best friend's parents?" },
      { type: "wyr", text: "Would you rather walk in on your parents doing it, or have them walk in on you doing it?" },
      { type: "wyr", text: "Would you rather give up oral sex for life, or give up your favorite food for life?" },
      { type: "wyr", text: "Would you rather have a partner who is terrible in bed but incredibly rich, or a billionaire who is awful in bed?" },
      { type: "wyr", text: "Would you rather have to broadcast your sex life on Instagram live, or never have sex again?" },
      { type: "wyr", text: "Would you rather find true love today, or find 100 million Naira in your bank account tomorrow?" },

      // --- 15 NEW BRUTAL PROMPTS ---
      { type: "wyr", text: "Would you rather accidentally text 'I love you' to your strict boss, or text a explicit nude to your family group chat?" },
      { type: "wyr", text: "Would you rather be caught lying about your body count by 50, or have your ex write an honest review of you on Twitter?" },
      { type: "wyr", text: "Would you rather have your partner be best friends with their toxic ex, or have them secretly stay in touch with all their former hookups?" },
      { type: "wyr", text: "Would you rather perform a terrible 5-minute lap dance in front of your entire family, or have your parents watch your last bedroom video?" },
      { type: "wyr", text: "Would you rather lose all your money on a crypto meme coin scam, or get caught fake-flexing a VIP table at the club you couldn't afford?" },
      { type: "wyr", text: "Would you rather have a partner who moans their own name during sex, or a partner who insists on keeping full eye contact without blinking?" },
      { type: "wyr", text: "Would you rather have loud explosive diarrhea on a first date at your crush's house, or get thrown out of a club by bouncers in front of everyone?" },
      { type: "wyr", text: "Would you rather be cheated on once with a complete stranger, or have your partner emotionally fall in love with your best friend without touching them?" },
      { type: "wyr", text: "Would you rather permanently smell like stale club alcohol and suya, or have every text message you send read out loud by a robotic voice?" },
      { type: "wyr", text: "Would you rather accidentally call your current partner by your ex's name during intimacy, or have them call you by their ex's name?" },
      { type: "wyr", text: "Would you rather have a 10/10 partner who is completely dry and boring in conversation, or a 4/10 who has top-tier humor and incredible bedroom skills?" },
      { type: "wyr", text: "Would you rather be forced to post your entire hidden/archived photo folder on your main Instagram feed, or let [Player B] send one DM from your account?" },
      { type: "wyr", text: "Would you rather walk in on your boss in a steamy hookup, or have your boss walk in on you giving a lap dance in the office?" },
      { type: "wyr", text: "Would you rather spend 24 hours locked in a room with your worst toxic ex, or spend 24 hours in a room with your partner's strict parents?" },
      { type: "wyr", text: "Would you rather give up alcohol forever, or give up listening to Afrobeats and Amapiano for the rest of your life?" }
    ]
  },
  tongueTwister: {
    id: "tongueTwister",
    title: "Tongue Twister",
    category: "Single Phone",
    description: "5-second timer to read a complex phrase out loud flawlessly. Stumble and drink.",
    prompts: [
      // --- ORIGINAL PROMPT ---
      { type: "twister", text: "Say 3 times fast: 'Pad-locked black back-packs packed with packed black packs.'" },
      { type: "twister", text: "Say 3 times fast: 'The sun shall soon shine.'" },


      // --- 10 NEW HARDCORE TWISTERS ---
      { type: "twister", text: "Say 3 times fast: 'She sells sea shells by the sea shore, but the sea shells she sells are sea shells no more.'" },
      { type: "twister", text: "Say 3 times fast: 'Peter Piper picked a peck of pickled peppers before drinking three drinks.'" },
      { type: "twister", text: "Say 3 times fast: 'Unique New York, unique New York, you know you need unique New York.'" },
      { type: "twister", text: "Say 3 times fast: 'Red leather, yellow leather, red leather, yellow leather.'" },
      { type: "twister", text: "Say 3 times fast: 'Six sick hicks nick six slick bricks with picks and sticks.'" },
      { type: "twister", text: "Say 3 times fast: 'I scream, you scream, we all scream for ice cold sweet peach cream.'" },
      { type: "twister", text: "Say 3 times fast: 'Brisk brave brigadiers brandished broad bright blades baked in butter.'" },
      { type: "twister", text: "Say 3 times fast: 'Fuzzy Wuzzy was a bear, Fuzzy Wuzzy had no hair, Fuzzy Wuzzy wasn't very fuzzy, was he?'" },
      { type: "twister", text: "Say 3 times fast: 'Which witch wished which wicked wish while watching white watches?'" },
      { type: "twister", text: "Say 3 times fast: 'Selfish shellfish, selfish shellfish, selfish shellfish.'" }
    ]
  },
  fingersGame: {
    id: "fingersGame",
    title: "Fingers (Digital Cup)",
    category: "Single Phone",
    description: "Everyone places one finger on the screen. The app counts down and eliminates fingers.",
    prompts: [
      { type: "fingers", text: "Place all fingers on the screen! The last finger standing takes a shot." }
    ]
  },
  russianRoulette: {
    id: "russianRoulette",
    title: "Russian Roulette (Minesweeper)",
    category: "Single Phone",
    description: "A grid of squares appears. Take turns tapping. One is the hidden bomb.",
    prompts: [
      { type: "roulette", text: "Pass the phone around. Each player taps a square. Find the bomb, take the penalty!" }
    ]
  },
  storyMode: {
    id: "storyMode",
    title: "Story Mode (One Word at a Time)",
    category: "Single Phone",
    description: "Pass phone around; each person adds exactly one word to continue the wild story.",
    prompts: [
      { type: "story", text: "Opening Line: 'The spaceship landed right on top of [Player A]'s expensive car, revealing...'" }
    ]
  },
  brainFreeze: {
    id: "brainFreeze",
    title: "Brain Freeze",
    category: "Single Phone",
    description: "Rapid-fire math puzzles or logic riddles with a tight 3-second timer.",
    prompts: [
      // --- ORIGINAL PROMPT ---
      { type: "puzzle", text: "Quick Math: What is 17 × 3 minus 11? Answer before the buzzer or drink!" },

      // --- 15 NEW BRAIN-MELTING PUZZLES ---
      { type: "puzzle", text: "Quick Logic: If a electric train is traveling south at 100mph and the wind is blowing north at 50mph, which way is the smoke blowing? Answer in 3 seconds or drink!" },
      { type: "puzzle", text: "Quick Math: What is 45 divided by 5 plus 12? Speak before the timer runs out or drink!" },
      { type: "puzzle", text: "Spelling Challenge: Spell the word 'RECEIVE' backwards instantly. Fail or hesitate and take 2 sips!" },
      { type: "puzzle", text: "Quick Math: What is 12 × 12 minus 44? Answer immediately!" },
      { type: "puzzle", text: "Riddle: What has to be broken before you can use it? Name it in 3 seconds or drink!" },
      { type: "puzzle", text: "Quick Math: What is 99 minus 37 plus 14? Speak up now!" },
      { type: "puzzle", text: "Spelling Challenge: Spell the word 'NECESSARY' out loud instantly without stuttering!" },
      { type: "puzzle", text: "Riddle: I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?" },
      { type: "puzzle", text: "Quick Math: What is 85 divided by 5? Answer before the room counts to three!" },
      { type: "puzzle", text: "Quick Logic: A cowboy rides into town on Friday, stays for three days, then leaves on Friday. How did he do it? Answer or drink!" },
      { type: "puzzle", text: "Quick Math: What is 16 × 4 minus 19? Solve it instantly!" },
      { type: "puzzle", text: "Spelling Challenge: Spell the word 'ACCOMMODATION' out loud on the spot. Hesitate and drink!" },
      { type: "puzzle", text: "Riddle: What goes up but never comes down? Name it in 3 seconds!" },
      { type: "puzzle", text: "Quick Math: What is 7 times 8 plus 44? Answer before the timer hits zero!" },
      { type: "puzzle", text: "Quick Logic: You're running a race and you pass the person in second place. What place are you in now? Answer instantly!" }
    ]
  },
  paranoia: {
    id: "paranoia",
    title: "Paranoia",
    category: "Single Phone",
    description: "Whisper a private question to your neighbor. A coin flip decides if it's revealed to the room.",
    prompts: [
      // --- ORIGINAL PROMPT ---
      { type: "paranoia", text: "[Player A], whisper into [Player B]'s ear: 'Who in this room do you think is the worst liar?'" },

      // --- 20 NEW SUSPICIOUS & TOXIC WHISPERS ---
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think secretly texts their ex every night?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think has the fakest personality?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room would you least trust with a secret?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think is the worst at kissing?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think has the most embarrassing search history?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Whose outfit tonight do you secretly think looks ridiculous?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think is the most toxic dater?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here would you be least surprised to see get arrested?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think has the biggest crush on someone else here?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think is terrible at holding their alcohol?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think gives the worst relationship advice?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think secretly googles themselves?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think is the most dramatic during arguments?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think spends way too much money on fake designer items?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think would survive the shortest time in a horror movie?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think is the biggest flirt when they are drunk?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think has the weirdest hidden talent?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think is most likely to ghost a close friend over nothing?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who in this room do you think is the most selfish when ordering food?'" },
      { type: "paranoia", text: "[Player A], whisper to [Player B]: 'Who here do you think secretly wants to swap lives with someone else in this room?'" }
    ]
  },
  diceOfDoom: {
    id: "diceOfDoom",
    title: "Dice of Doom",
    category: "Single Phone",
    description: "Every player takes a turn rolling the virtual dice. The lowest roll of the round takes the doom punishment!",
    prompts: [
      // --- UPDATED MECHANIC & ORIGINAL PROMPTS ---
      { type: "dice", text: "Round Roll! Lowest roller takes 4 sips while standing on one foot." },
      { type: "dice", text: "Round Roll! Lowest roller lets the group write a word on their forehead with a marker." },
      { type: "dice", text: "Round Roll! Lowest roller down their entire drink immediately." },
      { type: "dice", text: "Round Roll! Lowest roller sends a voice note singing to their last text message thread." },
      { type: "dice", text: "Round Roll! Lowest roller must sit on the floor for the next 3 rounds." },
      { type: "dice", text: "Round Roll! Lowest roller lets [Player B] post an emoji-only status on their WhatsApp." },
      { type: "dice", text: "Round Roll! Lowest roller takes a shot of whatever mixture the table creates." },
      { type: "dice", text: "Round Roll! Lowest roller gives a 30-second dramatic apology to an inanimate object." },
      { type: "dice", text: "Round Roll! Lowest roller hands over their phone for a 15-second gallery review." },
      { type: "dice", text: "Round Roll! Lowest roller does 15 push-ups while the group counts down out loud." },
      { type: "dice", text: "Round Roll! Lowest roller wears a blindfold until it's their turn to roll again." }
    ]
  },
  impressionist: {
    id: "impressionist",
    title: "Impressionist",
    category: "Single Phone",
    description: "Perform a weird scenario or celebrity impression for 10 seconds.",
    prompts: [
      // --- ORIGINAL PROMPT ---
      { type: "impression", text: "Perform your best impression of a robot trying to flirt at a bar for 10 seconds." },

      // --- 10 NEW IMPRESSIONS ---
      { type: "impression", text: "Perform your best impression of a strict African mom waking up her kids for church at 6 AM." },
      { type: "impression", text: "Perform your best impression of an overly dramatic Nollywood villain dying from poison." },
      { type: "impression", text: "Perform your best impression of a drunk person trying to convince a bouncer they are VIP." },
      { type: "impression", text: "Perform your best impression of a top Afrobeats artist losing their mic feedback mid-concert." },
      { type: "impression", text: "Perform your best impression of a baby trying to explain why they threw food on the floor." },
      { type: "impression", text: "Perform your best impression of an excited car salesman trying to sell a completely broken vehicle." },
      { type: "impression", text: "Perform your best impression of a person who just stepped on a Lego brick in total darkness." },
      { type: "impression", text: "Perform your best impression of a ghost trying to act scary but failing miserably." },
      { type: "impression", text: "Perform your best impression of an influencer filming an unboxing video for a very cheap item." },
      { type: "impression", text: "Perform your best impression of a cat trying to wake its owner up at 4 AM for food." }
    ]
  },
  theBouncer: {
    id: "theBouncer",
    title: "The Bouncer",
    category: "Single Phone",
    description: "Set a secret physical password or gesture. Anyone touching their drink without it gets penalized.",
    prompts: [
      // --- ORIGINAL PROMPT ---
      { type: "bouncer", text: "The Bouncer Rule: No one can touch their drink without tapping their nose first for the next 5 rounds." },

      // --- 10 NEW BOUNCER RULES ---
      { type: "bouncer", text: "The Bouncer Rule: Before taking a sip, you must salute the person to your left. Fail = 2 sips!" },
      { type: "bouncer", text: "The Bouncer Rule: You must speak in a whisper whenever it's your turn for the next 3 rounds. Normal voice = drink!" },
      { type: "bouncer", text: "The Bouncer Rule: No one is allowed to say the words 'Yes' or 'No' for the next 4 rounds. Caught saying them = 3 sips!" },
      { type: "bouncer", text: "The Bouncer Rule: Whenever someone drinks, everyone else must raise their hand like they're in a classroom. Last one raises hand drinks!" },
      { type: "bouncer", text: "The Bouncer Rule: You must touch your left ear every single time before picking up your cup. Miss it = 2 sips!" },
      { type: "bouncer", text: "The Bouncer Rule: Nobody can point with their index finger for the rest of the game. Use your chin instead!" },
      { type: "bouncer", text: "The Bouncer Rule: Every sentence spoken for the next 3 rounds must end with the word 'Bro'." },
      { type: "bouncer", text: "The Bouncer Rule: You must place your cup on your head for 3 seconds before taking any drink." },
      { type: "bouncer", text: "The Bouncer Rule: Whenever someone laughs at a joke, they must bark once like a dog or take a penalty sip." },
      { type: "bouncer", text: "The Bouncer Rule: You are not allowed to cross your arms or legs while sitting down. Caught doing it = 2 sips!" }
    ]
  }
};
