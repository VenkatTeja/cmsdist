'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './add.routes';

export class AddComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.user = {userCode:null};
    this.searchText = null;
  }

  add(type, form){
    this.loading = true;
    this.$http.post('/api/'+type,{data:this.user})
      .then(response=>{
        this.user = {};
        form.$setPristine();
        form.$setUntouched();
        this.loading = false;
      })
      .catch(err=>{
        alert('Something went wrong, Please try again.');
        this.loading = false;
      })
  }

  edit(user, type){
    this.loading = true;
    this.$http.put('/api/'+type+'/'+user._id,{data:user})
      .then(response=>{
        this.loading = false;
      })
      .catch(err=>{
        alert('Something went wrong, Please try again.');
        this.loading = false;
      })
  }

  querySearch(query,type) {
    console.log('ss');
    return this.$http.get('/api/'+type+'/search/'+query)
      .then(response=>{
        console.log(response.data);
        return response.data;
      });
  }
}

export default angular.module('cmsApp.add', [uiRouter])
  .config(routes)
  .component('add', {
    template: require('./add.html'),
    controller: AddComponent,
    controllerAs: 'vm'
  })
  .name;
