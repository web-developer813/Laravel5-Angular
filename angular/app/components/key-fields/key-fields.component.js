class KeyFieldsController{
    constructor($scope, $state, $compile, DTOptionsBuilder, DTColumnBuilder, API) {
        'ngInject'
        this.API = API
        this.$state = $state
        let KeyFields = this.API.service('keyFields')

        KeyFields.getList()
            .then((response) => {
                let dataSet = response.plain()

                this.dtOptions = DTOptionsBuilder.newOptions()
                    .withOption('data', dataSet)
                    .withOption('createdRow', createdRow)
                    .withOption('responsive', true)
                    .withBootstrap()

                this.dtColumns = [
                    DTColumnBuilder.newColumn('id').withTitle('ID'),
                    DTColumnBuilder.newColumn('key_field_label').withTitle('Key Field Label'),
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
                    <a class="btn btn-xs btn-warning" ui-sref="app.keyfieldedit({keyFieldId: ${data.id}})">
                        <i class="fa fa-edit"></i>
                    </a>
                    &nbsp
                    <button class="btn btn-xs btn-danger" ng-click="vm.delete(${data.id})">
                        <i class="fa fa-trash-o" style="width:12.02px"></i>
                    </button>`
            }
    }
    delete(keyFieldId) {
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
            API.one('keyFields').one('keyfield', keyFieldId).remove()
                .then(() => {
                    swal({
                        title: 'Deleted!',
                        text: 'Key field has been deleted.',
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

export const KeyFieldsComponent = {
    templateUrl: './views/app/components/key-fields/key-fields.component.html',
    controller: KeyFieldsController,
    controllerAs: 'vm',
    bindings: {}
}
