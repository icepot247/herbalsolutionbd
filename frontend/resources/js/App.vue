<template>
    <component :is="layout">
        <router-view :layout.sync="layout"/>
    </component>
</template>


<script>
    import DefaultLayout from "./layouts/DefaultLayout";

    export default {
        name: `App`,
        data() {
            return {
                layout: `div`,
            };
        },
        created() {
            if(this.$route.name!='screen'){
                this.layout =  DefaultLayout;
            }
            // this.layout =  DefaultLayout;
        },
    };
</script>
