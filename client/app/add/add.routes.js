'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('add', {
      url: '/add',
      template: '<add></add>'
    });
}
