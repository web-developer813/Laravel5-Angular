class TopicsAddController{
    constructor ($stateParams, $state, API) {
        'ngInject'

        this.$state = $state
        this.formSubmitted = false
        this.alerts = []
        this.userRolesSelected = []
        this.API = API

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }
    }
    save(isValid) {
        this.$state.go(this.$state.current, {}, {alerts: 'test'})
        if (isValid) {
            let Topics = this.API.service('topics', this.API.all('topics'))
            let $state = this.$state
            Topics.post({
                'topic_label': this.topic_label
            }).then(function () {
                let alert = {type: 'success', 'title': 'Success!', msg: 'Topic has been added.'}
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

export const TopicsAddComponent = {
    templateUrl: './views/app/components/topics-add/topics-add.component.html',
    controller: TopicsAddController,
    controllerAs: 'vm',
    bindings: {}
}
