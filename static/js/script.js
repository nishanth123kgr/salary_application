for (var i = 1; i <= 2; i++) {
    document.querySelector('.ip' + i).addEventListener('change', function (e) {
        var file = this.files[0];
        document.querySelector('#file' + e.target.classList[1].slice(-1)).innerHTML = file.name;
    });
}

var socket = io.connect('http://' + document.domain + ':' + location.port);
let alertCount = 0;

document.querySelector('#upload-btn').addEventListener('click', async function (e) {
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
    if (formData.get('file1') != undefined && formData.get('file2') != undefined) {
        try {
            await fetch('/', {
                method: 'POST',
                body: formData
            });
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }
});

socket.on('data-ready', (data)=>{
    console.log(data);
    data.forEach((row)=>{
        console.log(row);
        document.querySelector('table tbody').innerHTML+=`
        <tr><td>${row[0]}</td><td>In Progress</td></tr>`
    });
})

socket.on('report-ready', (index)=>{
    document.querySelectorAll('table tbody tr')[index].children[1].innerHTML = 'Done';
})
