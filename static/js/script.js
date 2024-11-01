for (var i = 1; i <= 2; i++) {
    document.querySelector('.ip' + i).addEventListener('change', function (e) {
        var file = this.files[0];
        document.querySelector('#file' + e.target.classList[1].slice(-1)).innerHTML = file.name;
    });
}

var socket = io.connect('http://' + document.domain + ':' + location.port);
let alertCount = 0;
const selectedMonth = document.getElementById('month');
const selectedYear = document.getElementById('year');

let period;

class ReportData{
    constructor (data){
        this.data = data;
    }
}

let Reports = new ReportData();

document.querySelector('#upload-btn').addEventListener('click', async function (e) {
    if(!selectedMonth.value || !selectedYear.value){
        alert("Choose valid month and year!!")
    }
    period = selectedMonth.value +'-'+ selectedYear.value
    let formData = new FormData(), i = 0;
    document.querySelectorAll('input[type=file]').forEach(function (input) {
        var file = input.files[0];
        if (file == undefined && alertCount == 0) {
            alert('Please select a file to upload');
            alertCount++;
            return;
        }
        alertCount = 0;
        formData.append('file' + ++i, file);
    });
    
    
    formData.append("period", `${period}`);

    if (formData.get('file1') != undefined && formData.get('file2') != undefined) {
        try {
            await fetch('/', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    } else {
        alert("Add Files Correctly!!")
    }
});

socket.on('data-ready', (data)=>{
    // console.log(data);
    Reports.data = data;
    data.forEach((row)=>{
        // console.log(row);
        document.querySelector('table tbody').innerHTML+=`
        <tr><td>${row[0]}</td><td>In Progress</td><td>Queued</tr>`
    });
})

socket.on('report-ready', (index)=>{    
    document.querySelectorAll('table tbody tr')[index].children[1].innerHTML = `<span><a href="/get_report/${Reports.data[index][0]}_${period}_${Reports.data[index][19]}" target="_blank">View</a></span>`;
})

socket.on('mail-sent', (index)=>{    
    document.querySelectorAll('table tbody tr')[index].children[2].innerHTML = `Mail Sent`;
})


