const apiURL = 'http://127.0.0.1:3000/api/v1/feedbacks';
'/api/v1/question/:idq/feedbacks/:idf'
const apiURLDelete = 'http://127.0.0.1:3000/api/v1/question/';

function renderReview(data, index) {
    let divData = '';
    let avgReview = 0;
    for (let i in data) {
        for (let j in data[i].feedback) {
            avgReview += data[i].feedback[j].point;
            if(j == 0){
                divData += `
                <div class="row format-row">
                    <div class="col-lg-12 col-xl-12 col-md-12 col-12 content-review margin-b-20 margin-t-20">
                        <span class="review">${data[i].feedback[j].review}</span>
                        <span class="box-point-number">${data[i].feedback[j].point}</span>
                        <i class="fa-solid fa-trash delete-btn"></i>
                        <i class="fa-solid fa-pen-to-square write-btn"></i>
                    </div>
                </div>
                `
            }
            else{
                divData += `
            <div class="row format-row">
                <div class="col-lg-12 col-xl-12 col-md-12 col-12 content-review margin-b-20">
                    <span class="review">${data[i].feedback[j].review}</span>
                    <span class="box-point-number">${data[i].feedback[j].point}</span>
                    <i class="fa-solid fa-trash delete-btn"></i>
                    <i class="fa-solid fa-pen-to-square write-btn"></i>
                </div>
            </div>
            `
            }
            
        }
    }
    avgReview = (avgReview / (data[index].feedback.length)).toFixed(1);
    document.getElementById('avgReview').innerText = `Average Rating: ${avgReview}`;
    if (data[index].feedback.length == 1 || data[index].feedback.length == 0) {
        document.getElementById('totalReview').innerText = `${data[index].feedback.length} Review`;
    }
    else {
        document.getElementById('totalReview').innerText = `${data[index].feedback.length} Reviews`;
    }

    document.getElementById('contentReview').innerHTML = divData;
};
let feedback = document.getElementsByClassName('fb-input')[0];
feedback.addEventListener('input', () => {
    let value = feedback.value;
    if (value.length < 10 && value.length > 0) {
        document.getElementsByClassName('limit-keyword')[0].innerText = 'Text must be at least 10 character';
    }
    else {
        document.getElementsByClassName('limit-keyword')[0].innerText = '';
    }
});
function postData() {
    let submit = document.getElementsByClassName('main-form')[0];
    let point = 0;
    let pointNumber = document.getElementsByClassName('point-number');
    for (let i = 0; i < pointNumber.length; i++) {
        pointNumber[i].addEventListener('click', () => {
            for (let j = 0; j < pointNumber.length; j++) {
                if(pointNumber[j].className.indexOf('show-color') != -1){
                    pointNumber[j].classList.toggle('show-color');
                }
            }
            pointNumber[i].classList.toggle('show-color');
            point = Number(pointNumber[i].innerText);
        })
    }
    submit.addEventListener('submit', (e) => {
        e.preventDefault();
        for (let i = 0; i < pointNumber.length; i++) {
            if(pointNumber[i].className.indexOf('show-color') != -1){
                point = Number(pointNumber[i].innerText);
            }
        }
        if (document.getElementsByClassName('fb-input')[0].id == '') {
            console.log('OK');
            const newReview = {
                "point": point,
                "review": submit.feedback.value
            }
            point = 0;
            if (newReview.point == 0 || newReview.review == '' || newReview.review.length < 10) {
                alert("Dữ liệu không hợp lệ, Bạn chưa viết review hoặc chưa đánh giá");
            }
            else {
                const postMethod = {
                    method: 'POST', // Method itself
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
                    },
                    body: JSON.stringify(newReview) // We send data in JSON format
                }
                fetch(apiURL, postMethod)
                    .then(response => response.json())
                    .then(async (data) => {
                        alert(data.message);
                        submit.feedback.value = '';
                        getData(apiURL);
                    }) // Manipulate the data retrieved back, if we want to do something with it
                    .catch(err => console.log(err)); // Do something with the error
            }
        
        }
        else {
            const newReview = {
                "point": point,
                "review": document.getElementsByClassName('fb-input')[0].value
            }
            if (newReview.point == 0 || newReview.review == '' || newReview.review.length < 10) {
                alert("Dữ liệu không hợp lệ, Bạn chưa viết review hoặc chưa đánh giá");
            }
            else {
                const putMethod = {
                    method: 'PUT', // Method itself
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
                    },
                    body: JSON.stringify(newReview) // We send data in JSON format
                }
                fetch(apiURLDelete + `${1}/feedbacks/${Number(document.getElementsByClassName('fb-input')[0].id)}`, putMethod)
                    .then(response => response.json())
                    .then(async (data) => {
                        alert(data.message);
                        document.getElementsByClassName('fb-input')[0].value = '';
                        document.getElementsByClassName('fb-input')[0].id='';
                        getData(apiURL);
                    }) // Manipulate the data retrieved back, if we want to do something with it
                    .catch(err => console.log(err)); // Do something with the erro
            }
        }

    })
}
function deleteData() {
    let arrDeleteBtn = document.getElementsByClassName('delete-btn');
    console.log(arrDeleteBtn);
    for (let i = 0; i < arrDeleteBtn.length; i++) {
        arrDeleteBtn[i].addEventListener('click', async () => {
            const deleteMethod = {
                method: 'DELETE', // Method itself
                headers: {
                    'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
                }
            }
            fetch(apiURLDelete + `${1}/feedbacks/${i}`, deleteMethod)
                .then(response => response.json())
                .then(async (data) => {
                    alert(data.message);
                    getData(apiURL)
                }) // Manipulate the data retrieved back, if we want to do something with it
                .catch(err => console.log(err)); // Do something with the error
        })
    }
}
function writeData() {
    let arrFinishBtn = document.getElementsByClassName('write-btn');
    for (let i = 0; i < arrFinishBtn.length; i++) {
        arrFinishBtn[i].addEventListener('click', () => {
            let content = document.getElementsByClassName('review');
            document.getElementsByClassName('fb-input')[0].value = content[i].innerText;
            document.getElementsByClassName('fb-input')[0].id = `${i}`;
            let point = document.getElementsByClassName('box-point-number');
            let pointNumber = document.getElementsByClassName('point-number');
            for(let j = 0; j<pointNumber.length; j++){
                if(pointNumber[j].className.indexOf('show-color') != -1){
                    pointNumber[j].classList.toggle('show-color');
                }
            }
            for(let j = 0; j<pointNumber.length; j++){
                if(point[i].innerText == pointNumber[j].innerText){
                    if(pointNumber[j].className.indexOf('show-color') == -1){
                        pointNumber[j].classList.toggle('show-color');
                    }
                }
            }
        })
    }
}

async function getData(apiURL) {
    let data = [];
    data = JSON.parse(JSON.stringify(await fetch(apiURL).then(res => res.json())));
    console.log(data);
    document.getElementsByClassName('format-text-1')[0].innerText = data[0].title;
    renderReview(data, 0);
    deleteData();
    writeData();
}
getData(apiURL);
postData();

