var cookie = {
    set: function (key, val, domain, date) {//设置cookie方法
        domain = domain || config.cookiedomain;
        var cok = key + "=" + escape(val) + (date?(";expires=" + date):"") + (domain ? (";domain=" + domain) : "") + ";path=/";
        document.cookie = cok //设置cookie
    },
    get: function (key) {//获取cookie方法
        /*获取cookie参数*/
        var getCookie = document.cookie.replace(/[ ]/g, "");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        var tips;  //声明变量tips
        for (var i = 0; i < arrCookie.length; i++) {   //使用for循环查找cookie中的tips变量
            var arr = arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
            //console.log(key + "=" + arr[0], arr[1]);
            if (key == arr[0]) {  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                tips = unescape(arr[1]);   //将cookie的值赋给变量tips
                break;   //终止for循环遍历
            }
        }
        return tips;
    },
    delete: function (key) { //删除cookie方法
        var date = new Date(); //获取当前时间
        date.setTime(date.getTime() - 10000); //将date设置为过去的时间
        this.set(key, "", config.cookiedomain, date.toGMTString());
    },
    clear: function () {
        var date=new Date();
        date.setTime(date.getTime()-10000);
        var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                this.set(keys[i], "", config.cookiedomain, date.toGMTString());
        }
    }
}