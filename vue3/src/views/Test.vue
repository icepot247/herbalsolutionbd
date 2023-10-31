<template>
  <div class="p-5 mb-4 box rounded-3">
      <div class="container-fluid py-5">
          <div v-if="products">
              <h5>Products</h5>
              <ul class="mb-0">
                  <li v-for="product in products" :key="product.id">{{product.name}}</li>
              </ul>
          </div>
          <div v-if="!products" class="text-center">
              <div class="spinner-border spinner-border-sm"></div>
          </div>

      </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue';
    const products = ref(null);
    fetch('https://testapi.jasonwatmore.com/products')
        .then(response => response.json())
        .then(data => products.value = data);
</script>
