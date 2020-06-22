/**
 * extended base from websocket example
 * simplified some parts and extended with API call to receive token
 * for later token authentication at sending messages
 */

server = "localhost:8080"

$(function () {

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        alert("Sorry, but your browser doesn't support WebSocket.");
        return;
    }

    // open connection
    let connection = new WebSocket("ws://" + server + "/ws");


    // WebSocket Event open and EventHandler onOpen
    connection.onopen = function () {
        let token = localStorage.getItem("token")

        console.log("Connection to server established")
        let msg = {
            type: "authenticate",
            payload: {
                token: token,
                intention: "update",
            },
        };

        connection.send(JSON.stringify(msg));
    };


    $(document).on("click", "#feedButton", function () {
        let token = localStorage.getItem("token")
        let msg = {
            type: "authenticate",
            payload: {
                token: token,
                intention: "feed",
            },
        };

        connection.send(JSON.stringify(msg));
    })

    $(document).on("click", "#brushButton", function () {
        let token = localStorage.getItem("token")
        let msg = {
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
        console.log("Error");
    };

    // WebSocket Event message and EventHandler onMessage
    connection.onmessage = function (message) {
        console.log("Updating knodel stats");

        try {
            let json = JSON.parse(message.data);

            $("#foodValue").html(json.food)
            $("#brushValue").html(json.brushy)

            localStorage.setItem("food", json.food)
            localStorage.setItem("brushy", json.brushy)

            console.log(json)

            if (json.dead) {
                location.replace("dead.html")
            }
        } catch (e) {
            console.log(e);
        }

    };


    /**
     * If the server wasn't able to
     * respond to the request in 5 seconds,
     * then refresh the page to reset connection
     */
    setInterval(function () {
        if (connection.readyState !== 1) {
            console.log("Server is down, refreshing page..");
            location.reload()
        }
    }, 5000);

});
