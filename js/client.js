window.uMessage = user_facing_message;

class Client {
    constructor() {
        this.xhttp = new XMLHttpRequest();
        this.insert = "INSERT";
        this.select = "SELECT";
        if(localStorage.getItem("capacity") == null) {
            localStorage.setItem("capacity", "0");
        }

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
        let capacity = parseInt(localStorage.getItem("capacity"));
        let status_area = document.getElementById("status");
        const sarah = `'${capacity+1}', 'Sarah Brown', '1901-01-01'`;
        const john = `'${capacity+2}', 'John Smith', '1941-01-01'`;
        const jack = `'${capacity+3}', 'Jack Ma', '1961-01-30'`;
        const elon = `'${capacity+4}', 'Elon Musk', '1999-01-01'`;
        const preset_query = `INSERT INTO patients (patientid, name, dateOfBirth) VALUES (${sarah}), (${john}), (${jack}), (${elon})`;        
        capacity+=4;
        localStorage.setItem("capacity", JSON.stringify(capacity));
        
        this.xhttp.open("POST", "https://strahd2.com/COMP4537/labs/5/api/database/", true);
        this.xhttp.send(`?command=${preset_query}`);

        this.xhttp.onload = function () {
            const response = JSON.parse(this.responseText)
            status_area.innerHTML = uMessage.STATUS + response.response;
        }
    }

    submitQuery(query) {
        let status_area = document.getElementById('status');
        console.log(encodeURI(query.toLowerCase()));

        const firstWord = this.extractQuery(query);
        console.log(firstWord);
        if(firstWord == "INSERT") {
            this.xhttp.open("POST", "https://strahd2.com/COMP4537/labs/5/api/database/", true);
            this.xhttp.send(`?command=${query}`);
            
            this.xhttp.onload = function () {
                const response = JSON.parse(this.responseText)
                status_area.innerHTML = uMessage.STATUS + response.response;
            }
        } else if(firstWord == "SELECT") {
            this.xhttp.open("GET", `https://strahd2.com/COMP4537/labs/5/api/database?command=${encodeURI(query.toLowerCase())}`, true);
            this.xhttp.send();

            this.xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const response = JSON.parse(this.responseText); // Parse JSON response
                    console.log(response);
                    let tableresult = "";
                    for (let i = 0; i < response.response.length; i++) {
                        tableresult +=
                            `<tr>
                                <td>${response.response[i].patientid}</td>
                                <td>${response.response[i].name}</td>
                                <td>${response.response[i].dateOfBirth}</td>
                             </tr>`;
                    
                    }                    
                    document.getElementById('result-table').innerHTML = tableresult;
                }
            };
            
        } else {
            window.alert(uMessage.INVALID_QUERY);
        }
    }

    // Check if the first word of the query is SELECT or INSERT
    extractQuery(query) {
        let firstWord = ""
        for(let i = 0 ; i < this.insert.length; i++) {
            if(this.insert[i] == query[i]){
                firstWord += this.insert[i];
            } else {
                firstWord = "";
                break;
            }
        }
        if(firstWord.length == 0) {
            for(let i = 0 ; i < this.select.length; i++) {
                if(this.select[i] == query[i]){
                    firstWord += this.select[i];
                } else {
                    firstWord = "";
                    break;
                }
            }
        }

        if(firstWord.length != 0) {
            return firstWord;
        }else {
            return "invalid";
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const client = new Client();
});
