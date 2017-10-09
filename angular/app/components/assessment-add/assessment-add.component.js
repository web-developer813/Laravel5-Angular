class AssessmentAddController{
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
        this.topicSelected = []
        this.stateSelected = []
        this.keySelected = []
        this.entry_date = new Date()
        $scope.format = 'MM/dd/yyyy'
        $scope.altInputFormats = ['MM/dd/yyyy']
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
        $http.get('/api/datas/').success(function(data,status,headers, config){
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
                DTColumnBuilder.newColumn('topic_id').withTitle('Topic'),
                DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field'),
                DTColumnBuilder.newColumn('state_id').withTitle('State'),
                DTColumnBuilder.newColumn('partner_id').withTitle('Partner'),
                DTColumnBuilder.newColumn('entry_text').withTitle('Note').withOption('sWidth','250px')
              ]

        })
        let createdRow = (row) => {
            $compile(angular.element(row).contents())($scope)
        }
        let actionsHtml = (data) => {
            return `
                <input type="checkbox"  name="data_ids[]" value="${data.id}" ng-checked="selection.indexOf(${data.id}) > -1" ng-click="toggleSelection(${data.id})" >
                `

        }
        $scope.selection =[]
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
            }
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
            //     topic_id : $scope.vm.topic_id,
            //     key_field_id : $scope.vm.key_field_id,
            //     state_id : $scope.vm.state_id,
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
                    DTColumnBuilder.newColumn('entry_text').withTitle('Note')
                ]
            })
        }
    }
    save(isValid) {
        this.$state.go(this.$state.current, {}, {alerts: 'test'})
        if (isValid) {
            let Assessments = this.API.service('assessment', this.API.all('assessments'))
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
            // Assessments.post({
            //     'topic_id': this.topic_id,
            //     'key_field_id' : this .key_field_id,
            //     'state_id' : this.state_id,
            //     'assessment_text' : this.assessment_text,
            //     'data_capture_id': this.$scope.selection,
            //     'quarter_id': this.quarter_id
            // }).then(function () {
            Assessments.post({
                'topic_id': topics,
                'key_field_id' : keys,
                'state_id' : states,
                'assessment_text' : this.assessment_text,
                'data_capture_id': this.$scope.selection,
                'quarter_id': this.quarter_id
            }).then(function () {
                let alert = { type: 'success', 'title': 'Success!', msg: 'Assessment has been added.' }
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

export const AssessmentAddComponent = {
    templateUrl: './views/app/components/assessment-add/assessment-add.component.html',
    controller: AssessmentAddController,
    controllerAs: 'vm',
    bindings: {}
}
