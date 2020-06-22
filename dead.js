server = "localhost:8080"


$(function () {

    $(document).on("click", "#newButton", function () {
        let token = localStorage.getItem("token")

        let msg = {
            type: "authenticate",
            payload: {
                token: token,
                intention: "reset",
            },
        };

        connection.send(JSON.stringify(msg))
        location.replace("http://" + server + "/game.html")
    })


    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        alert("Sorry, but your browser doesn't support WebSocket.")
        return;
    }

    // TODO don't forget to use secure connection with e.g. ssl
    // open connection
    let connection = new WebSocket("ws://" + server + "/ws");


    // WebSocket Event open and EventHandler onOpen
    connection.onopen = function () {};


    // WebSocket Event error and EventHandler onError
    connection.onerror = function (error) {
        console.log("Error");
    };

    // WebSocket Event message and EventHandler onMessage
    connection.onmessage = function (message) {
        console.log("onmessage");

        try {
            var json = JSON.parse(message.data);

            console.log(json)

            if (!json.dead) {
                location.replace("http://" + server + "/game.html")
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
