class CaptureAddController{
    constructor($stateParams, $state, API,$scope) {
        'ngInject'
        this.$state = $state
        this.$scope = $scope
        this.formSubmitted = false
        this.alerts = []
        this.API = API
        let Topics = API.service('topics')
        let KeyFields = API.service('keyFields')
        let States = API.service('states')
        let Partners = API.service('partners')

        if ($stateParams.alerts) {
            this.alerts.push($stateParams.alerts)
        }
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
                let topicResponse = response.plain()

                angular.forEach(topicResponse, function (value) {
                    topicList.push({id: value.id,  label:value.topic_label , name: value.topic_label,})
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

        $scope.vm.topicSelected = []
        $scope.vm.keySelected = []
        $scope.vm.stateSelected = []
        $scope.vm.partnerSelected = []
       /*******multiple selected ********/
       $scope.dropdownSetting ={
           scrollable : true,
           scrollableHeight: '200px'
       }
       $scope.topicsSelected = []

        $scope.today = function() {
            $scope.dt = new Date()
        }
        $scope.today()

        $scope.clear = function() {
            $scope.dt = null
        }

        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        }

        $scope.dateOptions = {
            formatYear: 'yyyy',
            minDate: new Date(),
            startingDay: 1
        }

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6)
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
        $scope.convert = function (str) {
            var date = new Date(str),
                mnth = ("0" + (date.getMonth()+1)).slice(-2),
                day  = ("0" + date.getDate()).slice(-2)
            return [ date.getFullYear(), mnth, day ].join("-")
            // var mm = date.getMonth() + 1
            // var dd = date.getDate()
            // var yyyy = date.getFullYear()
            // var return_date = mm + '/' + dd + '/' + yyyy
            // return return_date
        }
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
    }
    save(isValid, type) {
        this.$state.go(this.$state.current, {}, {alerts: 'test'})
        if (isValid) {
            let Datas = this.API.service('data', this.API.all('datas'))
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

            for(var i =0; i< this.partnerSelected.length; i++){
                partners.push(this.partnerSelected[i].id)
            }
            // Datas.post({
            //     'topic_id': this.topic_id,
            //     'key_field_id' : this .key_field_id,
            //     'state_id' : this.state_id,
            //     'partner_id' : this.partner_id,
            //     'entry_text': this.entry_text,
            //     'date_of_action' : this.$scope.convert(this.date_of_action)
            // }).then(function () {

            Datas.post({
                'topic_id': topics,
                'key_field_id' : keys,
                'state_id' : states,
                'partner_id' : partners,
                'entry_text': this.entry_text,
                'date_of_action' : this.$scope.convert(this.date_of_action)
            }).then(function () {
                let alert = { type: 'success', 'title': 'Success!', msg: 'Data capture has been added.' }
                if(type == "save"){
                    $state.go("app.datas")
                }else{
                    $state.go($state.current, {alerts: alert})
                }

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

export const CaptureAddComponent = {
    templateUrl: './views/app/components/capture-add/capture-add.component.html',
    controller: CaptureAddController,
    controllerAs: 'vm',
    bindings: {}
}
