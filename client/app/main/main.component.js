import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.rows = [{},{},{},{},{},{},{},{},{},{},{},{}];

    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('thing');
    // });
  }

  querySearch(query,type) {
    return this.$http.get('/api/'+type+'/search/'+query)
      .then(response=>{
        console.log(response.data);
        return response.data;
      });
  }
}

export default angular.module('cmsApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController,
    controllerAs: 'vm'
  })
  .name;
