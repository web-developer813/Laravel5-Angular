class TopicsEditController{
    constructor($stateParams, $state, API) {
        'ngInject'

        this.$state = $state
        this.formSubmitted = false
        this.alerts = []
        this.API = API

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }
        let topicId = $stateParams.topicId

        let Topic = API.service('topic-show', API.all('topics'))
        Topic.one(topicId).get()
            .then((response) => {
                this.topic = API.copy(response)
            })
    }
    save(isValid) {
        if (isValid) {
            let $state = this.$state
            this.topic.put()
                .then(() => {
                    let alert = {type: 'success', 'title': 'Success!', msg: 'Topic has been updated.'}
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

export const TopicsEditComponent = {
    templateUrl: './views/app/components/topics-edit/topics-edit.component.html',
    controller: TopicsEditController,
    controllerAs: 'vm',
    bindings: {}
}
