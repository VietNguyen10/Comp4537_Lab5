window.uMessage = user_facing_message;

class Client {
    constructor() {
        this.xhttp = new XMLHttpRequest();
        this.insert = "insert";
        this.select = "select";
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
        this.getNumberOfRecord()
        .then(capacity => {
            localStorage.setItem("capacity", JSON.stringify(capacity));
        });
        
        let capacity = parseInt(localStorage.getItem("capacity"));
        let status_area = document.getElementById("status");
        const sarah = `'${capacity+1}', 'Sarah Brown', '1901-01-01'`;
        const john = `'${capacity+2}', 'John Smith', '1941-01-01'`;
        const jack = `'${capacity+3}', 'Jack Ma', '1961-01-30'`;
        const elon = `'${capacity+4}', 'Elon Musk', '1999-01-01'`;
        const preset_query = `INSERT INTO patients (patientid, name, dateOfBirth) VALUES (${sarah}), (${john}), (${jack}), (${elon})`;      
        capacity+=5  
        localStorage.setItem("capacity", JSON.stringify(capacity));
        
        this.xhttp.open("POST", "https://strahd2.com/COMP4537/labs/5/api/database/", true);
        this.xhttp.send(`?command=${preset_query}`);

        this.xhttp.onload = function () {
            const response = JSON.parse(this.responseText);
            console.log(response);
            status_area.innerHTML = "";
            if(this.status == 201) {
                status_area.innerHTML = uMessage.SUCCESS;
            } else {

            }
        }
    }

    submitQuery(query) {
        let status_area = document.getElementById('status');
        const firstWord = this.extractQuery(query);

        if(firstWord == "INSERT" || firstWord == "insert") {
            this.xhttp.open("POST", "https://strahd2.com/COMP4537/labs/5/api/database/", true);
            this.xhttp.send(`?command=${query}`);
            
            this.xhttp.onload = function () {
                console.log(this.status);
                const response = JSON.parse(this.responseText)
                status_area.innerHTML = uMessage.STATUS + response.response;
            }
        } 
        
        else if(firstWord == "SELECT" || firstWord == "select") {
            this.xhttp.open("GET", `https://strahd2.com/COMP4537/labs/5/api/database?command=${encodeURI(query.toLowerCase())}`, true);
            this.xhttp.send();
            
            this.xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const response = JSON.parse(this.responseText); 
                    document.getElementById('result-table').innerHTML = "";
                    let tableresult = "";

                    tableresult += "<tr>";
                    for (let key in response.response[0]) {
                        if(key == "count (*)") {
                            key = "Number of record"
                        }
                        tableresult += `<th>${key}</th>`;
                    }
                    tableresult += "</tr>";
                
                    for (let i = 0; i < response.response.length; i++) {
                        tableresult += "<tr>";
                        for (let key in response.response[i]) {
                            tableresult += `<td>${response.response[i][key]}</td>`;
                        }
                        tableresult += "</tr>";
                    }   

                    document.getElementById('result-table').innerHTML = tableresult;
                    status_area.innerHTML = uMessage.SUCCESS;
                } else {
                    status_area.innerHTML = uMessage.FAILED;
                }
            };
            
        } 
        
        else {
            window.alert(uMessage.INVALID_QUERY);
        }
    }

    // Check if the first word of the query is SELECT or INSERT
    extractQuery(word) {
        let firstWord = ""
        let query = word.toLowerCase();
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

    getNumberOfRecord() {
        return new Promise((resolve, reject) => {
            this.xhttp.open("GET", `https://strahd2.com/COMP4537/labs/5/api/database?command=select%20count%20(*)%20from%20patients`, true);
            this.xhttp.send();
    
            this.xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        const response = JSON.parse(this.responseText);
                        let number = response.response[0]['count (*)'];
                        resolve(number); // Resolve the promise with the number
                    } else {
                        reject("Error: Request failed"); // Reject the promise with an error message
                    }
                }
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const client = new Client();
});
