<template>
    <div>
        <footer class="footer">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                       &copy;{{(new Date().getFullYear())}} @ CNS Limited | v1.1.1
                    </div>
                    <div class="col-sm-6">
                        <span class="float-right d-sm-inline-block d-none">Design & Developed by
			            <a class="text-primary font-weight-bold" href="https://site.cnsbd.com" target="_blank">
                            <img src="images/cns-logo.png" alt="avatar">
			            </a>
		                </span>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    export default {
        name: 'Footer'
    }
</script>
