import {StateSectionComponent} from './app/components/state-section/state-section.component';
import {TopicSectionComponent} from './app/components/topic-section/topic-section.component';
import {AssessmentEditComponent} from './app/components/assessment-edit/assessment-edit.component';
import {AssessmentAddComponent} from './app/components/assessment-add/assessment-add.component';
import {AssessmentComponent} from './app/components/assessment/assessment.component';
import {CaptureEditComponent} from './app/components/capture-edit/capture-edit.component';
import {CaptureAddComponent} from './app/components/capture-add/capture-add.component';
import {DatasComponent} from './app/components/datas/datas.component';
import {PartnerEditComponent} from './app/components/partner-edit/partner-edit.component';
import {PartnerAddComponent} from './app/components/partner-add/partner-add.component';
import {PartnersComponent} from './app/components/partners/partners.component';
import {KeyFieldEditComponent} from './app/components/key-field-edit/key-field-edit.component';
import {KeyFieldAddComponent} from './app/components/key-field-add/key-field-add.component';
import {KeyFieldsComponent} from './app/components/key-fields/key-fields.component';
import {TopicsEditComponent} from './app/components/topics-edit/topics-edit.component';
import {TopicsAddComponent} from './app/components/topics-add/topics-add.component';
import {TopicsComponent} from './app/components/topics/topics.component';
import {UserAddComponent} from './app/components/user-add/user-add.component';
import { TablesSimpleComponent } from './app/components/tables-simple/tables-simple.component'
import { UiModalComponent } from './app/components/ui-modal/ui-modal.component'
import { UiTimelineComponent } from './app/components/ui-timeline/ui-timeline.component'
import { UiButtonsComponent } from './app/components/ui-buttons/ui-buttons.component'
import { UiIconsComponent } from './app/components/ui-icons/ui-icons.component'
import { UiGeneralComponent } from './app/components/ui-general/ui-general.component'
import { FormsGeneralComponent } from './app/components/forms-general/forms-general.component'
import { ChartsChartjsComponent } from './app/components/charts-chartjs/charts-chartjs.component'
import { WidgetsComponent } from './app/components/widgets/widgets.component'
import { UserProfileComponent } from './app/components/user-profile/user-profile.component'
import { UserVerificationComponent } from './app/components/user-verification/user-verification.component'
import { ComingSoonComponent } from './app/components/coming-soon/coming-soon.component'
import { UserEditComponent } from './app/components/user-edit/user-edit.component'
import { UserPermissionsEditComponent } from './app/components/user-permissions-edit/user-permissions-edit.component'
import { UserPermissionsAddComponent } from './app/components/user-permissions-add/user-permissions-add.component'
import { UserPermissionsComponent } from './app/components/user-permissions/user-permissions.component'
import { UserRolesEditComponent } from './app/components/user-roles-edit/user-roles-edit.component'
import { UserRolesAddComponent } from './app/components/user-roles-add/user-roles-add.component'
import { UserRolesComponent } from './app/components/user-roles/user-roles.component'
import { UserListsComponent } from './app/components/user-lists/user-lists.component'
import { DashboardComponent } from './app/components/dashboard/dashboard.component'
import { NavSidebarComponent } from './app/components/nav-sidebar/nav-sidebar.component'
import { NavHeaderComponent } from './app/components/nav-header/nav-header.component'
import { LoginLoaderComponent } from './app/components/login-loader/login-loader.component'
import { ResetPasswordComponent } from './app/components/reset-password/reset-password.component'
import { ForgotPasswordComponent } from './app/components/forgot-password/forgot-password.component'
import { LoginFormComponent } from './app/components/login-form/login-form.component'
import { RegisterFormComponent } from './app/components/register-form/register-form.component'

angular.module('app.components')
	.component('stateSection', StateSectionComponent)
	.component('topicSection', TopicSectionComponent)
	.component('assessmentEdit', AssessmentEditComponent)
	.component('assessmentAdd', AssessmentAddComponent)
	.component('assessment', AssessmentComponent)
	.component('captureEdit', CaptureEditComponent)
	.component('captureAdd', CaptureAddComponent)
	.component('datas', DatasComponent)
	.component('partnerEdit', PartnerEditComponent)
	.component('partnerAdd', PartnerAddComponent)
	.component('partners', PartnersComponent)
	.component('keyFieldEdit', KeyFieldEditComponent)
	.component('keyFieldAdd', KeyFieldAddComponent)
	.component('keyFields', KeyFieldsComponent)
	.component('topicsEdit', TopicsEditComponent)
	.component('topicsAdd', TopicsAddComponent)
	.component('topics', TopicsComponent)
	.component('userAdd', UserAddComponent)
  .component('tablesSimple', TablesSimpleComponent)
  .component('uiModal', UiModalComponent)
  .component('uiTimeline', UiTimelineComponent)
  .component('uiButtons', UiButtonsComponent)
  .component('uiIcons', UiIconsComponent)
  .component('uiGeneral', UiGeneralComponent)
  .component('formsGeneral', FormsGeneralComponent)
  .component('chartsChartjs', ChartsChartjsComponent)
  .component('widgets', WidgetsComponent)
  .component('userProfile', UserProfileComponent)
  .component('userVerification', UserVerificationComponent)
  .component('comingSoon', ComingSoonComponent)
  .component('userEdit', UserEditComponent)
  .component('userPermissionsEdit', UserPermissionsEditComponent)
  .component('userPermissionsAdd', UserPermissionsAddComponent)
  .component('userPermissions', UserPermissionsComponent)
  .component('userRolesEdit', UserRolesEditComponent)
  .component('userRolesAdd', UserRolesAddComponent)
  .component('userRoles', UserRolesComponent)
  .component('userLists', UserListsComponent)
  .component('dashboard', DashboardComponent)
  .component('navSidebar', NavSidebarComponent)
  .component('navHeader', NavHeaderComponent)
  .component('loginLoader', LoginLoaderComponent)
  .component('resetPassword', ResetPasswordComponent)
  .component('forgotPassword', ForgotPasswordComponent)
  .component('loginForm', LoginFormComponent)
  .component('registerForm', RegisterFormComponent)
