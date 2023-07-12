const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
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
    var patientid = request.patientid
    //request
    var sql = 'SELECT q.question,a.answer FROM answer a inner join question q on q.id=a.question_id where a.patient_id=' + patientid;
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

//done
app.post('/patientInfo/appointment', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientid = request.patientid;
    var currentDate = request.date;
    //request
    var sql = 'SELECT b.did,b.DOV,b.CID,c.address,b.appointment_type,d.name,s.start_time,s.end_time FROM book b inner join doctor d on b.did=d.did inner join clinic c on c.cid=b.CID inner join slot s on b.slot_id =s.id WHERE b.pid=' + patientid + ' and b.DOV>="' + currentDate + '"';
    // var sql = 'SELECT b.did,b.DOV,b.CID,b.appointment_type,d.name,s.start_time,s.end_time FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id WHERE b.pid=' + patientid + ' and b.DOV>="' + currentDate + '"';
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

//done
app.post('/doctor/appointment', (req, res) => {
    var request = req.body;
    console.log(request);
    var doctorid = request.doctorid;
    var currentDate = request.date;
    //request
    var sql = 'SELECT b.did,b.dov,b.pid,b.Fname,b.visit_type,b.follow_up_id,s.start_time,s.end_time FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id WHERE b.did=' + doctorid + ' and b.DOV>="' + currentDate + '"';
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

//done
app.post('/patientInfo/doctoradvice', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientid = request.patientid;

    //request
    var sql = 'SELECT b.did,d.name,b.DOV,s.start_time,s.end_time,da.prescription,da.type,da.followup,c.name FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id left join doctor_advice da on b.id=da.booking_id inner join clinic c on da.clinic_id=c.cid WHERE b.pid=' + patientid;
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

//done
app.post('/patientInfo/appointment/book', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientid = request.patientid;
    var reqDate = request.date;
    var slotid = request.slotid;
    var user = request.user;
    var fname = request.fname;
    var CID = request.CID;
    var DID = request.DID;
    var Timestamp = request.Timestamp;
    var status = request.status;
    var gender = request.gender;
    var visitType = request.visitType;
    var appointmentType = request.appointmentType;
    var useraddress = request.useraddress;
    var useremailId = request.useremailId;
    var userlocation = request.userlocation;
    var userphoneno = request.userphoneno;
    var doctorFees = request.doctorFees;
    //request

    var inssql = 'INSERT INTO book (pid,Username,Fname,Gender,CID,DID,DOV,Timestamp,Status,slot_id,visit_type,appointment_type,useraddress,useremailId,userlocation,userphoneno,doctorFee) VALUES (' + patientid + ',"' + user + '","' + fname + '","' + gender + '","' + CID + '","' + DID + '","' + reqDate + '","' + Timestamp + '","' + status + '","' + slotid + '","' + visitType + '","' + appointmentType + '","' + useraddress + '","' + useremailId + '","' + userlocation + '","' + userphoneno + '","' + doctorFees + '")';
    console.log(inssql);
    var sql = 'select * from book where pid=' + patientid + ' and dov="' + reqDate + '" and slot_id=' + slotid;
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
                console.log("result")
                //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
                if (result.length != 0) {
                    console.log("Resultssss")
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ "status": "not available" }));
                } else {
                    connection.query(inssql, [], (error, result) => {
                        if (error) {
                            console.log(error);
                        }
                        else if (result) {
                            console.log("resultss")
                            console.log(result);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({ "status": "success" }));
                            //console.log(groupBy(result, "appointmentDate"));
                            // console.log(utils.groupBy(result,"appointmentDate"));
                        }


                    })
                }
            } else {

            }
        })
    })

})

//done
app.post('/signup', (req, res) => {
    var request = req.body;
    console.log(request);
    var name = request.name;
    var contact = request.contact;
    var email = request.email;
    var password = request.password;

    //request
    var sql = 'INSERT INTO `patient` (`name`, `contact`, `email`, `username`, `password`) VALUES(?,?,?,?,?)';
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [name, contact, email, email, password], (error, result) => {
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
    var patientid = request.patientid;
    var qanda = request.answers;
    console.log(qanda);
    //request
    var sql = 'INSERT INTO `answer` (`patient_id`, `question_id`, `answer`) VALUES(?,?,?)';
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    for (i in qanda) {
        var question_id = qanda[i].question_id;
        var answer = qanda[i].answer;
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
            }

            var deletesql = "delete from `answer` where `patient_id`=? and `question_id`=? ";
            connection.query(deletesql, [patientid, question_id], (error, result) => {
                if (error) {
                    console.log(error);
                }
                else if (result) {
                    console.log(result);
                    //  res.setHeader('Content-Type', 'application/json');
                    //res.send(JSON.stringify(result));
                    //console.log(groupBy(result, "appointmentDate"));
                    // console.log(utils.groupBy(result,"appointmentDate"));
                }
            })
            connection.query(sql, [patientid, question_id, answer], (error, result) => {
                if (error) {
                    console.log(error);
                }
                else if (result) {
                    console.log(result);
                    //  res.setHeader('Content-Type', 'application/json');
                    //res.send(JSON.stringify(result));
                    //console.log(groupBy(result, "appointmentDate"));
                    // console.log(utils.groupBy(result,"appointmentDate"));
                }
            })
        })
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify('{"updated":"true"}'));
})



app.post('/patientInfo/doctoradvice/update', (req, res) => {
    var request = req.body;
    console.log(request);
    var booking_id = request.booking_id;
    var prescription = request.prescription;
    var followup = request.followup;
    var type = request.type;
    var clinic_id = request.clinic_id;

    //request
    var sql = 'INSERT INTO `doctor_advice` (`booking_id`, `prescription`, `followup`, `type`, `clinic_id`) VALUES(?,?,?,?,?)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [booking_id, prescription, followup, type, clinic_id], (error, result) => {
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

//done
app.post('/login', (req, res) => {
    var request = req.body;
    console.log(request);

    var email = request.email;
    var password = request.password;

    //request
    var sql = 'select * from `patient` where email=? and password=?';
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [email, password], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                console.log(result.length);
                if (result.length == 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify("Invalid User"));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(result));
                }
                //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})


app.post('/patientInfo/followup', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientid = request.patientid;

    //request
    var sql = 'SELECT b.did,d.name,s.start_time,s.end_time,b.visit_type,b.appointment_type,b.DOV  FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id WHERE b.id in (select `follow_up_id` from book where `pid`=' + patientid + ' )';
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


app.get('/aboutus', (req, res) => {
    var request = req.body;
    // console.log(request);
    var result = '{"GYNECOLOGIST":{"img":["http://1.jpg","http://2.jpg"]},"Fertility Specialists":{"img":["http://1.jpg","http://2.jpg"]}}';
    //console.log();
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
    //console.log(groupBy(result, "appointmentDate"));
    // console.log(utils.groupBy(result,"appointmentDate"));

})

//done

app.post('/patientInfo/getslots', (req, res) => {
    var request = req.body;
    console.log(request);
    var cityid = request.cityid;
    dayOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    var daystr = "";
    var datestr = "";
    var sql = "";


    getDoctorId(cityid, function (response) {
        // Here you have access to your variable
        for (var i = 0; i < 3; i++) {
            var j = Math.floor(Math.random() * dayOfWeek.length);
            var day = dayOfWeek[j];
            var date = getNextDayOfTheWeek(day, true);
            if (i < 2)

                sql += "(SELECT slot.*,'" + date + "' as DOA FROM `slot` join doctor_availability da where da.did = 1 and day='" + day + "' and slot.start_time >= da.starttime and slot.end_time <= da.endtime and slot.id not in (select slot_id from book where DOV='" + date + "' and did=" + response + " and cid=" + cityid + ") ORDER BY RAND () LIMIT 3) union";
            else
                sql += "(SELECT slot.*,'" + date + "' as DOA FROM `slot` join doctor_availability da where da.did = 1 and day='" + day + "' and slot.start_time >= da.starttime and slot.end_time <= da.endtime and slot.id not in (select slot_id from book where DOV='" + date + "' and did=" + response + " and cid=" + cityid + ") ORDER BY RAND () LIMIT 3) ";


            console.log(day + "=" + date);
        }

        console.log(sql);
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
        //res.setHeader('Content-Type', 'application/json');
        //          res.send(JSON.stringify(response));
    })



})

function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
    const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
        .indexOf(dayName.slice(0, 3).toLowerCase());
    if (dayOfWeek < 0) return;
    refDate.setHours(0, 0, 0, 0);
    refDate.setDate(refDate.getDate() + !!excludeToday +
        (dayOfWeek + 7 - refDate.getDay() - !!excludeToday) % 7);
    console.log("ref" + refDate.toLocaleDateString())
    console.log("ref" + refDate.toDateString())
    console.log("ref" + refDate.toUTCString())
    console.log("ref" + refDate.toISOString())
    let formatted_date = refDate.getFullYear() + "-" + (refDate.getMonth() + 1) + "-" + refDate.getDate()
    console.log(formatted_date)
    return refDate.toISOString();
}

function getDoctorId(cityid, callback) {

    var sql = 'SELECT did FROM `doctor_availability` WHERE cid =? ORDER BY RAND () LIMIT 1';
    var did = "";
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [cityid], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                Object.keys(result).forEach(function (key) {
                    var row = result[key];
                    did = row.did;
                    console.log(row.did);
                    console.log(did);
                    //return did;
                    return callback(did);
                });
                //did=obj.did;
                //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
                //return did;
            }
        })
    })
    //console.log("**"+did);
    //return did;
}

//done
app.post('/clinic/details', (req, res) => {
    var request = req.body;
    console.log(request);
    var did = request.doctorid;
    var cityid = request.cityid;

    //request
    var sql = "SELECT * FROM `clinic` WHERE cid in (select cid from doctor_availability where did=? ) and city=?";
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [did, cityid], (error, result) => {
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



//done
app.post('/clinic/getslots', (req, res) => {
    var request = req.body;
    console.log(request);
    // var cityid = request.cityid;
    var did = request.doctorid;
    var clinicid = request.cid;
    dayOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    var daystr = "";
    var datestr = "";
    var sql = "";



    // Here you have access to your variable
    for (var i = 0; i < 3; i++) {
        var j = Math.floor(Math.random() * dayOfWeek.length);
        var day = dayOfWeek[j];
        var date = getNextDayOfTheWeek(day, true);
        if (i < 2)

            sql += "(SELECT slot.*,'" + date + "' as DOA FROM `slot` join doctor_availability da where da.did = " + did + " and day='" + day + "' and slot.start_time >= da.starttime and slot.end_time <= da.endtime and slot.id not in (select slot_id from book where DOV='" + date + "' and did=" + did + " and cid=" + clinicid + ") ORDER BY RAND () LIMIT 3) union";
        else
            sql += "(SELECT slot.*,'" + date + "' as DOA FROM `slot` join doctor_availability da where da.did = " + did + " and day='" + day + "' and slot.start_time >= da.starttime and slot.end_time <= da.endtime and slot.id not in (select slot_id from book where DOV='" + date + "' and did=" + did + " and cid=" + clinicid + ") ORDER BY RAND () LIMIT 3) ";


        console.log(day + "=" + date);
    }

    console.log(sql);
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

        //res.setHeader('Content-Type', 'application/json');
        //          res.send(JSON.stringify(response));
    })



})

//done

app.get('/getCities', (req, res) => {
    var request = req.body;
    console.log(request);
    var sql = 'SELECT * FROM city';
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
            }
        })
    });
})



app.post('/clinic', (req, res) => {
    var request = req.body;
    console.log(request);

    var cid = request.clinicid;

    //request
    var sql = "SELECT * FROM `clinic` WHERE cid =?";
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [cid], (error, result) => {
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


app.post('/doctor', (req, res) => {
    var request = req.body;
    console.log(request);

    var did = request.doctorid;

    //request
    var sql = "SELECT did,name,gender,experience,specialization,contact,address,home_appointment_fees FROM `doctor` WHERE did =?";
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [did], (error, result) => {
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



app.post('/doctor/clinicdetails', (req, res) => {
    var request = req.body;
    console.log(request);

    var did = request.doctorid;

    //request
    var sql = "SELECT * FROM `clinic` WHERE cid in (SELECT cid FROM `doctor_availability` WHERE did =? )";
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [did], (error, result) => {
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

app.post('/clinic/doctordetails', (req, res) => {
    var request = req.body;
    console.log(request);

    var did = request.doctorid;

    //request
    var sql = "SELECT did,name,gender,experience,specialization,contact,address,home_appointment_fees FROM `doctor` WHERE did in (SELECT did FROM `doctor_availability` WHERE cid =? )";
    // var sql = 'SELECT * FROM patient GROUP BY date(appointmentDate)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [did], (error, result) => {
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


app.post('/patientInfo/getDoctor', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientId = request.pid;
    var sql = 'SELECT did,name,gender,experience,specialization,contact,address,home_appointment_fees FROM `doctor` WHERE did in (SELECT DID FROM book where pid = ?)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        connection.query(sql, [patientId], (error, result) => {
            if (error) {
                console.log(error)
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            }
        })
    })
})