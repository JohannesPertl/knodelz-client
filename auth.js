server = "localhost:8080"


$(function () {

    $(document).on("click", "#createButton", function () {
        var username = $("#username");
        var password = $("#password");

        $.ajax({
            type: 'post',
            url: 'http://' + server + '/api/user',
            data: {name: username.val(), password: password.val()},
            dataType: "json",
            xhrFields: {
                withCredentials: false
            },
            headers: {},
            success: function (data) {
                $.ajax({
                    type: 'post',
                    url: 'http://' + server + '/api/login',
                    data: {name: username.val(), password: password.val()},
                    dataType: "json",
                    xhrFields: {
                        withCredentials: false
                    },
                    headers: {},
                    success: function (data) {
                        console.log("Successful");
                        localStorage.setItem('token', data.token)
                        location.replace("http://" + server + "/game.html")
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
                url: 'http://' + server + '/api/login',
                data: {name: username.val(), password: password.val()},
                dataType: "json",
                xhrFields: {
                    withCredentials: false
                },
                headers: {},
                success: function (data) {
                    console.log("Successful");
                    location.replace("http://" + server + "/game.html")
                },
                error: function () {
                    alert("Nono!");
                }
            });

        });

    });

});
