'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class VtRadioComponent {

  // Input() project:Object;

  constructor() {
    'ngInject';
  }

}

export default angular.module('directives.vtRadio', [])
  .component('vtRadio', {
    template: require('./vtRadio.html'),
    bindings:{object:'=', form:'=', label:'@', model:'@', options:'=', diffValue:'='},
    controller: VtRadioComponent

  })
  .name;
