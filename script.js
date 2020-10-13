
    var dates = [], sensor1 = [], sensor2 = [], sensor3 = [];
    var date = document.getElementsByClassName("date");
    var counter = 0;
    var heading = "SENSOR 1";
    var sensor_data = sensor1;
    var upperLim = 191;
    var lowerLim = 168;
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyClv3rBTrDycP3Ib3kM61ZGj9Io67nOcz0",
        authDomain: "moisture-sensor-be5c5.firebaseapp.com",
        databaseURL: "https://moisture-sensor-be5c5.firebaseio.com",
        projectId: "moisture-sensor-be5c5",
        storageBucket: "moisture-sensor-be5c5.appspot.com",
        messagingSenderId: "794270764532",
        appId: "1:794270764532:web:b5c2ce36ea9dfc1c8cfda1",
        measurementId: "G-EC7DT4MVSX"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    var database = firebase.database();

    /*var ref = firebase.database().ref();
    ref.on('value', function(dataSnapshot){
        var data = dataSnapshot.val();
        var key = dataSnapshot.key;
        console.log(data);
        console.log(key);
    });*/

    async function getData(sensor_data){
        var query = firebase.database().ref("/").orderByKey();
        query.on("value", function(snapshot) {
            dates = [];
            sensor1 = [];
            sensor2 = [];
            sensor3 = [];
            snapshot.forEach(function(childSnapshot) {
                
                var key = childSnapshot.key;
                // childData will be the actual contents of the child

                var childData = childSnapshot.val();
                dates.push(childSnapshot.key);
                sensor1.push(parseInt(snapshot.child(key).child("1").val()));
                sensor2.push(parseInt(snapshot.child(key).child("2").val()));
                sensor3.push(parseInt(snapshot.child(key).child("3").val()));
            });
            apply();
            if (counter == 0) {
                getChart(dates, sensor1);
            } 
            else {
                getChart(dates, sensor_data);
            }
        });

    }
    //determining status of each sensor
    function status(value, id) {
        if(value < lowerLim){
            document.getElementById(id).innerHTML = "ALERT!";
            document.getElementById(id).style.color = "#B22222";
        }
        else if(value < upperLim && value > lowerLim){
            document.getElementById(id).innerHTML = "MAINTENANCE REQ!";
            document.getElementById(id).style.color = "#FF8C00";
        }
        else{
            document.getElementById(id).innerHTML = "GOOD";
            document.getElementById(id).style.color = "#228B22";
        }
    }

    //applying the values in the table
    function apply() {
        var len = (dates.length) - 1;
        var value1 = sensor1[len];
        var value2 = sensor2[len];
        var value3 = sensor3[len];
        console.log(dates);
        console.log(sensor2);
        
        for (let index = 0; index < date.length; index++) {
            date[index].innerHTML = dates[len];                
        }
        document.getElementById("data1").innerHTML = value1;
        status(value1, "status1");
        document.getElementById("data2").innerHTML = value2;
        status(value2, "status2");
        document.getElementById("data3").innerHTML = value3;
        status(value3, "status3");
    }
    getData(sensor_data);

    function getChart(dates, sensor_data){
        console.log(sensor_data);
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Moisture Values',
                    data: sensor_data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: heading
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
    // setting up chart toggle
    function setChartData(arr, label){
        counter ++;
        heading = label;
        sensor_data = arr;
        getData(arr);
    }

    document.getElementById("chart1").onclick = function() {setChartData(sensor1, "SENSOR 1")};
    document.getElementById("chart2").onclick = function() {setChartData(sensor2, "SENSOR 2")};
    document.getElementById("chart3").onclick = function() {setChartData(sensor3, "SENSOR 3")};


    $(document).ready(function () {
        $("#sidebar").mCustomScrollbar({
            theme: "minimal"
        });

        $('#sidebarCollapse').on('click', function () {
            $('#sidebar, #content').toggleClass('active');
            $('.collapse.in').toggleClass('in');
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
        });
    });
