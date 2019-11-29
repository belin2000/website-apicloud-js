var config = {
    //,ajax接口方式[支持jquery,vue,apicloud]（即将启用）
    plusname: 'apicloud',
    //普通情况不需要设置，多站点公用请求连接或者apicloud情况下需要设置
    domain: '',
    //例如：a.abc.com (域名) //这个标志用户使用cookies的保存的域名，如果为null，就是本域名
    cookiedomain: null,
    //支持h5,app(如果是apicloud,必须是app)
    ntype: 'app',
    //web仅仅支持cookies,h5支持cookies/localstroge/sessionstorage/indexeddb/websql (如果是apicloud,必须是apifile/apidb)
    logintype: 'apidb'
}