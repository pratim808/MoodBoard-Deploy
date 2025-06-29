<template>
  <div>
    <div v-for="entry in entries" :key="entry.timestamp" style="margin-bottom: 15px; padding: 10px; background-color: #fff; border-radius: 5px; border: 1px solid #ddd;">
      <p style="margin: 0; color: #444;">{{ entry.text }}</p>
      <img v-if="entry.image" :src="`http://localhost:3000${entry.image}`" alt="Mood image" style="max-width: 100%; height: auto; margin-top: 10px; border-radius: 5px;" />
      <small style="color: #777; display: block; margin-top: 5px;">{{ entry.timestamp }}</small>
    </div>
  </div>
</template>

<script>
export default {
  props: ['entries']
};
</script>