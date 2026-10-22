<script setup>
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

</script>

<template>
  <h1>PaintRooms</h1>
</template>

<style scoped>
</style>
