<template>
  <div>

    <!-- ============================================================== -->
    <!-- Start right Content here -->
    <!-- ============================================================== -->
    <div class="main-content">

      <div class="page-content">
        <div class="container-fluid">
          <Breadcrumb :title="pageTitle"/>
          <!--start Appoint Check -->
          <div class="row">
            <div class="col-xl-12">
              <checkAppointmentForm @sendToPage="getFromTable"/>

              <appointmentSearchData :resStatus="status" :resSearchData="searchdata"/>


              <!-- end card body -->
            </div>
            <!-- end card -->
          </div>
          <!-- end col -->
        </div>
        <!--end Appoint Check-->

      </div> <!-- container-fluid -->
    </div>
    <!-- End Page-content -->


  </div>

</template>

<script>
import DefaultLayout from "../layouts/DefaultLayout";
import Breadcrumb from "../components/common/Breadcrumb";
import checkAppointmentForm from "../components/checkAppointment/checkAppointmentForm"
import appointmentSearchData from "../components/checkAppointment/appointmentSearchData"

export default {
  name: 'CheckAppointmentPage',
  components: {checkAppointmentForm, Breadcrumb, appointmentSearchData},
  data() {
    return {
      pageTitle: 'Check Appointment',
      searchdata: [],
      status: true,
      paymentStatus: false,
    }
  },
  created() {
    this.$emit(`update:layout`, DefaultLayout);
  },
  mounted() {
  },
  methods: {
    getFromTable(status, data) {
      this.status = status;
      this.searchdata = data;
    }


  },
  computed: {}
}
</script>

<style lang="scss">

</style>

