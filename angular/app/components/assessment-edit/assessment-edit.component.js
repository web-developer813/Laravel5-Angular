class AssessmentEditController{
    constructor($stateParams, $state, API,$scope,$http, $compile, DTOptionsBuilder, DTColumnBuilder) {
        'ngInject'

        this.$state = $state
        this.$scope = $scope
        this.formSubmitted = false
        this.alerts = []
        this.API = API
        let Topics = API.service('topics')
        let KeyFields = API.service('keyFields')
        let States = API.service('states')
        let Quarters =  API.service('quarters')
        let assessmentId = $stateParams.assessmentId

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }
        Quarters.getList()
            .then((response) => {
                let quarterList = []
                let quarterResponse = response.plain()
                angular.forEach(quarterResponse, function (value) {
                    quarterList.push({id: value.id, name: value.quarter_name})
                })

                this.systemQuarters = quarterList
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
                let topicResponse = response.plain()

                angular.forEach(topicResponse, function (value) {
                    topicList.push({id: value.id, name: value.topic_label})
                })

                this.systemTopics = topicList
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
        this.entry_date = new Date()
        let Assessments = API.service('assessment-show', API.all('assessments'))
        Assessments.one(assessmentId).get()
            .then((response) => {
                this.assessment = API.copy(response)
                $scope.assessment =this.assessment
                var dailyStates = []
                var dailyTopics = []
                var dailyKeys  = []
                var dailyEntries = []
                $scope.selection =[]
                var selectedTopics = []
                var selectedKeys = []
                var selectedStates = []

                angular.forEach(this.assessment.data.states, function(value){
                    dailyStates.push(value.state_id.toString())
                })
                angular.forEach(this.assessment.data.topics, function(value){
                    dailyTopics.push(value.topic_id.toString())
                })
                angular.forEach(this.assessment.data.keys, function(value){
                    dailyKeys.push(value.key_field_id.toString())
                })
                angular.forEach(this.assessment.data.entry, function(value){
                    dailyEntries.push(value.entry_id.toString())
                    $scope.selection.push(value.entry_id)
                })
                angular.forEach(this.assessment.data.topics_array, function(value){
                    selectedTopics.push({id: value.id, name: value.topic_label})
                })
                angular.forEach(this.assessment.data.keys_array, function(value){
                    selectedKeys.push({id: value.id, name: value.key_field_label})
                })
                angular.forEach(this.assessment.data.states_array, function(value){
                    selectedStates.push({id: value.id, name: value.state_name})
                })
                this.assessment.data.key_field_id = dailyKeys
                this.assessment.data.state_id = dailyStates
                this.assessment.data.topic_id = dailyTopics
                // this.assessment.data.entry_id = dailyEntries
                this.topicSelected  = selectedTopics
                this.keySelected  = selectedKeys
                this.stateSelected = selectedStates

                var topicArray = this.assessment.data.topic_id
                var keyFieldArray = this.assessment.data.key_field_id
                var stateArray =  this.assessment.data.state_id
                var Indata = {
                    topic_id : topicArray,
                    key_field_id :keyFieldArray,
                    state_id :stateArray,
                }
                $http.post('/api/datas/datas',Indata).success(function(data,status,headers, config){
                    var list = []
                    angular.forEach(data.response, function(value){
                        list.push({id: value.id, topic_id: value.topic_id, key_field_id: value.key_field_id, state_id : value.state_id, partner_id: value.partner_id, entry_text:value.entry_text, date_of_action : value.date_of_action})
                    })
                    $scope.systemDatas = list

                    let dataSet = list
                    $scope.displayTable = true
                    $scope.dtOptions = DTOptionsBuilder.newOptions()
                        .withOption('data', dataSet)
                        .withOption('createdRow', createdRow)
                        .withOption('bFilter', false)
                        .withOption('responsive', true)
                        .withBootstrap()

                    $scope.dtColumns = [
                        DTColumnBuilder.newColumn(null).withTitle('').renderWith(actionsHtml),
                        DTColumnBuilder.newColumn('date_of_action').withTitle('Date Of Action'),
                        DTColumnBuilder.newColumn('topic_id').withTitle('Topic Label'),
                        DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field Label'),
                        DTColumnBuilder.newColumn('state_id').withTitle('State Name'),
                        DTColumnBuilder.newColumn('partner_id').withTitle('Partner Name'),
                        DTColumnBuilder.newColumn('entry_text').withTitle('Note')
                    ]
                })
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
        $scope.onGetDatas = function(){
            let topics = []
            for(var i =0; i<$scope.vm.topicSelected.length; i++){
                topics.push($scope.vm.topicSelected[i].id)
            }
            let keys = []
            for(var i =0; i<$scope.vm.keySelected.length; i++){
                keys.push($scope.vm.keySelected[i].id)
            }
            let states = []
            for(var i =0; i< $scope.vm.stateSelected.length; i++){
                states.push( $scope.vm.stateSelected[i].id)
            }
            var Indata = {
                topic_id : topics,
                key_field_id : keys,
                state_id : states,
            }
            // var Indata = {
            //     topic_id : $scope.vm.assessment.data.topic_id,
            //     key_field_id : $scope.vm.assessment.data.key_field_id,
            //     state_id : $scope.vm.assessment.data.state_id,
            // }
            $http.post('/api/datas/datas',Indata).success(function(data,status,headers, config){
                var list = []
                angular.forEach(data.response, function(value){
                    list.push({id: value.id, topic_id: value.topic_id, key_field_id: value.key_field_id, state_id : value.state_id, partner_id: value.partner_id, entry_text:value.entry_text, date_of_action : value.date_of_action})
                })
                $scope.systemDatas = list
                let dataSet = list
                $scope.displayTable = true
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('data', dataSet)
                    .withOption('createdRow', createdRow)
                    .withOption('bFilter', false)
                    .withOption('responsive', true)
                    .withBootstrap()

                $scope.dtColumns = [
                    DTColumnBuilder.newColumn(null).withTitle('').renderWith(actionsHtml),
                    DTColumnBuilder.newColumn('date_of_action').withTitle('Date Of Action'),
                    DTColumnBuilder.newColumn('topic_id').withTitle('Topic Label'),
                    DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field Label'),
                    DTColumnBuilder.newColumn('state_id').withTitle('State Name'),
                    DTColumnBuilder.newColumn('partner_id').withTitle('Partner Name'),
                    DTColumnBuilder.newColumn('entry_text').withTitle('Note').withOption('sWidth','250px'),
                ]
            })
        }
        let createdRow = (row) => {
            $compile(angular.element(row).contents())($scope)
        }
        let actionsHtml = (data) => {
            return `
                <input type="checkbox"  name="data_ids[]" value="${data.id}" ng-checked="selection.indexOf(${data.id}) > -1"  ng-click="toggleSelection(${data.id})" >
                `
        }


        $scope.toggleSelection = function toggleSelection(id) {
            var idx = $scope.selection.indexOf(id)

            // Is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1)
            }

            // Is newly selected
            else {
                $scope.selection.push(id)
                this.selectionDatas = $scope.selection
                console.log($scope.selection)
            }
        }
    }
    save(isValid) {
        if (isValid) {
            let $state = this.$state
            this.assessment.data.entry_id = this.$scope.selection
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
            this.assessment.data.topic_id = topics
            this.assessment.data.key_field_id = keys
            this.assessment.data.state_id = states

            this.assessment.put()
                .then(() => {
                    let alert = {type: 'success', 'title': 'Success!', msg: 'Quarterly assessment has been updated.'}
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

export const AssessmentEditComponent = {
    templateUrl: './views/app/components/assessment-edit/assessment-edit.component.html',
    controller: AssessmentEditController,
    controllerAs: 'vm',
    bindings: {}
}
