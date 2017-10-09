class UserListsController {
    constructor($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
        'ngInject'
        this.API = API
        this.$state = $state

        let Users = this.API.service('users')

        Users.getList()
            .then((response) => {
                let dataSet = response.plain()

                this.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('data', dataSet)
                    .withOption('createdRow', createdRow)
                    .withOption('responsive', true)
                    .withBootstrap()

                this.dtColumns = [
                    DTColumnBuilder.newColumn('id').withTitle('ID'),
                    DTColumnBuilder.newColumn('email').withTitle('Email'),
                    DTColumnBuilder.newColumn('first_name').withTitle('First Name'),
                    DTColumnBuilder.newColumn('last_name').withTitle('Last Name'),
                    DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                        .renderWith(actionsHtml)
                ]

                this.displayTable = true
            })

        let createdRow = (row) => {
            $compile(angular.element(row).contents())($scope)
        }

        let actionsHtml = (data) => {
            return `
                <a class="btn btn-xs btn-warning" ui-sref="app.useredit({userId: ${data.id}})">
                    <i class="fa fa-edit"></i>
                </a>
                <button class="btn btn-xs btn-primary" ng-show="${data.status}" ng-click="vm.active(${data.id})">
                    <i class="fa fa-check-circle-o"></i>
                </button>
                <button class="btn btn-xs btn-danger" ng-hide="${data.status}" ng-click="vm.active(${data.id})">
                    <i class="fa fa-times-circle"></i>
                </button>
                <button class="btn btn-xs btn-danger" ng-click="vm.delete(${data.id})">
                    <i class="fa fa-trash-o" style="width:12.02px"></i>
                </button>`

        }
    }
    active(userId){
        let API = this.API
        let $state = this.$state
        swal({
            title: 'Are you sure?',
            text: 'This user status will be change!',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: 'rgb(134, 204, 235)',
            confirmButtonText: 'Yes',
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            html: false
        }, function () {
            let Users = API.service('user-status', API.all('users'))
            Users.post({
                'user_id': userId
            }).then(function () {
                swal({
                    title: 'Changed!',
                    text: 'User status has been changed.',
                    type: 'success',
                    confirmButtonText: 'OK',
                    closeOnConfirm: true
                }, function () {
                    $state.reload()
                })
            })

        })
    }

    delete(userId) {
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
            API.one('users').one('user', userId).remove()
                .then(() => {
                    swal({
                        title: 'Deleted!',
                        text: 'User Permission has been deleted.',
                        type: 'success',
                        confirmButtonText: 'OK',
                        closeOnConfirm: true
                    }, function () {
                        $state.reload()
                    })
                })
        })
    }

    $onInit() {
    }
}

export const UserListsComponent = {
    templateUrl: './views/app/components/user-lists/user-lists.component.html',
    controller: UserListsController,
    controllerAs: 'vm',
    bindings: {}
}
