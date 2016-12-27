'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var cashflowCtrlStub = {
  index: 'cashflowCtrl.index',
  show: 'cashflowCtrl.show',
  create: 'cashflowCtrl.create',
  upsert: 'cashflowCtrl.upsert',
  patch: 'cashflowCtrl.patch',
  destroy: 'cashflowCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cashflowIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './cashflow.controller': cashflowCtrlStub
});

describe('Cashflow API Router:', function() {
  it('should return an express router instance', function() {
    expect(cashflowIndex).to.equal(routerStub);
  });

  describe('GET /api/cashflows', function() {
    it('should route to cashflow.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'cashflowCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/cashflows/:id', function() {
    it('should route to cashflow.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'cashflowCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/cashflows', function() {
    it('should route to cashflow.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'cashflowCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/cashflows/:id', function() {
    it('should route to cashflow.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'cashflowCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/cashflows/:id', function() {
    it('should route to cashflow.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'cashflowCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/cashflows/:id', function() {
    it('should route to cashflow.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'cashflowCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
