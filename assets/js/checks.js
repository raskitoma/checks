function fetch(server, key, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                callback(JSON.parse(httpRequest.responseText));
            }
        }
    };
    httpRequest.open("GET", "https://" + server + "/api/v1/checks/");
    httpRequest.setRequestHeader("X-Api-Key", key);
    httpRequest.send();
}

function timeSince(date) {
    var v = Math.floor((new Date() - date) / 1000);

    if (v < 60) { // v is seconds
        return v + " second" + (v == 1 ? "" : "s");
    }


    v = Math.floor(v / 60); // v is now minutes
    if (v < 60) {
        return v + " minute" + (v == 1 ? "" : "s");
    }

    v = Math.floor(v / 60); // v is now hours
    if (v < 24) {
        return v + " hour" + (v == 1 ? "" : "s");
    }


    v = Math.floor(v / 24); // v is now days
    return v + " day" + (v == 1 ? "" : "s");
 };

var template = document.querySelector(".check-template");
function updatePanel(node) {
    fetch(node.dataset.server, node.dataset.readonlyKey, function(doc) {
        var tag = "TAG_" + node.dataset.readonlyKey.substr(0, 6);

        // Sort returned checks by name:
        var sorted = doc.checks.sort(function(a, b) {
            return a.name.localeCompare(b.name)
        });

        var fragment = document.createDocumentFragment();
        sorted.forEach(function(item) {
            var div = template.cloneNode(true);
            div.setAttribute("class", tag + " status-" + item.status);
            div.querySelector(".name").textContent = item.name || "unnamed";
            if (item.last_ping) {
                var s = timeSince(Date.parse(item.last_ping)) + " ago";
                div.querySelector(".lp").textContent = s;
            }
            fragment.appendChild(div);
        });


        document.querySelectorAll('.' + tag).forEach(function(element) {
            element.remove();
        });

        node.parentNode.insertBefore(fragment, node.nextSibling);
    });
}

if (window.location.hash) {
    var panel;

    var pairs = window.location.hash.substr(1).split("&");
    for (var i=0, pair; pair=pairs[i]; i++) {
        if (pair.indexOf("theme=") != -1) {
            document.body.setAttribute("class", pair.replace("=", "-"));
            continue;
        }

        var parts = pair.split("=");
        var h1 = document.createElement("H1");
        h1.dataset.readonlyKey = parts[0];
        if (parts[1]) {
            h1.innerText = decodeURIComponent(parts[1]);
        }

        if (!panel) {
            panel = document.getElementById("panel");
            panel.innerHTML = "";
        }
        panel.appendChild(h1);
    }
}
document.querySelectorAll("h1").forEach(updatePanel);
setInterval(function() {
    document.querySelectorAll("h1").forEach(updatePanel);
}, 5000);

