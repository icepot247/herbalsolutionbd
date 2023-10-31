export const useUser = () => {
    const uri = "https://reqres.in/api/users?page=2";

    const users = ref([]);

    const getUsers = async () => {
        users.value = await $fetch(uri, {
            baseURL: uri,
            method: 'get'
        })

        return users;
    }

    return { users, getUsers }
}
