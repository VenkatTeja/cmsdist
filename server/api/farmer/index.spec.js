'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var farmerCtrlStub = {
  index: 'farmerCtrl.index',
  show: 'farmerCtrl.show',
  create: 'farmerCtrl.create',
  upsert: 'farmerCtrl.upsert',
  patch: 'farmerCtrl.patch',
  destroy: 'farmerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var farmerIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './farmer.controller': farmerCtrlStub
});

describe('Farmer API Router:', function() {
  it('should return an express router instance', function() {
    expect(farmerIndex).to.equal(routerStub);
  });

  describe('GET /api/farmers', function() {
    it('should route to farmer.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'farmerCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/farmers/:id', function() {
    it('should route to farmer.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'farmerCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/farmers', function() {
    it('should route to farmer.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'farmerCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/farmers/:id', function() {
    it('should route to farmer.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'farmerCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/farmers/:id', function() {
    it('should route to farmer.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'farmerCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/farmers/:id', function() {
    it('should route to farmer.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'farmerCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
