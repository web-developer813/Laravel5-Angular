class KeyFieldEditController{
    constructor($stateParams, $state, API) {
        'ngInject'

        this.$state = $state
        this.formSubmitted = false
        this.alerts = []
        this.API = API

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }
        let keyFieldId = $stateParams.keyFieldId

        let KeyFields = API.service('keyfield-show', API.all('keyFields'))
        KeyFields.one(keyFieldId).get()
            .then((response) => {
                this.keyField = API.copy(response)
            })
    }
    save(isValid) {
        if (isValid) {
            let $state = this.$state
            this.keyField.put()
                .then(() => {
                    let alert = {type: 'success', 'title': 'Success!', msg: 'Key field has been updated.'}
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

export const KeyFieldEditComponent = {
    templateUrl: './views/app/components/key-field-edit/key-field-edit.component.html',
    controller: KeyFieldEditController,
    controllerAs: 'vm',
    bindings: {}
}
