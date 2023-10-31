import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";

import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";

import BlankPage from "./pages/BlankPage";

import CenterPage from "./pages/CenterPage";
import BoothPage from "./pages/BoothPage";
import LanePage from "./pages/LanePage";
import UserPage from "./pages/UserPage";
import RolePage from "./pages/RolePage";
// import ShiftPage from "./pages/ShiftPage";
import AppointmentPage from "./pages/AppointmentPage";
import CheckAppointmentPage from "./pages/CheckAppointmentPage";
import QueueCancel from "./pages/QueueCancel";
import ResultPage from "./pages/ResultPage";
import CertificatePage from "./pages/CertificatePage";
import ReportPage from "./pages/ReportPage";
import RoleWiseMenuPage from "./pages/RoleWiseMenuPage";
// import ManualTest from "./pages/ManualTest";
// import TestItemClassMappingPage from "./pages/TestItemClassMappingPage";
import ClassMappingPage from "./pages/ClassMappingPage";


// import TestTypeItem from "./pages/TestTypeItemPage";

// import TestTypeItem from "./pages/TestTypeItemPage";


// import LoginPage2 from "./pages/LoginPage2";
import SubTestTypePage from "./pages/SubTestTypePage";
import ShiftSetupPage from "./pages/ShiftSetupPage";
import ShiftManagementPage from "./pages/ShiftManagementPage";
import DeviceSetupPage from "./pages/DeviceSetupPage";
import ScreenPage from "./pages/ScreenPage";
import LaneTypeMapping from "./pages/LaneTypeMapping";
import NotFoundPage from "./pages/NotFoundPage";
import ApiAccessLogPage from "./pages/ApiAccessLogPage";
import PadPage from "./pages/PadPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import UserTypeRoleMappingPage from "./pages/UserTypeRoleMappingPage";
import ProfilePage from "./pages/ProfilePage";
import StepsTimeLine from "./pages/StepsTimeLine";
import Inspectors from "./pages/Inspectors";

/*** Report Route **/
import ReportResult from "./pages/ReportResult";
import ReportAppointment from "./pages/ReportAppointment";
import ReportStage from "./pages/ReportStage";
import ReportFitnessTestReult from "./pages/ReportFitnessTestReult";
import ReportCertificate from "./pages/ReportCertificate";
import ReportInventory from "./pages/ReportInventory";
import WorkflowPage from "./pages/WorkflowPage";
import WorkflowDashboard from "./pages/WorkflowDashboard";
import ReportShiftManagementPage from "./pages/ReportShiftManagementPage";
import ReportCertificateCount from "./pages/ReportCertificateCount";
import ReportRating from "./pages/ReportRating";
import ReportRatingSummary from "./pages/ReportRatingSummary";
import ScheduleTaskSetup from "./pages/ScheduleTaskSetup";



/**End Report Route**/

export const routes = [
    {path: '/', redirect: {name: "login"}},
    {name: 'login', path: '/login', component: LoginPage},
    {name: 'profile', path: '/profile', component: ProfilePage,},
    {name: 'logout', path: '/logout', component: LogoutPage},
    // {name: 'blank', path: '/blank', component: BlankPage,},
    {name: 'report', path: '/report', component: ReportPage,},

    //Dashboard
    {name: 'home', path: '/home', component: HomePage,},

    //Setup
    {name: 'center', path: '/center', component: CenterPage},
    {name: 'booth', path: '/booth', component: BoothPage,},
    {name: 'lane', path: '/lane', component: LanePage,},
    {name: 'sub-test-type', path: '/sub-test-type', component: SubTestTypePage,},
    {name: 'class-wise-item-mapping', path: '/class-wise-item-mapping', component: ClassMappingPage,},
    {name:'shift-setup' ,path:'/shift-setup', component: ShiftSetupPage},
    {name:'device-setup' ,path:'/device-setup', component: DeviceSetupPage},


    //Users
    {name: 'users', path: '/users', component: UserPage,},
    {name: 'roles', path: '/roles', component: RolePage,},
    {name: 'role-wise-menu', path: '/role-wise-menu', component: RoleWiseMenuPage},
    // {name: 'shifting', path: '/shifting', component: ShiftPage,},
    {name:'shift-management' ,path:'/shift-management', component: ShiftManagementPage},

    //Fitness Test Process
    {name: 'check-appointment', path: '/check-appointment', component: CheckAppointmentPage,},
    {name: 'results', path: '/results', component: ResultPage,},
    {name: 'certificates', path: '/certificates', component: CertificatePage,},
    {name: 'queue-cancel', path: '/queue-cancel', component: QueueCancel,},

    // Inventory
    {name: 'inventory', path: '/inventory', component: InventoryPage,},
    {name: 'new-appointment', path: '/new-appointment', component: AppointmentPage,},

    // {name: 'manual-test', path: '/manual-test', component: ManualTest,},
    // {name: 'test-item-class-mapping', path: '/test-item-class-mapping', component: TestItemClassMappingPage,},

    // {name: 'test-type-item', path: '/test-type-item', component: TestTypeItem,},

    // {name: 'test-type-item', path: '/test-type-item', component: TestTypeItem,},

    // {name: 'login2', path: '/login2', component: LoginPage2},

    {name: 'screen', path: '/screen', component: ScreenPage},
    {name: 'lane-type-mapping', path: '/lane-type-mapping', component: LaneTypeMapping},
    {name: 'url-access-log', path: '/url-access-log', component: ApiAccessLogPage},
    {name: 'activity-log', path: '/activity-log', component: ActivityLogPage},
    {name: 'user-type-role-mapping', path: '/user-type-role-mapping', component: UserTypeRoleMappingPage},
    {name: 'pad', path: '/pad', component: PadPage},
    {name: 'steps-timeline', path: '/steps-timeline', component: StepsTimeLine},
    {name: 'center-inspectors', path: '/center-inspectors', component: Inspectors},
    {name: '404', path: '/404', component: NotFoundPage},
    {path: '*', redirect: '/404' },
    {name: 'report-result', path:'/report-result',component: ReportResult},
    {name: 'report-stage', path:'/report-stage',component: ReportStage},

    {name: 'report-appointments', path:'/report-appointments',component: ReportAppointment},
    {name: 'report-fitness-test-result', path:'/report-fitness-test-result',component: ReportFitnessTestReult},
    {name: 'report-certificate', path:'/report-certificate',component: ReportCertificate},
    {name: 'report-inventory', path:'/report-inventory',component: ReportInventory},
    {name: 'workflow', path:'/workflow',component: WorkflowPage},
    {name: 'workflow-dashboard', path:'/workflow-dashboard',component: WorkflowDashboard},
    {name: 'report-shifting', path:'/report-shifting',component: ReportShiftManagementPage},
    {name: 'report-certificate-count', path:'/report-certificate-count',component: ReportCertificateCount},
    {name: 'report-customer-rating', path:'/report-customer-rating',component: ReportRating},
    {name: 'report-customer-rating-summary', path:'/report-customer-rating-summary',component: ReportRatingSummary},
    {name: 'schedule-task-setup', path:'/schedule-task-setup',component: ScheduleTaskSetup},

];
