class Client {
    constructor() {
        this.xhttp = new XMLHttpRequest();

        const preset_button = document.getElementById("pre-set-row");
        const submit_query = document.getElementById("submit-query");


        preset_button.addEventListener('click', () => {
            this.insertPresetQuery();
        });

        submit_query.addEventListener('click', () => {
            let query = document.getElementById("query-input-area").value;
            this.submitQuery(query);
        })
    }

    insertPresetQuery() {
        // this.xhttp.open("GET", ``, true);
        // this.xhttp.send();

        // this.xhttp.onreadystatechange = function () {
        //    if(this.readyState == 4 && this.status == 200) {
        //     // TBD
        //    }
        // }
    }

    submitQuery(query) {
        const firstSpaceIndex = query.indexOf(' ');
        const firstWord = query.substring(0, firstSpaceIndex);
        
        if(firstWord == "INSERT") {
            // this.xhttp.open("POST", "");
            // this.xhttp.send(query);
        
            // this.xhttp.onload = function () {
            //     //TBD
            // }
        } else {
        // this.xhttp.open("GET", ``, true);
        // this.xhttp.send();

        // this.xhttp.onreadystatechange = function () {
        //    if(this.readyState == 4 && this.status == 200) {
        //     // TBD
        //    }
        // }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const client = new Client();
});
