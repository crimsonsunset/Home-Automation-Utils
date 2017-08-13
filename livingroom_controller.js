angular
    .module('app.widgets')
    .controller('MyWidgetCtrl', testCtrl);

testCtrl.$inject = ['$scope', 'OHService'];
function testCtrl($scope, OHService) {
    var vm = this;
    vm.myvalue = "testing123";

    OHService.onUpdate($scope, 'Yamaha_Input', function () {
        var item = OHService.getItem('Yamaha_Input');
        if (item) {
            vm.myitem = item.state;
        }
    });

}