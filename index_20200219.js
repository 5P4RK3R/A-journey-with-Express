const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')
var mysql = require('mysql');



function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
        var key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wt_database',
    timezone: 'utc'  
});
app.use(cors({
    credentials: true,
    origin: true
}));


app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Listening on Port 4000');
});





app.post('/sms', (req, res) => {
    // console.log(JSON.parse(req));

    // console.log(JSON.parse(req.body));
    var requestBody = req.body;
    // console.log(req);
    var mobileNo = requestBody.mobileNo;
    // res.setHeader('Content-Type', 'application/json');
    console.log(requestBody);
    let otp = Math.round(Math.random(100) * 10000);
    console.log(otp);
    var sql = "INSERT INTO otp(mobileNo,otp) VALUES(?,?)";
    var deleteQuery = `DELETE FROM otp`;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [mobileNo, otp], (error, result) => {
            if (error) {
                console.log(error);
            }
            if (result) {
                res.send(JSON.stringify({ "Otp": otp }));
            }

        })
        connection.release();
    })

});


app.post('/otp', (req, res) => {
    var requestBody = req.body;
    console.log(requestBody);
    var mobileNo = requestBody.mobileNo;
    var otp = requestBody.otp;
    var sql = `SELECT otp FROM otp where mobileNo=?`;
    var deleteQuery = `DELETE FROM otp`;
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        connection.query(sql, [mobileNo], (error, result) => {
            if (error) {
                console.log(error)
            }
            if (result) {
                console.log(result)
                console.log(result[0].otp)
                console.log(result[0].otp == otp)
                if (result[0].otp == otp) {
                    res.status(200).send(JSON.stringify({ "message": "Verified Successfully" }));
                    pool.getConnection((poolConnectionError, poolConnection) => {
                        if (poolConnectionError) {
                            console.log("Pool Connection Error");
                        }
                        poolConnection.query(deleteQuery, [], (deletionError, deletionResult) => {
                            if (deletionError) {
                                console.log(deletionError);
                            }
                            if (deletionResult) {
                                console.log(deletionResult);
                            }
                        });
                        poolConnection.release();

                    })

                }
                else {
                    res.status(403).send(JSON.stringify({ "message": "Otp Expired or Invalid mobileNo" }))
                }
            }
        });
        connection.release();
    })
})



app.post('/auth', (req, res) => {
    var requestBody = req.body;
    console.log(req)
    console.log(requestBody);
    var sql = 'SELECT * FROM user';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error)
            }
            else if (result) {
                // console.log(result);
                res.send(JSON.stringify(result));
            }
        })
    });

})


app.get('/patientInfo', (req, res) => {
    var request = req.body;
    // console.log(request);
    var sql = 'SELECT * FROM patient';
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})


app.post('/patientInfo/qanda', (req, res) => {
    var request = req.body;
    console.log(request);
	var patientid=request.patientid
	//request
    var sql = 'SELECT q.question,a.answer FROM answer a inner join question q on q.id=a.question_id where a.patient_id='+patientid;
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})


app.post('/patientInfo/appointment', (req, res) => {
    var request = req.body;
    console.log(request);
	var patientid=request.patientid;
	var currentDate=request.date;
	//request
    var sql = 'SELECT b.did,d.name,s.start_time,s.end_time FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id WHERE b.pid='+patientid+' and b.DOV>="'+currentDate+'"' ;
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})


app.post('/doctor/appointment', (req, res) => {
    var request = req.body;
    console.log(request);
	var doctorid=request.doctorid;
	var currentDate=request.date;
	//request
    var sql = 'SELECT b.did,b.Fname,s.start_time,s.end_time FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id WHERE b.did='+doctorid+' and b.DOV>="'+currentDate+'"' ;
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})

app.post('/patientInfo/doctoradvice', (req, res) => {
    var request = req.body;
    console.log(request);
	var patientid=request.patientid;
	
	//request
    var sql = 'SELECT b.did,d.name,b.DOV,s.start_time,s.end_time,da.prescription,da.ivf,da.followup FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id left join doctor_advice da on b.id=da.booking_id WHERE b.pid='+patientid ;
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})


app.post('/patientInfo/appointment/book', (req, res) => {
    var request = req.body;
    console.log(request);
	var patientid=request.patientid;
	var reqDate=request.date;
	var slotid=request.slotid;
	var user=request.user;
	var fname=request.fname;
	var CID=request.CID;
	var DID=request.DID;
	var Timestamp=request.Timestamp;
	var status=request.status;
	var gender=request.gender;
    //request
    
   var inssql = 'INSERT INTO book (pid,Username,Fname,Gender,CID,DID,DOV,Timestamp,Status,slot_id) VALUES ('+patientid+',"'+user+'","'+fname+'","'+gender+'","'+CID+'","'+DID+'","'+reqDate+'","'+Timestamp+'","'+status+'","'+slotid+'")';
   console.log(inssql);
   var sql='select * from book where pid='+patientid+' and dov="'+reqDate+'" and slot_id='+slotid;
   console.log(sql);
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result.length);
                
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
				if (result.length!=0){
					
					res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({"status":"not available"}));
				}else{
				connection.query(inssql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({"status":"success"}));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
				
				
			})
				}
            }else{
				
        }
    })
})

})


app.post('/signup', (req, res) => {
    var request = req.body;
    console.log(request);
	var name=request.name;
	var contact=request.contact;
	var email=request.email;
	var password=request.password;
	
	//request
    var sql = 'INSERT INTO `patient` (`name`, `contact`, `email`, `username`, `password`) VALUES(?,?,?,?,?)';
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [name, contact,email,email,password],(error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})



app.post('/patientInfo/qanda/update', (req, res) => {
    var request = req.body;
    console.log(request);
	var patientid=request.patientid;
	var qanda=request.qanda;
	
	//request
    var sql = 'INSERT INTO `patient` (`name`, `contact`, `email`, `username`, `password`) VALUES(?,?,?,?,?)';
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
  /*  pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [name, contact,email,email,password],(error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
                 //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })*/
})