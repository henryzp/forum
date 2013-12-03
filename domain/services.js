var check = require('validator').check
    , huskies = require("huskies")
    , lock = require("huskies-lock")
    , step = require("step");


module.exports = function (findUser) {


    function wrap(my) {

        service1.serviceName = "existColumn";

        function service1(columnId, callback) {
            my.repos.Column.get(columnId, function (err, col) {
                if (col) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        }


        service2.serviceName = "existPost";

        function service2(postId, callback) {
            my.repos.SubPost.get(postId, function (err, post) {
                if (col) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        }

        service3.serviceName = "updateColumnValidator";

        function service3(name, des) {

            if (name === name.trim() && des === des.trim()) {
                check(name).len(5, 15);
                check(des).len(0, 200);
            } else {
                throw new Error();
            }
        }

        service4.serviceName = "updatePasswordValidator";

        function service4(password) {
            if (password === password.trim()) {
                check(password).len(6, 18);
            } else {
                throw new Error();
            }
        }


        // userInfo{loginname , nickname , email}
        // return err or null , if err mean not unique.
        var service5 = huskies(function (userInfo, callback) {

            step(
                function () {
                    findUser({loginname: userInfo.loginname}, this)
                },
                function (have) {
                    if (have) throw new Error("loginname not unique");
                    findUser({nickname: userInfo.nickname}, this);
                },
                function (have) {
                    if (have) throw new Error("nickname not unique");
                    findUser({nickname: userInfo.email}, this);
                },
                function (have) {
                    if (have) throw new Error("email not unique");
                    return null;
                },
                function (err) {
                    callback(err);
                }
            )
        }).use(lock);
        service5.serviceName = "userUnique";

        return [service1, service2, service3, service4, service5];

    }

    return wrap;

}