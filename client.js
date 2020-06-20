/**
 * extended base from websocket example
 * simplified some parts and extended with API call to receive token
 * for later token authentication at sending messages
 */

$(function () {
    // for better performance - to avoid searching in DOM
    var content = $("#content");
    var input = $("#input");
    var status = $("#status");

    var token = ""
    // REST
    var restUrl = "localhost:8080"

    $(document).on("click", "#createButton", function () {
        var username = $("#username");
        var password = $("#password");
        // alert(username.value)

        $.ajax({
            type: 'post',
            url: 'http://localhost:8080/user',
            data: {name: "joe", password: "test123"},
            dataType: "html",
            xhrFields: {
                withCredentials: false
            },
            headers: {},
            success: function (data) {
                console.log("Created new user");
                console.log(data);
                // console.log(JSON.parse(data).id);
            },
            error: function () {
                console.log('Sorry...');
            }
        });


        // $.post(
        //     "http://localhost:8080/user",
        //     {name: "joe", password: "test123"},
        //     function (data, status, xhr) {
        //         alert("fuckoff")
        //     });
    });


    // Websocket
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($("<p>", {text: "Sorry, but your browser doesn't support WebSocket."}));
        input.hide();
        $("span").hide();
        return;
    }

    // TODO don't forget to use secure connection with e.g. ssl
    // open connection
    const connection = new WebSocket("ws://127.0.0.1:8080/ws");


    // WebSocket Event open and EventHandler onOpen
    connection.onopen = function () {

        // TODO: do something once connection has been established
        // var msg = {
        //   type: "authenticate",
        //   payload: {
        //     token:
        //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMWM3NTljMC1hOTk1LTExZWEtYTVmYS05MzBjMWUxMjU0ZDAiLCJpYXQiOjE1OTIzMjYwNTB9.pcq62VlD1i4MceeSXL4WaHHgwWPgPcmVGGVzrwcnaGg",
        //     intention: "brush",
        //   },
        // };
        //
        //
        //
        // connection.send(JSON. stringify(msg));
    };


    $(document).on("click", "#feedButton", function () {
        alert("feed")
        var msg = {
            type: "authenticate",
            payload: {
                token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMWM3NTljMC1hOTk1LTExZWEtYTVmYS05MzBjMWUxMjU0ZDAiLCJpYXQiOjE1OTIzMjYwNTB9.pcq62VlD1i4MceeSXL4WaHHgwWPgPcmVGGVzrwcnaGg",
                intention: "feed",
            },
        };

        connection.send(JSON.stringify(msg));
    })

    $(document).on("click", "#brushButton", function () {
        alert("brush")
        var msg = {
            type: "authenticate",
            payload: {
                token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMWM3NTljMC1hOTk1LTExZWEtYTVmYS05MzBjMWUxMjU0ZDAiLCJpYXQiOjE1OTIzMjYwNTB9.pcq62VlD1i4MceeSXL4WaHHgwWPgPcmVGGVzrwcnaGg",
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
    // most important part - incoming messages
    connection.onmessage = function (message) {
        console.log("onmessage");
        // try to parse JSON message. Because we know that the server
        // always returns JSON this should work without any problem but
        // we should make sure that the massage is not chunked or
        // otherwise damaged.
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log("Invalid JSON: ", message.data);
            return;
        }

        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        // first response from the server with user's color
        if (json.type === "message") {
            // it's a single message
            // let the user write another message
            input.removeAttr("disabled");
            addMessage(json.data.text, new Date(json.data.time));
        } else {
            console.log("Hmm..., I've never seen JSON like this:", json);
        }
    };


    // /**
    //  * Send message when user presses Enter key
    //  */
    // input.keydown(function (e) {
    //   if (e.keyCode === 13) {
    //     var msg = $(this).val();
    //     if (!msg) {
    //       return;
    //     }
    //
    //     // extended message object, including bearer token, to verify that message source is authenticated before
    //     var obj = {
    //       text: msg,
    //       token: bearerToken,
    //     };
    //
    //     var json = JSON.stringify(obj);
    //     // send the message as an ordinary text
    //     connection.send(json);
    //     $(this).val("");
    //     // disable the input field to make the user wait until server
    //     // sends back response
    //     input.attr("disabled", "disabled");
    //   }
    // });

    /**
     * This method is optional. If the server wasn't able to
     * respond to the request in 3 seconds then show some error message
     * to notify the user that something is wrong.
     */
    setInterval(function () {
        if (connection.readyState !== 1) {
            status.text("Error");
            input.attr("disabled", "disabled").val("Unable to communicate with the WebSocket server.");
        }
    }, 3000);

    // /**
    //  * Add message to the chat window
    //  */
    // function addMessage(message, dt) {
    //   console.log(message);
    //   content.prepend(
    //     '<p class="chat-message">' +
    //       (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) +
    //       ":" +
    //       (dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes()) +
    //       ": " +
    //       message +
    //       "</p>"
    //   );
    // }\

});
