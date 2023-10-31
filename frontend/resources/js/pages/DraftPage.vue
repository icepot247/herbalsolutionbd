<tamplate>
    <div>
        <h2 class="text-center">Login page</h2>


    </div>
</tamplate>

<script>
    export default {
        name:'login',
        data() {

            return {
                products: []
            }
        },
        created() {
            console.log('avis', process.env.MIX_API_URL)
            // this.axios
            //     .get('http://localhost:8000/api/products/')
            //     .then(response => {
            //         this.products = response.data;
            //     });
        },
        methods: {
            deleteProduct(id) {
                // this.axios
                //     .delete(`http://localhost:8000/api/products/${id}`)
                //     .then(response => {
                //         let i = this.products.map(data => data.id).indexOf(id);
                //         this.products.splice(i, 1)
                //     });
            }
        }
    }
</script>
