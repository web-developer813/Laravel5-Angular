class CaptureEditController{
    constructor($stateParams, $state, API, $scope) {
        'ngInject'

        this.$state = $state
        this.formSubmitted = false
        this.alerts = []
        this.API = API
        this.$scope = $scope

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }
        let dataId = $stateParams.dataId
        let Topics = API.service('topics')
        let KeyFields = API.service('keyFields')
        let States = API.service('states')
        let Partners = API.service('partners')



        Partners.getList()
            .then((response) => {
                let partnerList = []
                let partnerResponse = response.plain()
                angular.forEach(partnerResponse, function (value) {
                    partnerList.push({id: value.id, name: value.partner_name})
                })

                this.systemPartners = partnerList
            })
        States.getList()
            .then((response) => {
                let statesList = []
                let statesResponse = response.plain()
                angular.forEach(statesResponse, function (value) {
                    statesList.push({id: value.id, name: value.state_name})
                })

                this.systemStates = statesList
            })
        Topics.getList()
            .then((response) => {
                let topicList = []
                let selectTopicList = []

                let topicResponse = response.plain()

                angular.forEach(topicResponse, function (value) {
                    topicList.push({id: value.id, name: value.topic_label})
                    selectTopicList.push(value)
                })

                this.systemTopics = topicList
                this.selectTopicList  = selectTopicList
            })
        KeyFields.getList()
            .then((response) => {
                let keyFieldList = []
                let keyFieldResponse = response.plain()

                angular.forEach(keyFieldResponse, function (value) {
                    keyFieldList.push({id: value.id, name: value.key_field_label})
                })

                this.systemKeyFields = keyFieldList
            })
        $scope.tinymceOptions = {
            theme : "modern",
            plugins: [
                "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code fullscreen",
                "insertdatetime media nonbreaking save table contextmenu directionality",
                "emoticons template paste textcolor "
            ],
            toolbar1: "insertfile undo redo | styleselect | bold italic underline  | link image forecolor backcolor",
            toolbar2: "media emoticons |  bullist numlist outdent indent",
        }
        let Datas = API.service('data-show', API.all('datas'))
        Datas.one(dataId).get()
            .then((response) => {
                this.data_daily = API.copy(response)
                var dailyStates = []
                var dailyTopics = []
                var dailyKeys  = []
                var dailyPartners = []
                var selectedTopics = []
                var selectedKeys = []
                var selectedStates = []
                var selectedPartners = []

                angular.forEach(this.data_daily.data.states, function(value){
                    dailyStates.push(value.state_id.toString())
                })
                angular.forEach(this.data_daily.data.topics, function(value){
                    dailyTopics.push(value.topic_id.toString())
                })
                angular.forEach(this.data_daily.data.keys, function(value){
                    dailyKeys.push(value.key_field_id.toString())
                })
                angular.forEach(this.data_daily.data.partners, function(value){
                    dailyPartners.push(value.partner_id.toString())
                })
                angular.forEach(this.data_daily.data.topics_array, function(value){
                    selectedTopics.push({id: value.id, name: value.topic_label})
                })
                angular.forEach(this.data_daily.data.keys_array, function(value){
                    selectedKeys.push({id: value.id, name: value.key_field_label})
                })
                angular.forEach(this.data_daily.data.states_array, function(value){
                    selectedStates.push({id: value.id, name: value.state_name})
                })
                angular.forEach(this.data_daily.data.partners_array, function(value){
                    selectedPartners.push({id: value.id, name: value.partner_name})
                })

                this.data_daily.data.key_field_id = dailyKeys
                this.data_daily.data.state_id = dailyStates
                this.data_daily.data.topic_id = dailyTopics
                this.data_daily.data.partner_id = dailyPartners

                this.topicSelected  = selectedTopics
                this.keySelected  = selectedKeys
                this.stateSelected = selectedStates
                this.partnerSelected = selectedPartners
            })
    }
    save(isValid) {
        if (isValid) {
            let $state = this.$state
            let topics = []
            for(var i =0; i<this.topicSelected.length; i++){
                topics.push(this.topicSelected[i].id)
            }
            let keys = []
            for(var i =0; i<this.keySelected.length; i++){
                keys.push(this.keySelected[i].id)
            }
            let states = []
            for(var i =0; i<this.stateSelected.length; i++){
                states.push(this.stateSelected[i].id)
            }
            let partners = []
            for(var i =0; i<this.partnerSelected.length; i++){
                partners.push(this.partnerSelected[i].id)
            }
            this.data_daily.data.topic_id = topics
            this.data_daily.data.key_field_id = keys
            this.data_daily.data.state_id = states
            this.data_daily.data.partner_id = partners

            this.data_daily.put()
                .then(() => {
                    let alert = {type: 'success', 'title': 'Success!', msg: 'Data capture has been updated.'}
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

export const CaptureEditComponent = {
    templateUrl: './views/app/components/capture-edit/capture-edit.component.html',
    controller: CaptureEditController,
    controllerAs: 'vm',
    bindings: {}
}
