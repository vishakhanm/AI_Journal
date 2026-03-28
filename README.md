# AI Journal – Emotion-Aware Reflective Journaling

AI Journal is a reflective journaling application that helps users better understand their emotions over time.  
It combines **LLM-powered emotional analysis**, **vector similarity search**, and **long-term trend analysis** to create a more thoughtful journaling experience.

The system analyzes journal entries, generates reflections, stores conversations, and builds an emotional memory that allows the AI to recognize patterns across time.

---

## Features

### Reflective Journaling
- Write daily journal entries
- AI analyzes emotional tone and intensity
- Generates a calm reflective summary of the entry
- Creates a visual representation of emotional state

### Emotion Analysis
Each entry is processed to extract:
- Primary emotion
- Secondary emotions
- Emotional intensity
- Sentiment tone
- Emotion keywords

---

### AI Reflection
The AI generates a reflective interpretation of the user's entry.

Design principles:
- No advice
- No diagnosis
- No instructions
- Calm reflective tone
- Emotion awareness

The goal is to help users **better understand what they may be feeling**, not tell them what to do.

---

### Conversational Reflection
Users can discuss an entry with the AI.

Chat features:
- Context from original entry and reflection
- Retrieval of similar past emotional states
- Conversation history stored per entry

---

### Emotional Memory (Vector Search)

Each entry is embedded using an embedding model and stored in a **vector database**.

This allows the system to:
- Detect similar emotional states
- Recall past experiences
- Provide context-aware responses

This helps the AI recognize **recurring emotional patterns**.

---

### Long-Term Analysis

Users can analyze their journal entries across a time range.

Analysis includes:

- dominant emotions
- recurring emotional patterns
- emotional intensity trends
- reaction to AI reflections
- emotional shifts over time

Range limits are enforced to prevent heavy queries.

## Architecture

![System Architecture](<system_architecture.png>)

---

## Tech Stack

Frontend
- Next.js
- React
- TailwindCSS

Backend
- Next.js API Routes
- Node.js

AI
- Ollama
- Mistral (LLM)
- Nomic Embed Text (Embeddings)

Database
- MongoDB

Vector Storage
- MongoDB vector collection

---

## Installation

### Clone the repository:

`git clone <repo-url>`

`cd ai-journal`

### Install dependencies:

`npm install`

### Setup Ollama

- Install Ollama: https://ollama.ai

- Pull models: `ollama pull mistral`, `ollama pull nomic-embed-text`

- Start the Ollama server: `ollama serve`

### Setup MongoDB

- Start MongoDB locally or connect to MongoDB Atlas.

- Create collections: entries, chats, vectors

### Run the Application
`npm run dev`

Application runs on:

http://localhost:3000

## Future Improvements

- Emotion clustering over time

- Emotion heatmap calendar

- Personal emotion baseline modeling

- Adaptive reflection generation

- Recommendation-aware reflection tone

- Visualization dashboard