/**
 * AttrEactive Admin
 */
/* global afterEach beforeEach describe it jest pit xdescribe xit */
/* global expect */

jest.autoMockOff();

var RestStorage = require("../RestStorage");
var $ = require("jquery");

function goodAjax(data) {
  $.ajax.mockReturnValue({
    then: function(good) {
      return good(data);
    }
  });
}

describe('RestStorage', function() {
  beforeEach(function() {
    $.ajax = jest.genMockFn();
  });

  describe('readAll', function() {
    it('should get all resource items', function() {
      var storage = new RestStorage('/users');

      goodAjax([{username: 'admin'}]);

      var result;
      storage.readAll().then(function(r) { result = r; });

      expect($.ajax).toBeCalledWith({
        url: '/users',
        type: 'GET',
        dataType: 'json'
      });

      expect(result).toEqual([{username: 'admin'}]);
    });

    it('should work with query', function() {
      var storage = new RestStorage('/users');

      storage.readAll({page: 1});

      expect($.ajax).toBeCalledWith({
        url: '/users?page=1',
        type: 'GET',
        dataType: 'json'
      });
    });
  });

  describe('readOne', function() {
    it('should get one resource item', function() {
      var storage = new RestStorage('/users');

      goodAjax({username: 'admin'});

      var result;
      storage.readOne(1).then(function(r) { result = r; });

      expect($.ajax).toBeCalledWith({
        url: '/users/1',
        type: 'GET',
        dataType: 'json'
      });

      expect(result).toEqual({username: 'admin'});
    });

    it('should work with query', function() {
      var storage = new RestStorage('/users');

      storage.readOne(1, {_fields: 'all'});

      expect($.ajax).toBeCalledWith({
        url: '/users/1?_fields=all',
        type: 'GET',
        dataType: 'json'
      });
    });
  });

  describe('create', function() {
    it('should get one resource item', function() {
      var storage = new RestStorage('/users');

      goodAjax();

      storage.create(null, null);

      expect($.ajax).toBeCalledWith({
        url: '/users',
        type: 'POST',
        dataType: 'json',
        data: null
      });
    });

    it('should work with query', function() {
      var storage = new RestStorage('/users');

      storage.create({soft: '1'});

      expect($.ajax).toBeCalledWith({
        url: '/users?soft=1',
        type: 'POST',
        dataType: 'json',
        data: null
      });
    });

    it('should work with query and data', function() {
      var storage = new RestStorage('/users');

      storage.create({soft: '1'}, {sure: 1});

      expect($.ajax).toBeCalledWith({
        url: '/users?soft=1',
        type: 'POST',
        dataType: 'json',
        data: {sure: 1}
      });
    });
  });

  describe('update', function() {
    it('should get one resource item', function() {
      var storage = new RestStorage('/users');

      goodAjax();

      storage.update(1, null, null);

      expect($.ajax).toBeCalledWith({
        url: '/users/1?_method=PUT',
        type: 'POST',
        dataType: 'json',
        data: null
      });
    });

    it('should work with query', function() {
      var storage = new RestStorage('/users');

      storage.update(1, {soft: '1'});

      expect($.ajax).toBeCalledWith({
        url: '/users/1?soft=1&_method=PUT',
        type: 'POST',
        dataType: 'json',
        data: null
      });
    });

    it('should work with query and data', function() {
      var storage = new RestStorage('/users');

      storage.update(1, {soft: '1'}, {sure: 1});

      expect($.ajax).toBeCalledWith({
        url: '/users/1?soft=1&_method=PUT',
        type: 'POST',
        dataType: 'json',
        data: {sure: 1}
      });
    });
  });

  describe('delete', function() {
    it('should get one resource item', function() {
      var storage = new RestStorage('/users');

      goodAjax();

      storage.delete(1);

      expect($.ajax).toBeCalledWith({
        url: '/users/1?_method=DELETE',
        type: 'POST',
        dataType: 'json',
        data: null
      });
    });

    it('should work with query', function() {
      var storage = new RestStorage('/users');

      storage.delete(1, {soft: '1'});

      expect($.ajax).toBeCalledWith({
        url: '/users/1?soft=1&_method=DELETE',
        type: 'POST',
        dataType: 'json',
        data: null
      });
    });

    it('should work with query and data', function() {
      var storage = new RestStorage('/users');

      storage.delete(1, {soft: '1'}, {sure: 1});

      expect($.ajax).toBeCalledWith({
        url: '/users/1?soft=1&_method=DELETE',
        type: 'POST',
        dataType: 'json',
        data: {sure: 1}
      });
    });
  });
});
