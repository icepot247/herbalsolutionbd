<template>
    <div>
        <div>
            <!-- end container-fluid -->
        </div>
    </div>
</template>

<script>
    import AuthLayout from "../layouts/AuthLayout";
    import LocalStore from "../plugins/LocalStore";


    export default {
        name: 'LogoutPage',
        data() {
            return {  }
        },
        created() {
            this.$emit(`update:layout`, AuthLayout);
        },
        mounted() {
            LocalStore.removeAllStorage();
            LocalStore.removeStorage('user')
            LocalStore.removeStorage('token')
            this.$store.dispatch("removeUser"); //set state in storage
            this.$router.replace({ name: "login" });
            window.location.href = "/avis/login";
        },
        methods: {
        },
    }
</script>

<style lang="scss">

</style>

