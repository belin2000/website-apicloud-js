/** strong.js(本地存储)-v1.0.3 MIT License By http://www.DDLev.com */
/*  by 2019-11-28 
    新增websql和indexedDB存储方式
    新增错误提示的返回
    优化的代码
*/
/*
    var sto=new Strongs(); // 或者new Strongs("websql"); 参数为空时，默认参数是cookies;如果需要cookies的，需要先引用cookies的js. 
    websql可以是 cookies，localstroge，sessionstorage，indexeddb，websql，(apicloud支持下面两种) apifile和apidb
    sto方法返回的都是异步
    sto.set("abc","111",function(){console.log('正确时候要做的')},function(err){console.log('错误时候要做的')}) //设置abc的值是111
    sto.get("abc",function(val){  },function(err){})；//val就是111
    sto.delete("abc",function(){},function(err){});//删除
    sto.setlist([["abc","111"],["abc1","1111"]],function(){console.log('正确时候要做的')},function(err){console.log('错误时候要做的')}) //设置abc的值是111,abc1的值是1111
    sto.getlist(["abc","abc1"],function(val){},function(err){}); val是一个数组：[["abc","111"],["abc1","1111"]]
    sto.deletelist(["abc","abc1"],function(){},function(err){});//批量删除
*/
function Strongs(_apptype) {
    var _this = this;
    this.apptype = "cookies";
    if (_apptype) {
        _this.apptype = _apptype;
    } else {
        try {
            _this.apptype = config?( config.logintype || "cookies"):"cookies";
        } catch (e) {

        }
    }
    this.co = null;
    //设置用户信息，完成后使用fn()执行后续操作
    this.set = function (key, data, fn, failfn) {
        var ls = getstrongtype();
        ls.set(key, data, fn, failfn);
    };
    //批量设置 :keydata=[[key1,data1],[key2,data2]]
    this.setlist = function (keydata, fn, failfn) {
        //console.log(keydata.length);
        var account = 0;
        var ls = getstrongtype();
        if (ls.setlist) {
            ls.setlist(keydata, fn);
        }
        else
        {
            for (var i = 0; i < keydata.length; i++) {
                var key = keydata[i][0];
                var data = keydata[i][1];
                ls.set(key, data, function () {
                    account++;
                    if (account == keydata.length) {
                        if (fn) { fn() }
                    };
                });

            }
        }

    };

    //获取用户信息，完成后使用fn(str)执行后续操作 ,str是获取的字符串
    this.get = function (key, fn, failfn) {
        var ls = getstrongtype();
        ls.get(key, fn, failfn);
    };
        // 批量获取 : key = [key, key2]
    this.getlist = function (keylist, fn, failfn) {
        var aclist =[];
        var ls = getstrongtype();
        if (ls.getlist) {
            ls.getlist(keylist, fn, failfn);
        }
        else {
            for (var i = 0; i < keylist.length; i++) {
                var key = keylist[i];
                ls.get(key, function (val) {
                    aclist.push([key, val]);
                    if (aclist.length == keylist.length) { if (fn) { fn(aclist) } };
                });

            }
        }

    };

        //设置用户退出
    this.delete = function (key, fn, failfn) {
        var ls = getstrongtype();
        ls.delete(key, fn, failfn);
    };
    //批量删除 :key=[key,key2]
    this.deletelist = function (keylist, fn, failfn) {
        var account = 0;
        var ls = getstrongtype();
        if (ls.deletelist) {
            ls.deletelist(keylist, fn);
        }
        else {
            for (var i = 0; i < keylist.length; i++) {
                var key = keylist[i];
                ls.delete(key, function () {
                    account++;
                    if (account == keylist.length) { if (fn) { fn() } };
                });

            }
        }

    };

    var getstrongtype = function () {
        var ls;
        switch (_this.apptype) {
            case "cookies":
                ls = new cookies();
                break;
            case "localstroge":
                ls = new localstroge();
                break;
            case "sessionstorage":
                ls = new sessionstorage();
                break;
            case "apifile":
                ls = new apifile();
                break;
            case "apidb":
                ls = new apidb();
                break;
            case "indexeddb":
                ls = new IndexedDB();
                break;
            case "websql":
                ls = new WebSQL();
        }
        return ls;
    };


    var cookies = function () {
        if (!_this.co) _this.co = cookie;
        this.set = function (key, val, fn) {
            //console.log(_this);
            var mi = 7 * 24 * 60;
            var domain = config.cookiedomain|| (window.location.host.split(':')[0] || null); //如果域名不存在，获取当前域名
             //console.log(domain)
            try {
                //var date = new Date();
                //date.setMinutes(date.getMinutes() + mi);
                //console.log(date)
                _this.co.set(key, val, domain);
                //console.log(fn);
                if (fn) { fn() };
            } catch (e) {
                console.log(e);
                return false;
            }
        };
        this.get = function(key, fn) {
            try {
                var val = _this.co.get(key);
                fn(val);
            } catch (e) {}
        };
        this.delete = function(key, fn) {
            _this.co.delete(key);
            fn();
        };
    };

    //本地缓存(h5，本地存储)
    var localstroge = function () {
        var init = function () {
            if (!localStorage) {
                if (failfn) { failfn("不支持localStorage"); }
            }
        };
        this.set = function (key, val, fn, failfn) { init(); localStorage.setItem(key, val); if (fn) { fn() } };
        this.get = function (key, fn, failfn) { init(); var v = localStorage.getItem(key); if (fn) { fn(v) } };
        this.delete = function (key, fn, failfn) { init(); localStorage.removeItem(key); if (fn) { fn() } };
    };
    //本地缓存(h5，浏览器存储)
    var sessionstorage = function () {
        var init = function () {
            if (!sessionStorage) {
                if (failfn) { failfn("不支持sessionStorage"); }
            }
        };
        this.set = function (key, val, fn, failfn) { init(); sessionStorage.setItem(key, val); if (fn) { fn() } };
        this.get = function (key, fn, failfn) { init(); var v = sessionStorage.getItem(key); if (fn) { fn(v) } };
        this.delete = function (key, fn, failfn) { init(); sessionStorage.removeItem(key); if (fn) { fn() } };
    };

    ///apicloud下的文件存储
    var apifile = function() {
        var fs = api.require('fs');
        var init = function (key, fn, failfn) {
            fs.exist({
                    path: 'box://' + key + '.txt'
                },
                function(ret, err) {
                    if (!ret.exist) {
                        fs.createFile({
                            path: 'box://' + key + '.txt'
                        }, function() {
                            if (fn) { fn() }
                        })
                    } else {
                        if (fn) { fn() }
                    }
                }
            );
        };

        this.get = function (key, fn, failfn) {
            init(key, function() {
                fs.open({
                    path: 'box://' + key + '.txt',
                    flags: 'read_write'
                }, function(ret, err) {
                    var v = "";
                    if (ret.fd) {
                        fs.read({
                            fd: ret.fd
                        }, function(ret1, err1) {

                            if (ret1.status) {
                                v = ret1.data;
                            }
                            if (fn) { fn(v) }
                        })
                    } else {
                        if (fn) { fn(v) }
                    }

                })
            })
        };

        this.set = function (key, val, fn, failfn) {
            init(key, function() {
                fs.open({
                    path: 'box://' + key + '.txt',
                    flags: 'read_write'
                }, function(ret, err) {
                    if (ret.fd) {
                        fs.write({
                            fd: ret.fd,
                            data: val
                        }, function(ret1, err1) {
                            if (ret1.status) {
                                console.log(JSON.stringify(ret1));
                            } else {
                                console.log(JSON.stringify(err1));
                            }
                            if (fn) { fn() }
                        })
                    } else {
                        if (fn) { fn() }
                    }

                })
            })
        };

        this.delete = function (key, fn, failfn) {
            fs.remove({
                path: 'box://' + key + '.txt'
            }, function(ret, err) {
                if (fn) { fn() }
            })
        };

    };

    ///apicloud下的数据库存储
    var apidb = function() {
        var db = api.require('db'); //使用数据库，存储在box里面
        var init = function (fn, failfn) {
            if (!db) {
                if (failfn) { failfn('不支持的db操作') }
            }
            var _isdbopen = api.getGlobalData({
                key: '_isdbopen'
            });
            if (!_isdbopen) {
                var ret = db.openDatabaseSync({
                    name: 'userdb',
                    path: 'box://db/userdb.db'
                });
                if (ret.status) {
                    var ret1 = db.selectSqlSync({
                        name: 'userdb',
                        sql: 'SELECT * FROM userinfo'
                    });
                    if (!ret1.status) {
                        var ret2 = db.executeSqlSync({
                            name: 'userdb',
                            sql: 'CREATE TABLE userinfo (key varchar(255), val varchar(1024))'
                        });
                    }
                };
                fn();
            } else {
                fn();
            }
        };
        this.set = function (key, val, fn, failfn) {
            init(function() {
                db.executeSqlSync({
                    name: 'userdb',
                    sql: "delete from userinfo where key='" + key + "'"
                });
                db.executeSqlSync({
                    name: 'userdb',
                    sql: "insert into userinfo (key,val) values( '" + key + "','" + val + "')"
                });
                if (fn) { fn() };
            })
        };
        this.get = function (key, fn, failfn) {
            init(function() {
                var ret = db.selectSqlSync({
                    name: 'userdb',
                    sql: "SELECT val FROM userinfo where key='" + key + "'"
                });
                if (ret.status && ret.data.length > 0) {
                    if (fn) { fn(ret.data[0].val) }
                } else {
                    if (fn) { fn("") };
                };
            });
        };
        this.getlist = function (keylist, fn, failfn) {
            var aclist = [];
            var sql = "SELECT * FROM userinfo where key in ('" + keylist.join("','") + "')";
            init(function () {
                var ret = db.selectSqlSync({
                    name: 'userdb',
                    sql: sql
                });
                if (ret.status) {
                    if (ret.data.length > 0) {
                        for (var i = 0; i < ret.data.length; i++) {
                            aclist.push([ret.data[i]["key"], ret.data[i]["val"]]);
                        }
                    }
                    if (keylist.length > aclist.length) {
                        var a = [];
                        for (var i = 0; i < aclist.length; i++) {
                            a.push(aclist[i][0]);
                        };
                        var c1 = keylist.filter(function (key) { return !a.includes(key); });
                        for (var i = 0; i < c1.length; i++) {
                            aclist.push(new Array(c1[i], ""));
                        };
                    };
                    if (fn) { fn(aclist); };
                }
                else {
                    console.log("错误");
                    if (failfn) { failfn("错误"); };
                }
            });
        };
        this.delete = function (key, fn, failfn) {
            init(function() {
                var ret = db.executeSqlSync({
                    name: 'userdb',
                    sql: "Delete FROM userinfo where key='"+key+"'"
                });
                if (fn) { fn() };
            })
        };
        this.deletelist = function (keylist, fn, failfn) {
            init(function () {
                var ret = db.executeSqlSync({
                    name: 'userdb',
                    sql: "Delete FROM userinfo where key in ('" + keylist.join("','") + "')"
                });
                if (fn) { fn() };
            })
        };
    };

    ///IndexedDB h5下的数据库存储
    var IndexedDB = function (dbname, tablename) {
        var _this = this;
        this.db = null;
        this.dbhelper = null;
        dbname = dbname || "Datas";
        tablename = tablename || "LoginData";
        this.set = function (key, val, fn, failfn) {
            init(function () {
                //console.log(_this.dbhelper);
                var transaction = _this.dbhelper.transaction(tablename, 'readwrite');
                var store = transaction.objectStore(tablename);
                //console.log(store);
                var request = store.put({ key: key, val: val });
                request.onsuccess = function (e) { console.log('数据修改成功'); if (fn) { fn(); } };
                request.onerror = function (e) {
                    if (failfn) {failfn('数据修改失败')};
                    console.log('数据修改失败');
                    console.log(e);
                };
            }, failfn);
            
        };
        this.get = function (key, fn, failfn) {
            //console.log("get1");
            init(function () {
                var transaction = _this.dbhelper.transaction(tablename, 'readwrite');
                var store =transaction.objectStore(tablename);
                var request = store.get(key);
                request.onsuccess = function (e) {
                    var data = e.target.result? e.target.result.val:"";
                    //console.log(data);
                    if (fn) { fn(data); }
                };
                request.onerror = function () {
                    if (fn) { fn(""); }
                };
            }, failfn);
            
        };
        this.delete = function (key, fn, failfn) {
            init(function () {
                var transaction = _this.dbhelper.transaction(tablename, 'readwrite');
                var store =transaction.objectStore(tablename);
                var request = store.delete(key);
                request.onsuccess = function (e) {
                    if (fn) { fn(); }
                };
                request.onerror = function (e) { if (failfn) { failfn('删除失败') } };
            }, failfn);
            
        };
        this.setlist = function (keydata, fn, failfn) {
            var account = 0;
            init(function () {
                //console.log("使用list添加");
                var transaction = _this.dbhelper.transaction(tablename, 'readwrite');
                var store = transaction.objectStore(tablename);
                for (var i = 0; i < keydata.length; i++) {
                    var key = keydata[i][0];
                    var val = keydata[i][1];
                    var request = store.put({ key: key, val: val });
                    request.onsuccess = function (e) {
                        account++;
                        if (account == keydata.length) {
                            if (fn) { fn() }
                        };
                    };
                    request.onerror = function (e) {
                        console.log('数据添加失败');
                    };
                }
                
            }, failfn);
        };
        this.getlist = function (keylist, fn, failfn) {
            var aclist = [];
            init(function () {
                //console.log("使用list获取");
                var transaction = _this.dbhelper.transaction(tablename, 'readwrite');
                var store = transaction.objectStore(tablename);
                for (var i = 0; i < keylist.length; i++) {
                    var key = keylist[i];
                    var request = store.get(key);
                    request.onsuccess = function (e) {
                        var data = e.target.result ? e.target.result : "";
                        aclist.push([data.key, data.val]);
                        if (aclist.length == keylist.length) { if (fn) { fn(aclist) } };
                    };
                    request.onerror = function (e) {
                        console.log('数据获取失败');
                    };
                }

            }, failfn)
        };
        this.deletelist = function (keylist, fn, failfn) {
            var account = 0;
            init(function () {
                //console.log("使用list删除");
                var transaction = _this.dbhelper.transaction(tablename, 'readwrite');
                var store = transaction.objectStore(tablename);
                for (var i = 0; i < keylist.length; i++) {
                    var key = keylist[i];
                    var request = store.delete(key);
                    request.onsuccess = function (e) {
                        account++;
                        if (account == keylist.length) { if (fn) { fn() } };
                    };
                    request.onerror = function (e) {
                        console.log('数据删除失败');
                    };
                }

            }, failfn)
        };
        var init = function (fn, failfn) {
            if (!_this.db) {
                _this.db = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                if (!_this.db) {
                    console.log("你的浏览器不支持IndexedDB");
                    if (failfn) { failfn("你的浏览器不支持IndexedDB") }
                }
            }
            if (!_this.dbhelper) {
                var request = _this.db.open(dbname);
                request.onerror = function (e) {
                    console.log(e.currentTarget.error.message);
                };
                request.onsuccess = function (e) {
                    //console.log('成功打开DB');
                    //console.log(e.target.result);
                    if (!_this.dbhelper) {
                        _this.dbhelper = e.target.result;
                    }
                    if (fn) { fn(); }
                };
                request.onupgradeneeded = function (e) {
                    _this.dbhelper = e.target.result;
                    //console.log(_this.dbhelper);
                    if (!_this.dbhelper.objectStoreNames.contains(tablename)) {
                        //console.log("我需要创建一个新的存储对象");
                        var objectStore = _this.dbhelper.createObjectStore(tablename, {
                            keyPath: "key",
                            unique: true,
                            autoIncrement: false
                        });
                        objectStore.createIndex('val', 'val', { unique: false });

                    }
                }
            }
            else {
                if (fn) { fn(); }
            }
        };
        this.close = function () {
            _this.dbhelper.close();
        };
        this.deleteDB=function() {
            _this.db.deleteDatabase(name);
        };
        this.clear = function () {
            init(function () {
                var transaction = _this.dbhelper.transaction(tablename, 'readwrite');
                var store = transaction.objectStore(tablename);
                var request = store.clear();
                request.onsuccess = function (e) {
                    var data = e.target.result ? e.target.result.val : "";
                    //console.log(data);
                    if (fn) { fn(data); }
                };
                request.onerror = function () {
                    if (fn) { fn(""); }
                }
            });
        };
    };

    ///浏览器的WebSQL数据库存储
    var WebSQL = function (dbname, tablename) {
        var _this = this;
        this.db = null;
        dbname = dbname || "Datas";
        tablename = tablename || "LoginData";
        var init = function (failfn) {
            if (!_this.db) {
                if (!window.openDatabase) {
                    console.log('你的浏览器不支持WebSQL');
                }
                try {
                    _this.db = openDatabase(dbname, '1.0', 'DB', 10 * 1024 * 1024);
                    _this.db.transaction(function (dbhelper) {
                        dbhelper.executeSql('CREATE TABLE IF NOT EXISTS ' + tablename + ' (key unique, val)', [], function () {
                            console.log("建立表ok");
                        }, function () {
                            console.log("建立表失败");
                            if (failfn) { failfn('建立表失败') };
                        });
                    });
                }
                catch(e)
                {
                    console.log("你的浏览器不支持WebSQL");
                    if (failfn) { failfn("你的浏览器不支持WebSQL") }
                }
                if (!_this.db) {
                    console.log("你的浏览器不支持WebSQL");
                    if (failfn) { failfn("你的浏览器不支持WebSQL") }
                }
            }
        };
        this.set = function (key, val, fn, failfn) {
            init(failfn);
            _this.db.transaction(function (dbhelper) {
                dbhelper.executeSql(
                     "INSERT INTO " + tablename + " (key, val) VALUES (?,?)",
                     [key, val],
                     function () { if (fn) { fn()}},
                     function (e) {
                         console.log(e);
                         update(key, val, fn, failfn);
                     }
                );
            });
        };
        this.get = function (key, fn, failfn) {
            init(failfn);
            _this.db.transaction(function (dbhelper) {
                dbhelper.executeSql(
                     "SELECT * FROM " + tablename + " WHERE key=?",
                     [key],
                    function (tx, result) {
                        var val = result.rows.length>0? result.rows[0]["val"]:"";
                        //console.log(val);
                        if (fn) { fn(val) };
                    },
                     function () { console.log('websql插入数据失败'); if (failfn) { failfn('websql插入数据失败');} }
                );
            });
        };
        this.delete = function (key, fn, failfn) {
            init(failfn);
            _this.db.transaction(function (dbhelper) {
                dbhelper.executeSql(
                     "DELETE FROM " + tablename + " WHERE key=?",
                     [key],
                    function (tx, result) {
                        if (fn) { fn() };
                    },
                     function () { console.log('websql插入数据失败'); if (failfn) { failfn('websql插入数据失败') } }
                );
            });
        };
        this.getlist = function (keylist, fn, failfn) {
            var aclist = [];
            var sql = "SELECT * FROM " + tablename + " WHERE key in ('" + keylist.join("','") + "')";
            init(failfn);
            _this.db.transaction(function (dbhelper) {
                dbhelper.executeSql(sql, [], function (tx, result) {
                    //console.log(result);
                    for (var i = 0; i < result.rows.length; i++) {
                        aclist.push(new Array(result.rows[i]["key"],result.rows[i]["val"]));
                    }
                    if (keylist.length > aclist.length) {
                        var isf = true;
                        var a = [];
                        for (var i = 0; i < aclist.length; i++) {
                            a.push(aclist[i][0]);
                        };
                        var c1 = keylist.filter(function (key) { return !a.includes(key); });
                        for (var i = 0; i < c1.length; i++) {
                            aclist.push(new Array(c1[i], ""));
                        };
                    };
                    if (fn) { fn(aclist); }
                }, function () {
                    console.log('websql批量获取数据失败');
                    if (failfn) { failfn("websql批量获取数据失败"); }
                });
            });
        };
        this.deletelist = function (keylist, fn, failfn) {
            var sql = "DELETE FROM " + tablename + " WHERE key in ('" + keylist.join("','") + "')";
            //console.log(sql);
            init(failfn);
            _this.db.transaction(function (dbhelper) {
                dbhelper.executeSql(sql, [], function (tx, result) {
                    if (fn) { fn(); }
                }, function () {
                    console.log('websql批量获取数据失败');
                    if (failfn) { failfn('websql批量获取数据失败'); }
                });
            });
        };
        var update = function (key, val, fn, failfn) {
            init(failfn);
            _this.db.transaction(function (dbhelper) {
                dbhelper.executeSql(
                     'UPDATE ' + tablename + ' SET val=? where key=?',
                     [val, key],
                     function () { if (fn) { fn() } },
                     function () { console.log('websql更新数据失败'); if (failfn) { failfn('websql更新数据失败') } }
                );
            });
        };
    }
}