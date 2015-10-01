Pipeline = function () {
  this.cbStack= [];

  this._next = function (data) {
    this._started = true;
    if (this.cbStack.length) {
      var cb = this.cbStack.shift(),
          res = cb.call(this, data, this._next.bind(this));

      if (res) {
        this.data = res;
        this._next(res);
      }
    }
  };
  
  this.res = function (cb) {
    this.cbStack.push(cb);
    if (!this._started) {
      this._next(this.data);
    }

    return this;
  };

  this.pipe = function (cb) {
    return this.res(cb);
  };

  this.store = {
    get: function (name, del) {
      var ret = this._store[name];

      if (del) {
        this._store[name] = null;
      }

      return ret;
    },

    set: function (name, data) {
      this._store[name] = data;
    },

    _store: {}
  };
};

// Pipeline.get('./path').res(function (res) {
//   return res.data;
// }).pipe(function (data) {
//   return makeantoher.thing;
// }).return();
