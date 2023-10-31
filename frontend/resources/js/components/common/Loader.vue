<template>
    <div>
        <div v-if="loading">
            <div id="status">
                <div class="spinner-chase">
                    <div class="chase-dot"></div>
                    <div class="chase-dot"></div>
                    <div class="chase-dot"></div>
                    <div class="chase-dot"></div>
                    <div class="chase-dot"></div>
                    <div class="chase-dot"></div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    export default {
        name:'Loader',
        props:['loading']
    }
</script>
