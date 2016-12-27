'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class VtInputComponent {

  // Input() project:Object;

  constructor() {
    'ngInject';
  }

}

export default angular.module('directives.vtInput', [])
  .component('vtInput', {
    template: require('./vtInput.html'),
    bindings:{object:'=', form:'=', label:'@', model:'@', 
              required:'=', pattern:'@', min:'@', max:'@',
              minLength:'@', maxLength:'@', },
    controller: VtInputComponent

  })
  .name;
