class PartnerAddController{
    constructor ($stateParams, $state, API) {
        'ngInject'

        this.$state = $state
        this.formSubmitted = false
        this.alerts = []
        this.API = API

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }
    }
    save(isValid) {
        this.$state.go(this.$state.current, {}, {alerts: 'test'})
        if (isValid) {
            let Partners = this.API.service('partner', this.API.all('partners'))
            let $state = this.$state
            Partners.post({
                'partner_name': this.partner_name
            }).then(function () {
                let alert = {type: 'success', 'title': 'Success!', msg: 'Partner has been added.'}
                $state.go($state.current, {alerts: alert})
            }, function (response) {
                let alert = {type: 'error', 'title': 'Error!', msg: response.data.message}
                $state.go($state.current, {alerts: alert})
            })
        } else {
            this.formSubmitted = true
        }
    }
    $onInit(){
    }
}

export const PartnerAddComponent = {
    templateUrl: './views/app/components/partner-add/partner-add.component.html',
    controller: PartnerAddController,
    controllerAs: 'vm',
    bindings: {}
}
