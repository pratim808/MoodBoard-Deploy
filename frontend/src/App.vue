<template>
  <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h1 style="color: #333; text-align: center;">MoodBoard</h1>
    <MoodForm @posted="fetchFeed" />
    <h2 style="color: #555; margin-top: 20px;">Mood Feed</h2>
    <div v-for="entry in entries" :key="entry.timestamp" style="margin-bottom: 15px; padding: 10px; background-color: #fff; border-radius: 5px; border: 1px solid #ddd;">
      <p style="margin: 0; color: #444;">{{ entry.text }}</p>
      <img v-if="entry.image" :src="`http://localhost:3000${entry.image}`" alt="Mood image" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 5px;" />
      <small style="color: #777; display: block; margin-top: 5px;">{{ entry.timestamp }}</small>
    </div>
  </div>
</template>

<script>
import MoodForm from './components/MoodForm.vue';
// Removed MoodFeed from components since it's not used
import axios from 'axios';

export default {
  components: {
    MoodForm
  },
  data() {
    return {
      entries: []
    };
  },
  methods: {
    async fetchFeed() {
      try {
        const response = await axios.get('http://localhost:3000/feed');
        this.entries = response.data;
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    }
  },
  created() {
    this.fetchFeed();
  }
};
</script>