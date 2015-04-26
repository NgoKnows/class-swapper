angular.module('requestCtrl', ['userService', 'requestService'])


.controller('requestController', function (User, Request) {
    var vm = this;

    vm.processing = true;

    Request.all()
        .success(function (data) {
            vm.processing = false;

            vm.requests = data;
        });
    vm.deleteRequest = function(requestId){
        Request.delete(requestId);
    };
})

.controller('requestCreateController', function (User, Request, Auth) {
    var vm = this;
    vm.requestData = {};

    //gets current username to attach to request add
    vm.createRequest = function () {
        vm.processing = true;
        Request.add(vm.requestData)
            .success(function(data){
                vm.processing = false;
                vm.message = data.message;
                if(data.success) vm.requestData = {};
        })
    };
});
