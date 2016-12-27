'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class VtSelectComponent {

  // Input() project:Object;

  constructor() {
    'ngInject';
  }

}

export default angular.module('directives.vtSelect', [])
  .component('vtSelect', {
    template: require('./vtSelect.html'),
    bindings:{object:'=', form:'=', label:'@', model:'@', options:'=', diffValue:'='},
    controller: VtSelectComponent

  })
  .name;
