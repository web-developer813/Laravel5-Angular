class KeyFieldAddController{
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
            let KeyFields = this.API.service('keyfield', this.API.all('keyFields'))

            let $state = this.$state
            KeyFields.post({
                'key_field_label': this.key_field_label
            }).then(function () {
                let alert = {type: 'success', 'title': 'Success!', msg: 'Key field has been added.'}
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

export const KeyFieldAddComponent = {
    templateUrl: './views/app/components/key-field-add/key-field-add.component.html',
    controller: KeyFieldAddController,
    controllerAs: 'vm',
    bindings: {}
}
