class PartnerEditController{
    constructor($stateParams, $state, API) {
        'ngInject'

        this.$state = $state
        this.formSubmitted = false
        this.alerts = []
        this.API = API

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }

        let partnerId = $stateParams.partnerId
        let Partner = API.service('partner-show', API.all('partners'))
        Partner.one(partnerId).get()
            .then((response) => {
                this.partner = API.copy(response)
            })
    }
    save(isValid) {
        if (isValid) {
            let $state = this.$state
            this.partner.put()
                .then(() => {
                    let alert = {type: 'success', 'title': 'Success!', msg: 'Partner has been updated.'}
                    $state.go($state.current, {alerts: alert})
                }, (response) => {
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

export const PartnerEditComponent = {
    templateUrl: './views/app/components/partner-edit/partner-edit.component.html',
    controller: PartnerEditController,
    controllerAs: 'vm',
    bindings: {}
}
