/**
 * extended base from websocket example
 * simplified some parts and extended with API call to receive token
 * for later token authentication at sending messages
 */

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

    // Websocket
    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($("<p>", {text: "Sorry, but your browser doesn't support WebSocket."}));
        input.hide();
        $("span").hide();
        return;
    }

    // TODO don't forget to use secure connection with e.g. ssl
    // open connection
    var connection = new WebSocket("ws://127.0.0.1:8080/ws");


    // WebSocket Event open and EventHandler onOpen
    connection.onopen = function () {
        console.log("Connection to server established")
    };


    $(document).on("click", "#feedButton", function () {
        token = localStorage.getItem("token")
        var msg = {
            type: "authenticate",
            payload: {
                token: token,
                intention: "feed",
            },
        };

        connection.send(JSON.stringify(msg));
    })

    $(document).on("click", "#brushButton", function () {
        token = localStorage.getItem("token")
        var msg = {
            type: "authenticate",
            payload: {
                token: token,
                intention: "brush",
            },
        };

        connection.send(JSON.stringify(msg));
    })


    // WebSocket Event error and EventHandler onError
    connection.onerror = function (error) {
        console.log("onerror");
        // just in there were some problems with connection...
        content.html(
            $("<p>", {
                text: "Sorry, but there's some problem with your " + "connection or the server is down.",
            })
        );
    };

    // WebSocket Event message and EventHandler onMessage
    connection.onmessage = function (message) {
        console.log("onmessage");

        try {
            var json = JSON.parse(message.data);

            $("#foodValue").html(json.food)
            $("#brushValue").html(json.brushy)

            localStorage.setItem("food", json.food)
            localStorage.setItem("brushy", json.brushy)

            console.log(json)

            if (json.dead) {
                token = localStorage.getItem("token")

                var msg = {
                    type: "authenticate",
                    payload: {
                        token: token,
                        intention: "reset",
                    },
                };
                connection.send(JSON.stringify(msg))


                location.replace("dead.html")
            }
        } catch (e) {
            console.log(e);
        }

    };


    /**
     * If the server wasn't able to
     * respond to the request in 10 seconds,
     * then refresh the page to reset connection
     */
    setInterval(function () {
        if (connection.readyState !== 1) {
            console.log("Server is down, refreshing page..");
            location.reload()
        }
    }, 5000);

});
