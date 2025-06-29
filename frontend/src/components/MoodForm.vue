<template>
  <form @submit.prevent="submitMood" style="margin-bottom: 20px;">
    <input type="text" v-model="text" placeholder="How are you feeling?" required style="padding: 8px; width: 70%; border: 1px solid #ccc; border-radius: 4px; margin-right: 10px;" />
    <input type="file" @change="onFileChange" accept="image/*" ref="fileInput" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
    <button type="submit" style="padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Post</button>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      text: '',
      file: null
    };
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async submitMood() {
      const formData = new FormData();
      formData.append('text', this.text);
      if (this.file) {
        formData.append('image', this.file);
      }
      try {
        await axios.post('http://localhost:3000/post', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.text = '';
        this.file = null;
        this.$refs.fileInput.value = '';
        this.$emit('posted');
      } catch (error) {
        console.error('Error posting mood:', error);
      }
    }
  }
};
</script>