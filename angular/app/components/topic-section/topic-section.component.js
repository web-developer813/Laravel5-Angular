class TopicSectionController{
    constructor($stateParams, $state, API,$scope,$http, $compile, DTOptionsBuilder, DTColumnBuilder) {
        'ngInject'
        this.API = API
        this.$state = $state
        this.$http = $http
        this.$scope = $scope
        this.formSubmitted = false
        this.alerts = []
        let Topics = API.service('topics')
        let Quarters =  API.service('quarters')
        Quarters.getList()
            .then((response) => {
                let quarterList = []
                let quarterResponse = response.plain()
                angular.forEach(quarterResponse, function (value) {
                    quarterList.push({id: value.id, name: value.quarter_name})
                })

                this.systemQuarters = quarterList
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

            $scope.vm.dailyTopicSelected = []
            $scope.vm.assessmentTopicSelected = []

            let createdRow = (row) => {
                $compile(angular.element(row).contents())($scope)
            }
            $http.post('/api/assessments/topic-data').success(function(data,status,headers, config){
                var list = []
                angular.forEach(data.response, function(value){
                    list.push({id: value.id, state_id: value.state_id, quarter_id : value.quarter_id, assessment_text: value.assessment_text ,  entry_text: value.note})
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
                    DTColumnBuilder.newColumn('state_id').withTitle('State'),
                    DTColumnBuilder.newColumn('quarter_id').withTitle('Quarter'),
                    DTColumnBuilder.newColumn('assessment_text').withTitle('Director Assessment'),
                    DTColumnBuilder.newColumn('entry_text').withTitle('Note')
                ]
            })
        $http.post('/api/datas/topic-data').success(function(data,status,headers, config){
            var list = []
            angular.forEach(data.response, function(value){
                list.push({id: value.id, state_id: value.state_id, key_field_id: value.key_field_id, partner_id:value.partner_id,created_at:value.created_at, creator:value.creator,date_of_action:value.date_of_action})
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
                DTColumnBuilder.newColumn('state_id').withTitle('State'),
                DTColumnBuilder.newColumn('created_at').withTitle('Date Entered'),
                DTColumnBuilder.newColumn('date_of_action').withTitle('Associated Date'),
                DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field'),
                DTColumnBuilder.newColumn('partner_id').withTitle('CCSSO Partner'),
                DTColumnBuilder.newColumn('creator').withTitle('User')
            ]
        })

        $scope.onTopicAssessment = function(){
            let topics = []
            for(var i =0; i< $scope.vm.assessmentTopicSelected.length; i++){
                topics.push($scope.vm.assessmentTopicSelected[i].id)
            }
            // var Indata ={
            //     'topic_id' : $scope.vm.topic_id
            // }
            var Indata ={
                'topic_id' : topics
            }
            $http.post('/api/assessments/topic-data',Indata).success(function(data,status,headers, config){
                var list = []
                angular.forEach(data.response, function(value){
                    list.push({id: value.id, state_id: value.state_id, quarter_id : value.quarter_id, assessment_text: value.assessment_text ,  entry_text: value.note})
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
                    DTColumnBuilder.newColumn('state_id').withTitle('State'),
                    DTColumnBuilder.newColumn('quarter_id').withTitle('Quarter'),
                    DTColumnBuilder.newColumn('assessment_text').withTitle('Director Assessment'),
                    DTColumnBuilder.newColumn('entry_text').withTitle('Note')
                ]
            })
        }

        $scope.onTopicDataCapture = function(){
            let topics = []
            for(var i =0; i< $scope.vm.dailyTopicSelected.length; i++){
                topics.push($scope.vm.dailyTopicSelected[i].id)
            }
            // var Indata ={
            //     'topic_id' : $scope.vm.daily.topic_id
            // }
            var Indata ={
                'topic_id' : topics
            }
            $http.post('/api/datas/topic-data',Indata).success(function(data,status,headers, config){
                var list = []
                angular.forEach(data.response, function(value){
                    list.push({id: value.id, state_id: value.state_id, key_field_id: value.key_field_id, partner_id:value.partner_id,created_at:value.created_at, creator:value.creator,date_of_action:value.date_of_action})
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
                    DTColumnBuilder.newColumn('state_id').withTitle('State'),
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

export const TopicSectionComponent = {
    templateUrl: './views/app/components/topic-section/topic-section.component.html',
    controller: TopicSectionController,
    controllerAs: 'vm',
    bindings: {}
}
