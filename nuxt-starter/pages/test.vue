<template>
    <div>
        <form class="js-validate needs-validation">
            <input type="email" class="form-control form-control-lg" name="email">
            <input type="password" class="js-toggle-password form-control form-control-lg" name="password">
            <button type="submit" class="btn btn-primary btn-lg" @click.prevent="authLogin">Log in</button>
        </form>
    </div>

    <div>
        <table class="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users.data" :key="user.id">
                <th scope="row">{{ user.id }}</th>
                <td>{{ user.first_name }}</td>
                <td>{{ user.email }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
    import {useRouter} from 'vue-router';

    const router = useRouter();

    const authLogin = () => {
        router.push('/admin')
    }

    const {users, getUsers} = useUser();

    onMounted(async () => {
        await getUsers()
    })

    /*const {
  data: users,
  pending: fetchUsers,
  error: fetchUsersError,
    refresh,
} = useAsyncData('get-users', async () => {
  let response
  try {
    response = await getUsers()
  } catch (error){}
  return response;
})*/
</script>
