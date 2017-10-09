class AssessmentController{
    constructor($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API,$http,AclService,ContextService) {
        'ngInject'

        this.API = API
        this.$state = $state
        this.$scope = $scope
        let assessmentBar = this
        this.can = AclService.can
        ContextService.me(function (data) {
            assessmentBar.userData = data
        })
        let Topics = API.service('topics')
        let KeyFields = API.service('keyFields')
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
        $scope.vm.searchTopicSelected = []
        $scope.vm.searchKeySelected = []
        $scope.vm.searchStateSelected = []

        $http.get('/api/assessments/').success(function(data,status,headers, config){
            var list = []
            angular.forEach(data.response, function(value){
                list.push({id: value.id, topic_id: value.topic_id, key_field_id: value.key_field_id, state_id : value.state_id, assessment_text:value.assessment_text})
            })
            $scope.systemAssessments = list
            let dataSet = list
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('data', dataSet)
                .withOption('createdRow', createdRow)
                .withOption('responsive', true)
                .withBootstrap()

            $scope.dtColumns = [
                // DTColumnBuilder.newColumn('id').withTitle('ID'),
                DTColumnBuilder.newColumn('topic_id').withTitle('Topic').withClass("topic_class"),
                DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field').withClass("key_class"),
                DTColumnBuilder.newColumn('state_id').withTitle('State ').withClass("state_class"),
                DTColumnBuilder.newColumn('assessment_text').withTitle('Assessment'),
                DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                    .renderWith(actionsHtml)
            ]
            $scope.displayTable = true
        })
        let createdRow = (row) => {
            $compile(angular.element(row).contents())($scope)
        }
        let actionsHtml = (data) => {
            return `
                <a class="btn btn-xs btn-warning" ui-sref="app.assessmentedit({assessmentId: ${data.id}})">
                    <i class="fa fa-edit"></i>
                </a>
                &nbsp
                <button class="btn btn-xs btn-danger" ng-click="vm.delete(${data.id})">
                    <i class="fa fa-trash-o" style="width:12.02px"></i>
                </button>`
        }

        $scope.today = function() {
            $scope.dt = new Date()
        }
        $scope.today()


        $scope.clear = function() {
            $scope.dt = ""
        }

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        }

        $scope.dateOptions = {
            formatYear: 'yyyy',
            minDate: new Date(),
            startingDay: 1,
        }


        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date()
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate
        }

        $scope.toggleMin()

        $scope.open1 = function() {
            $scope.popup1.opened = true
        }

        this.entry_date = new Date()
        // this.date_of_action = new Date();

        $scope.setDate = function(year, month, day) {
            $scope.dt = new Date(year, month, day)
        }

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate']
        $scope.format = 'MM/dd/yyyy'
        $scope.altInputFormats = ['MM/dd/yyyy']

        $scope.popup1 = {
            opened: false
        }
        $scope.popup2 = {
            opened: false
        }
        $scope.open2 = function() {
            $scope.popup2.opened = true
        }

        var tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        var afterTomorrow = new Date()
        afterTomorrow.setDate(tomorrow.getDate() + 1)
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ]

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0)

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0)

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status
                    }
                }
            }

            return ''
        }
        $scope.onGetDatas = function(){
            if($scope.vm.from == null || $scope.vm.from == "undefined"){
                $scope.from_date =""
            }else{
                $scope.from_date =$scope.convert($scope.vm.from)
            }
            if($scope.vm.to == null || $scope.vm.to == "undefined"){
                $scope.to_date =""
            }else{
                $scope.to_date =$scope.convert($scope.vm.to)
            }
            let topics = []
            for(var i =0; i< $scope.vm.searchTopicSelected.length; i++){
                topics.push($scope.vm.searchTopicSelected[i].id)
            }
            let keys = []
            for(var i =0; i<$scope.vm.searchKeySelected.length; i++){
                keys.push($scope.vm.searchKeySelected[i].id)
            }
            let states = []
            for(var i =0; i<$scope.vm.searchStateSelected.length; i++){
                states.push($scope.vm.searchStateSelected[i].id)
            }

            // var inData = {
            //     'topic_id' : $scope.vm.topic_id,
            //     'key_field_id' : $scope.vm.key_field_id,
            //     'state_id' : $scope.vm.state_id,
            //     'from' : $scope.from_date,
            //     'to' : $scope.to_date
            // }
            var inData = {
                'topic_id' : topics,
                'key_field_id' : keys,
                'state_id' : states,
                'from' : $scope.from_date,
                'to' : $scope.to_date
            }
            $scope.onGetDataList(inData)
        }
        $scope.onClearSearch =function(){
            $scope.vm.topic_id = ""
            $scope.vm.from = ""
            $scope.vm.to = ""
            $scope.vm.key_field_id = ""
            $scope.vm.state_id = ""
            var inData = {
                'topic_id' : [''],
                'key_field_id' : [''],
                'state_id' : [''],
                'from' : '',
                'to' : ''
            }
            $scope.onGetDataList(inData)
        }
        $scope.onExportToExcel = function(){
            $http.post('/api/assessments/export').success(function (data, status, headers, config) {
                if(data.result == "success"){
                    var a = document.createElement('a');
                    a.href = '/assessment_export.csv';
                    a.target = '_blank';
                    a.download = 'assessment_export.csv';
                    document.body.appendChild(a);
                    a.click();
                }else{
                    alert("You can not export to excel.");
                }
            })
        }
        $scope.onGetDataList =function(inData) {
            $http.post('/api/assessments/filter-data', inData).success(function (data, status, headers, config) {
                var list = []
                angular.forEach(data.response, function(value){
                    list.push({id: value.id, topic_id: value.topic_id, key_field_id: value.key_field_id, state_id : value.state_id, assessment_text:value.assessment_text})
                })
                $scope.systemAssessments = list
                let dataSet = list
                $scope.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('data', dataSet)
                    .withOption('createdRow', createdRow)
                    .withOption('responsive', true)
                    .withBootstrap()

                $scope.dtColumns = [
                    // DTColumnBuilder.newColumn('id').withTitle('ID'),
                    DTColumnBuilder.newColumn('topic_id').withTitle('Topic').withClass("topic_class"),
					DTColumnBuilder.newColumn('key_field_id').withTitle('Key Field').withClass("key_class"),
					DTColumnBuilder.newColumn('state_id').withTitle('State ').withClass("state_class"),
					DTColumnBuilder.newColumn('assessment_text').withTitle('Assessment'),
                    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                        .renderWith(actionsHtml)
                ]
                $scope.displayTable = true
            })
        }
        $scope.convert = function (str) {
            var date = new Date(str),
                mnth = ("0" + (date.getMonth()+1)).slice(-2),
                day  = ("0" + date.getDate()).slice(-2)
            return [ date.getFullYear(), mnth, day ].join("-")
            // var d = new Date(date),
            //     month = '' + (d.getMonth() + 1),
            //     day = '' + d.getDate(),
            //     year = d.getFullYear();
            //
            // if (month.length < 2) month = '0' + month;
            // if (day.length < 2) day = '0' + day;
            //
            // return [year, month, day].join('-');
        }

    }
    delete(assessmentId) {
        let API = this.API
        let $state = this.$state

        swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this data!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            html: false
        }, function () {
            API.one('assessments').one('assessment', assessmentId).remove()
                .then(() => {
                    swal({
                        title: 'Deleted!',
                        text: 'Quarterly assessment has been deleted.',
                        type: 'success',
                        confirmButtonText: 'OK',
                        closeOnConfirm: true
                    }, function () {
                        $state.reload()
                    })
                })
        })
    }
    $onInit(){
    }
}

export const AssessmentComponent = {
    templateUrl: './views/app/components/assessment/assessment.component.html',
    controller: AssessmentController,
    controllerAs: 'vm',
    bindings: {}
}
