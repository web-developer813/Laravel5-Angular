class StateSectionController{
    constructor($stateParams, $state, API,$scope,$http, $compile, DTOptionsBuilder, DTColumnBuilder) {
        'ngInject'
        this.API = API
        this.$state = $state
        this.$http = $http
        this.$scope = $scope
        this.formSubmitted = false
        this.alerts = []
        let States = API.service('states')
        States.getList()
            .then((response) => {
                let statesList = []
                let statesResponse = response.plain()
                angular.forEach(statesResponse, function (value) {
                    statesList.push({id: value.id, name: value.state_name})
                })

                this.systemStates = statesList
            })
        this.assessmentStateSelected = []
        this.dailyStateSelected = []

        let createdRow = (row) => {
            $compile(angular.element(row).contents())($scope)
        }
        $http.post('/api/assessments/state-data').success(function(data,status,headers, config){
            var list = []
            angular.forEach(data.response, function(value){
                list.push({id: value.id, topic_id: value.topic_id, quarter_id : value.quarter_id, assessment_text: value.assessment_text ,  entry_text: value.note})
            })
            let dataSet = list
            $scope.displayTable = true
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('data', dataSet)
                .withOption('createdRow', createdRow)
                .withOption('responsive', true)
                .withOption('aaSorting', [[1, 'asc'],[2, 'asc']])
                .withBootstrap()

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('id').withTitle('ID'),
                DTColumnBuilder.newColumn('topic_id').withTitle('Topic'),
                DTColumnBuilder.newColumn('quarter_id').withTitle('Quarter'),
                DTColumnBuilder.newColumn('assessment_text').withTitle('Director Assessment'),
                DTColumnBuilder.newColumn('entry_text').withTitle('Note')
            ]
        })
        $http.post('/api/datas/state-data').success(function(data,status,headers, config){
            var list = []
            angular.forEach(data.response, function(value){
                list.push({id: value.id, topic_id: value.topic_id, key_field_id: value.key_field_id, partner_id:value.partner_id,created_at:value.created_at, creator:value.creator,date_of_action:value.date_of_action})
            })
            let dataSet = list
            $scope.displayTable1 = true
            $scope.dtOptions1 = DTOptionsBuilder.newOptions()
                .withOption('data', dataSet)
                .withOption('createdRow', createdRow)
                .withOption('responsive', true)
                .withOption('aaSorting', [[1, 'asc'],[2, 'asc'],[3, 'asc'],[4, 'asc'],[5, 'asc'],[5, 'asc']])
                .withBootstrap()

            $scope.dtColumns1 = [
                DTColumnBuilder.newColumn('id').withTitle('ID'),
                DTColumnBuilder.newColumn('topic_id').withTitle('Topic'),
                DTColumnBuilder.newColumn('created_at').withTitle('Date Entered'),
                DTColumnBuilder.newColumn('date_of_action').withTitle('Associated Date'),
                DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field'),
                DTColumnBuilder.newColumn('partner_id').withTitle('CCSSO Partner'),
                DTColumnBuilder.newColumn('creator').withTitle('User')
            ]
        })
        $scope.onStateAssessment =function(){
            let assessment_states = []
            for(var i =0; i<$scope.vm.assessmentStateSelected.length; i++){
                assessment_states.push($scope.vm.assessmentStateSelected[i].id)
            }
            // var Indata ={
            //     'state_id' : $scope.vm.state_id
            // }
            var Indata ={
                    'state_id' : assessment_states
                }
            $http.post('/api/assessments/state-data',Indata).success(function(data,status,headers, config){
                var list = []
                angular.forEach(data.response, function(value){
                    list.push({id: value.id, topic_id: value.topic_id, quarter_id : value.quarter_id, assessment_text: value.assessment_text ,  entry_text: value.note})
                })
                let dataSet = list
                $scope.displayTable = true
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('data', dataSet)
                    .withOption('createdRow', createdRow)
                    .withOption('responsive', true)
                    .withOption('aaSorting', [[1, 'asc'],[2, 'asc']])
                    .withBootstrap()

                $scope.dtColumns = [
                    DTColumnBuilder.newColumn('id').withTitle('ID'),
                    DTColumnBuilder.newColumn('topic_id').withTitle('Topic'),
                    DTColumnBuilder.newColumn('quarter_id').withTitle('Quarter'),
                    DTColumnBuilder.newColumn('assessment_text').withTitle('Director Assessment'),
                    DTColumnBuilder.newColumn('entry_text').withTitle('Note')
                ]
            })

        }
        $scope.onStateDataCapture =function(){
            let daily_states = []
            for(var i =0; i<$scope.vm.dailyStateSelected.length; i++){
                daily_states.push($scope.vm.dailyStateSelected[i].id)
            }

            // var Indata ={
            //     'state_id' : $scope.vm.daily.state_id
            // }
            var Indata ={
                'state_id' : daily_states
            }

            $http.post('/api/datas/state-data',Indata).success(function(data,status,headers, config){
                var list = []
                angular.forEach(data.response, function(value){
                    list.push({id: value.id, topic_id: value.topic_id, key_field_id: value.key_field_id, partner_id:value.partner_id,created_at:value.created_at, creator:value.creator,date_of_action:value.date_of_action})
                })
                let dataSet = list
                $scope.displayTable1 = true
                $scope.dtOptions1 = DTOptionsBuilder.newOptions()
                    .withOption('data', dataSet)
                    .withOption('createdRow', createdRow)
                    .withOption('responsive', true)
                    .withOption('aaSorting', [[1, 'asc'],[2, 'asc'],[3, 'asc'],[4, 'asc'],[5, 'asc'],[5, 'asc']])
                    .withBootstrap()

                $scope.dtColumns1 = [
                    DTColumnBuilder.newColumn('id').withTitle('ID'),
                    DTColumnBuilder.newColumn('topic_id').withTitle('Topic'),
                    DTColumnBuilder.newColumn('created_at').withTitle('Date Entered'),
                    DTColumnBuilder.newColumn('date_of_action').withTitle('Associated Date'),
                    DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field'),
                    DTColumnBuilder.newColumn('partner_id').withTitle('CCSSO Partner'),
                    DTColumnBuilder.newColumn('creator').withTitle('User')
                ]
            })
        }
    }

    $onInit(){
    }
}

export const StateSectionComponent = {
    templateUrl: './views/app/components/state-section/state-section.component.html',
    controller: StateSectionController,
    controllerAs: 'vm',
    bindings: {}
}
