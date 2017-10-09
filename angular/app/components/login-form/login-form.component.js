class LoginFormController {
    constructor($rootScope, $auth, $state, $stateParams, API, AclService) {
        'ngInject'

        delete $rootScope.me

        this.$auth = $auth
        this.$state = $state
        this.$stateParams = $stateParams
        this.AclService = AclService
        this.can = AclService.can

        this.registerSuccess = $stateParams.registerSuccess
        this.successMsg = $stateParams.successMsg
        this.loginfailederror = ''
        this.loginfailed = false
        this.unverified = false
    }

    $onInit() {
        this.user_name = ''
        this.password = ''
    }

    login() {
        this.loginfailederror = ''
        this.loginfailed = false
        this.unverified = false

        let user = {
            email: this.email,
            password: this.password
        }

        this.$auth.login(user)
            .then((response) => {
				let data = response.data.data
                let AclService = this.AclService

                angular.forEach(data.userRole, function (value) {
                    AclService.attachRole(value)
                })

                AclService.setAbilities(data.abilities)
                this.$auth.setToken(response.data)

                if(this.can("manage.datas") == true){
                    this.$state.go('app.datas')
                }else if(this.can("manage.assessments") == true){
                    this.$state.go('app.assessments')
                }else if(this.can("manage.summaries") == true){
                    this.$state.go('app.topicsection')
                }else if(this.can("admin.users") == true){
                    this.$state.go('app.userlist')
                }else{
                    this.$state.go('app.landing')
                }
                 //this.$state.go('app.landing')
            })
            .catch(this.failedLogin.bind(this))
    }

    failedLogin(res) {
        if (res.status == 401) {
            this.loginfailed = true
        } else {
            if (res.data.errors.message[0] == 'Email Unverified') {
                this.unverified = true
            } else if(res.data.errors.message[0] == 'unverified'){
                this.unverified = true
            }else {
                // other kinds of error returned from server
                for (var error in res.data.errors) {
                    this.loginfailederror += res.data.errors[error] + ' '
                }
            }
        }
    }
}

export const LoginFormComponent = {
    templateUrl: './views/app/components/login-form/login-form.component.html',
    controller: LoginFormController,
    controllerAs: 'vm',
    bindings: {}
}
