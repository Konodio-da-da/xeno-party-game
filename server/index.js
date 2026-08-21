// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Allow Express to parse JSON bodies

const server = http.createServer(app);

// Update CORS to allow your frontend URL
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://your-xeno-app.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// Store active game rooms in memory
const rooms = {};

// --- REST API ROUTES ---

// Health Check Route for Production (Render, Heroku, etc.)
app.get('/', (req, res) => {
  res.send('XENO Server is running!');
});

// --- PAYSTACK CHECKOUT ENDPOINT ---
app.post('/api/create-checkout-session', async (req, res) => {
  const { packId, packTitle, packPriceInKobo, email } = req.body;

  try {
    // Call Paystack API to initialize the transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        amount: packPriceInKobo, // Paystack requires the amount in Kobo
        callback_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/success?packId=${packId}`,
        metadata: {
          packId,
          packTitle
        }
      })
    });

    const data = await response.json();

    if (data.status) {
      // Send the Paystack authorization URL to the frontend
      res.json({ url: data.data.authorization_url });
    } else {
      res.status(400).json({ error: data.message });
    }
  } catch (error) {
    console.error("Paystack Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mock database query for testing (Replace with Firestore/MongoDB in production)
app.post('/api/restore-purchases', async (req, res) => {
  const { email } = req.body;

  try {
    // In production, you query your database for Paystack webhooks tied to this email.
    // For now, let's mock a successful restore if the email is "test@xeno.com"
    if (email === 'test@xeno.com') {
      res.json({ unlockedPacks: ['spicyLagos', 'brutalTruths'] });
    } else {
      res.json({ unlockedPacks: [] });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore purchases' });
  }
});


// --- SOCKET.IO GAME ENGINE ---

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Event: Host creates a new room
  socket.on('create-room', ({ playerName, gameType }) => {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    rooms[roomCode] = {
      host: socket.id,
      gameType: gameType,
      players: [{ id: socket.id, name: playerName, isHost: true }],
      gameState: { status: 'waiting' }
    };

    socket.join(roomCode);
    socket.emit('room-created', { roomCode, players: rooms[roomCode].players, gameType });
    console.log(`Room created: ${roomCode} by ${playerName}`);
  });

  // Event: Player joins an existing room
  socket.on('join-room', ({ roomCode, playerName }) => {
    if (!rooms[roomCode]) {
      socket.emit('error-message', 'Room does not exist!');
      return;
    }

    rooms[roomCode].players.push({ id: socket.id, name: playerName, isHost: false });
    socket.join(roomCode);

    io.to(roomCode).emit('update-players', rooms[roomCode].players);
    socket.emit('joined-success', { roomCode, players: rooms[roomCode].players, gameType: rooms[roomCode].gameType });
    console.log(`${playerName} joined room: ${roomCode}`);
  });

  // Event: Host changes the game type from the dropdown
  socket.on('update-game-type', ({ roomCode, gameType }) => {
    const room = rooms[roomCode];
    if (room) {
      room.gameType = gameType;
      io.to(roomCode).emit('game-type-changed', gameType);
    }
  });  

  // Event: Host starts the game and forces everyone into the correct game type
  socket.on('start-game', ({ roomCode, gameType }) => {
    if (rooms[roomCode]) {
      rooms[roomCode].gameType = gameType;
    }
    io.to(roomCode).emit('game-started', gameType); 
  });

  // Event: Host triggers return to lobby for everyone
  socket.on('return-to-lobby', ({ roomCode }) => {
    console.log(`Room ${roomCode} is returning to the lobby`);
    io.to(roomCode).emit('force-back-to-lobby');
  });

  // Event: Player triggers vote (Most Likely To)
  socket.on('submit-vote', ({ roomCode, targetName }) => {
    const room = rooms[roomCode];
    if (!room) return;

    if (!room.votes) room.votes = {};
    room.votes[socket.id] = targetName;

    if (Object.keys(room.votes).length === room.players.length) {
      const tally = {};
      Object.values(room.votes).forEach((name) => {
        tally[name] = (tally[name] || 0) + 1;
      });

      io.to(roomCode).emit('show-results', tally);
      room.votes = {};
    }
  });

  // Event: Host triggers next prompt
  socket.on('next-prompt', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room && room.host === socket.id) {
      io.to(roomCode).emit('advance-prompt');
    }
  });
  
  // --- UNIVERSAL ENGINE HANDLERS ---
  
  // Event: Player submits custom text answers
  socket.on('submit-text-answer', ({ roomCode, text }) => {
    const room = rooms[roomCode];
    if (!room) return;

    if (!room.textAnswers) room.textAnswers = {};
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      room.textAnswers[player.name] = text;
    }

    if (Object.keys(room.textAnswers).length === room.players.length) {
      const anonymousAnswers = Object.entries(room.textAnswers).map(([author, answer]) => ({
        id: Math.random().toString(36).substring(7),
        text: answer,
        author: author
      }));
      
      room.currentVotingPool = anonymousAnswers;
      io.to(roomCode).emit('start-voting-phase', anonymousAnswers);
    }
  });

  // Event: Player submits a canvas drawing
  socket.on('submit-drawing', ({ roomCode, drawingData }) => {
    const room = rooms[roomCode];
    if (!room) return;

    if (!room.drawings) room.drawings = {};
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      room.drawings[player.name] = drawingData; 
    }

    if (Object.keys(room.drawings).length === room.players.length) {
      const anonymousDrawings = Object.entries(room.drawings).map(([author, imageStr]) => ({
        id: Math.random().toString(36).substring(7),
        image: imageStr,
        author: author
      }));
      
      room.currentVotingPool = anonymousDrawings;
      io.to(roomCode).emit('start-drawing-voting', anonymousDrawings);
    }
  });

  // Event: Player votes on a custom text answer or drawing
  socket.on('submit-answer-vote', ({ roomCode, answerId }) => {
    const room = rooms[roomCode];
    if (!room) return;

    if (!room.answerVotes) room.answerVotes = {};
    room.answerVotes[socket.id] = answerId;

    if (Object.keys(room.answerVotes).length === room.players.length) {
      const tally = {};
      
      Object.values(room.answerVotes).forEach((id) => {
        tally[id] = (tally[id] || 0) + 1;
      });

      const results = (room.currentVotingPool || []).map(ans => ({
        id: ans.id,
        text: ans.text,
        image: ans.image,
        author: ans.author,
        votes: tally[ans.id] || 0
      })).sort((a, b) => b.votes - a.votes);

      io.to(roomCode).emit('show-universal-results', results);
      
      room.textAnswers = {};
      room.drawings = {};
      room.answerVotes = {};
    }
  });

  // --- TWO TRUTHS ONE LIE HANDLERS ---
  socket.on('submit-ttol', ({ roomCode, statements, lieId }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.ttolSubmissions) room.ttolSubmissions = [];

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      room.ttolSubmissions.push({ author: player.name, statements, lieId });
    }

    if (room.ttolSubmissions.length === room.players.length) {
      room.ttolCurrentIndex = 0;
      room.ttolVotes = {};
      io.to(roomCode).emit('start-ttol-voting', room.ttolSubmissions[0]);
    }
  });

  socket.on('submit-ttol-vote', ({ roomCode, voteId }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.ttolVotes) room.ttolVotes = {};
    
    room.ttolVotes[socket.id] = voteId;
    const expectedVotes = room.players.length - 1;

    if (Object.keys(room.ttolVotes).length >= expectedVotes) {
      const tally = {};
      Object.values(room.ttolVotes).forEach(v => { tally[v] = (tally[v] || 0) + 1; });
      
      const currentSubmission = room.ttolSubmissions[room.ttolCurrentIndex];
      io.to(roomCode).emit('ttol-results', { 
        author: currentSubmission.author,
        lieId: currentSubmission.lieId,
        statements: currentSubmission.statements,
        tally
      });
      room.ttolVotes = {};
    }
  });

  socket.on('next-ttol-round', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.ttolCurrentIndex++;
    if (room.ttolCurrentIndex < room.ttolSubmissions.length) {
      io.to(roomCode).emit('start-ttol-voting', room.ttolSubmissions[room.ttolCurrentIndex]);
    } else {
      room.ttolSubmissions = [];
      io.to(roomCode).emit('advance-prompt'); 
    }
  });

  // --- TRIVIA HANDLERS ---
  socket.on('submit-trivia', ({ roomCode, answer }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.triviaAnswers) room.triviaAnswers = {};

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      room.triviaAnswers[player.name] = answer;
    }

    if (Object.keys(room.triviaAnswers).length === room.players.length) {
      io.to(roomCode).emit('trivia-results', room.triviaAnswers);
      room.triviaAnswers = {};
    }
  });
    
  // --- RANK 'EM TRUE SORTING HANDLERS ---
  socket.on('submit-rank-item', ({ roomCode, itemText }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.rankSubmissions) room.rankSubmissions = {};

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      room.rankSubmissions[player.name] = itemText;
    }

    if (Object.keys(room.rankSubmissions).length === room.players.length) {
      const masterPool = Object.entries(room.rankSubmissions).map(([author, text]) => ({
        id: Math.random().toString(36).substring(7),
        text,
        author
      }));

      room.masterRankPool = masterPool;
      io.to(roomCode).emit('start-rank-sorting', masterPool);
      room.rankSubmissions = {};
    }
  });

  socket.on('submit-final-ranking', ({ roomCode, rankedIds }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.finalRankings) room.finalRankings = {};

    room.finalRankings[socket.id] = rankedIds;

    if (Object.keys(room.finalRankings).length === room.players.length) {
      const scores = {};
      room.masterRankPool.forEach(item => { scores[item.id] = 0; });

      const totalPlayers = room.players.length;
      Object.values(room.finalRankings).forEach(list => {
        list.forEach((id, index) => {
          if (scores[id] !== undefined) {
            scores[id] += index;
          }
        });
      });

      const results = room.masterRankPool.map(item => ({
        ...item,
        avgScore: scores[item.id] / totalPlayers
      })).sort((a, b) => a.avgScore - b.avgScore);

      io.to(roomCode).emit('show-ranking-leaderboard', results);
      room.finalRankings = {};
    }
  });

  // --- UPVOTE / DOWNVOTE HANDLERS ---
  socket.on('submit-opinion', ({ roomCode, text }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.opinions) room.opinions = {};

    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      room.opinions[player.name] = text;
    }

    if (Object.keys(room.opinions).length === room.players.length) {
      const opinionPool = Object.entries(room.opinions).map(([author, opinionText]) => ({
        id: Math.random().toString(36).substring(7),
        text: opinionText,
        author: author,
        score: 0
      }));
      room.opinionPool = opinionPool;
      room.opinionIndex = 0;
      io.to(roomCode).emit('start-opinion-voting', opinionPool[0]);
    }
  });

  socket.on('vote-opinion', ({ roomCode, opinionId, direction }) => {
    const room = rooms[roomCode];
    if (!room || !room.opinionPool) return;

    const currentOp = room.opinionPool[room.opinionIndex];
    if (!room.opinionVotes) room.opinionVotes = {};
    room.opinionVotes[socket.id] = direction;

    const expectedVotes = room.players.length - 1;
    if (Object.keys(room.opinionVotes).length >= expectedVotes) {
      let netScore = 0;
      Object.values(room.opinionVotes).forEach(dir => {
        netScore += (dir === 'up' ? 1 : -1);
      });

      io.to(roomCode).emit('opinion-score-reveal', {
        author: currentOp.author,
        text: currentOp.text,
        score: netScore
      });
      room.opinionVotes = {};
    }
  });

  socket.on('next-opinion', ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room || !room.opinionPool) return;

    room.opinionIndex++;
    if (room.opinionIndex < room.opinionPool.length) {
      io.to(roomCode).emit('start-opinion-voting', room.opinionPool[room.opinionIndex]);
    } else {
      room.opinionPool = null;
      io.to(roomCode).emit('advance-prompt');
    }
  });

   // --- IMPOSTER / SPYFALL HANDLERS ---
  socket.on('start-imposter-game', ({ roomCode, locationsCatalog }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const randomLoc = locationsCatalog[Math.floor(Math.random() * locationsCatalog.length)];
    const players = room.players;
    const imposterIndex = Math.floor(Math.random() * players.length);
    
    // Store the actual imposter name in room state to verify later
    room.secretImposterName = players[imposterIndex].name;

    players.forEach((p, idx) => {
      const isImposter = idx === imposterIndex;
      io.to(p.id).emit('imposter-role-assigned', {
        isImposter,
        secretLocation: isImposter ? null : randomLoc
      });
    });
  });

  socket.on('trigger-imposter-vote-phase', ({ roomCode }) => {
    io.to(roomCode).emit('force-imposter-voting');
  });

  socket.on('submit-imposter-vote', ({ roomCode, suspectName }) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (!room.imposterVotes) room.imposterVotes = {};

    room.imposterVotes[socket.id] = suspectName;

    if (Object.keys(room.imposterVotes).length === room.players.length) {
      const tally = {};
      Object.values(room.imposterVotes).forEach(name => {
        tally[name] = (tally[name] || 0) + 1;
      });

      // Find who got the MOST votes
      let mostVotedName = null;
      let maxVotes = -1;
      let isTie = false;

      Object.entries(tally).forEach(([name, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          mostVotedName = name;
          isTie = false;
        } else if (count === maxVotes) {
          isTie = true;
        }
      });

      // Check if the most voted person is actually the imposter and won majority
      const caughtImposter = !isTie && mostVotedName === room.secretImposterName;

      io.to(roomCode).emit('imposter-results', {
        tally,
        mostVotedName,
        caughtImposter,
        secretImposterName: room.secretImposterName
      });
      
      room.imposterVotes = {};
    }
  });


  // Event: Player triggers a soundboard effect
  socket.on('trigger-sound', ({ roomCode, soundName }) => {
    if (roomCode) {
      io.to(roomCode).emit('play-sound-effect', soundName);
    }
  });

  // Event: Handle disconnections and cleanup empty rooms
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // Search through active rooms to find where the disconnected user was
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);

      if (playerIndex !== -1) {
        const disconnectedPlayer = room.players[playerIndex];
        room.players.splice(playerIndex, 1);

        console.log(`${disconnectedPlayer.name} left room ${roomCode}`);

        // If the room is now empty, delete it from memory
        if (room.players.length === 0) {
          delete rooms[roomCode];
          console.log(`Room ${roomCode} deleted (empty).`);
        } else {
          // If the host left, assign a new host to the first remaining player
          if (room.host === socket.id) {
            room.host = room.players[0].id;
            room.players[0].isHost = true;
            console.log(`New host for room ${roomCode} is ${room.players[0].name}`);
          }

          // Broadcast updated player list to everyone else in the room
          io.to(roomCode).emit('update-players', room.players);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`XENO Server running on port ${PORT}`);
});
