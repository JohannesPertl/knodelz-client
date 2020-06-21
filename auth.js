$(function () {

    $(document).on("click", "#createButton", function () {
        var username = $("#username");
        var password = $("#password");

        $.ajax({
            type: 'post',
            url: 'http://localhost:8080/api/user',
            data: {name: username.val(), password: password.val()},
            dataType: "json",
            xhrFields: {
                withCredentials: false
            },
            headers: {},
            success: function (data) {
                $.ajax({
                    type: 'post',
                    url: 'http://localhost:8080/api/login',
                    data: {name: username.val(), password: password.val()},
                    dataType: "json",
                    xhrFields: {
                        withCredentials: false
                    },
                    headers: {},
                    success: function (data) {
                        console.log("Successful");
                        localStorage.setItem('token', data.token)
                        location.replace("game.html")
                    },
                    error: function () {
                        alert("Nono!");
                    }
                });
            },
            error: function () {
                alert("Nono!");
            }
        });

        $(document).on("click", "#loginButton", function () {
            $.ajax({
                type: 'post',
                url: 'http://localhost:8080/api/login',
                data: {name: username.val(), password: password.val()},
                dataType: "json",
                xhrFields: {
                    withCredentials: false
                },
                headers: {},
                success: function (data) {
                    console.log("Successful");
                    location.replace("game.html")
                },
                error: function () {
                    alert("Nono!");
                }
            });

        });

    });

});
