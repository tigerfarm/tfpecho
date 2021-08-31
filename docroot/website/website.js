// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
function doList() {
    logger("Retrieve HTTP request data.");
    var jqxhr = $.get("/read", function (theResponse, status) {
        if (theResponse === "0") {
            logger("- Error retrieving the data.");
            return;
        }
        addChatMessage(theResponse);
    }).fail(function () {
        logger("- Error retrieving data.");
    });
}

// -----------------------------------------------------------------------------
// UI Functions

function activateChatBox() {
    $("#btn-list").click(function () {
        doList();
    });
    // --------------------------------
}

// -----------------------------------------------------------------------------
function logger(message) {
    var aTextarea = document.getElementById('log');
    aTextarea.value += "\n> " + message;
    aTextarea.scrollTop = aTextarea.scrollHeight;
}
function clearTextAreas() {
    chatMessages.value = "+ Ready";
    log.value = "+ Ready";
}
function addChatMessage(message) {
    var aTextarea = document.getElementById('chatMessages');
    aTextarea.value += "\n" + message;
    aTextarea.scrollTop = aTextarea.scrollHeight;
}
window.onload = function () {
    log.value = "+++ Start.";
    chatMessages.value = "+++ Ready to retrieve previous HTTP request data.";
    activateChatBox();
};
// -----------------------------------------------------------------------------
