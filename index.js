const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')
var mysql = require('mysql');
const fileUpload = require('express-fileupload');
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const mongoURI = "mongodb://localhost:27017/revenup";

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wt_database',
    timezone: 'utc'
});
mongoose.connect(mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true } ,()=>{
    console.log("mongodb connected")
})
const mongoDBConnection = mongoose.connection;



let gfs;

mongoDBConnection.once('open', () => {
  // Init stream
//   gfs = Grid(mongoDBConnection.db, mongoose.mongo);
//   gfs.collection('chat');
gfs = new mongoose.mongo.GridFSBucket(mongoDBConnection.db, {
    bucketName: "chat"
  });
});
app.use(cors({
    credentials: true,
    origin: true
}));
// app.use(fileUpload());


app.use(express.static(__dirname + '/uploads'));
app.use(express.json());
const PORT = process.env.PORT || 4000;
// multer disk Storage

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/');
//     },

//     // By default, multer removes file extensions so let's add them back
//     filename: function(req, file, cb) {
//         console.log("file")
//         console.log(file)
//         cb(null, file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "application/octet-stream") {
//         cb(null, true);
//     } else {
//         cb("Type file is not access", false);
//     }
// };

// // var upload = multer({ storage: storage })
// let upload = multer({
//     storage,
//     fileFilter,
//     limits: 1024 * 1024 * 5
// });


// multer gridfs

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'chat'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
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


app.get('/patientInfo/qanda/:patientid', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientid = req.params.patientid
    // var patientid = request.patientid
    //request
    var sql = 'SELECT q.question,a.answer,a.question_id,q.type,q.inputType FROM answer a inner join question q on q.id=a.question_id where a.patient_id=' + patientid;
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



app.put('/patientInfo/qanda/update', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientid = request.patientId;
    var answer = request.answer;
    var questionId = request.questionId;
    
    var sql = 'UPDATE `answer` SET `answer`=? where `patient_id`=? and `question_id`=?';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [answer, patientid, questionId], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ "updated": "true" }));
                //  res.setHeader('Content-Type', 'application/json');
                //res.send(JSON.stringify(result));
                //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })


})

// app.post('/patientInfo/qanda/update', (req, res) => {
//     var request = req.body;
//     console.log(request);
//     var patientid = request.patientid;
//     var qanda = request.answers;
//     console.log(qanda);
//     //request
//     var sql = 'INSERT INTO `answer` (`patient_id`, `question_id`, `answer`) VALUES(?,?,?)';
//     for (i in qanda) {
//         var question_id = qanda[i].question_id;
//         var answer = qanda[i].answer;
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 console.log(err);
//             }

//             var deletesql = "delete from `answer` where `patient_id`=? and `question_id`=? ";
//             connection.query(deletesql, [patientid, question_id], (error, result) => {
//                 if (error) {
//                     console.log(error);
//                 }
//                 else if (result) {
//                     console.log(result);
//                     //  res.setHeader('Content-Type', 'application/json');
//                     //res.send(JSON.stringify(result));
//                     //console.log(groupBy(result, "appointmentDate"));
//                     // console.log(utils.groupBy(result,"appointmentDate"));
//                 }
//             })
//             connection.query(sql, [patientid, question_id, answer], (error, result) => {
//                 if (error) {
//                     console.log(error);
//                 }
//                 else if (result) {
//                     console.log(result);
//                     //  res.setHeader('Content-Type', 'application/json');
//                     //res.send(JSON.stringify(result));
//                     //console.log(groupBy(result, "appointmentDate"));
//                     // console.log(utils.groupBy(result,"appointmentDate"));
//                 }
//             })
//         })
//     }

//     res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify({ "updated": "true" }));
// })



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
    var docSql = 'SELECT * FROM doctor where username=? and password=?';

    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(docSql, [email, password], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log(result);
                console.log("result");
                console.log(result.length);
                if (result.length == 0) {
                    // res.setHeader('Content-Type', 'application/json');
                    // res.send(JSON.stringify("Invalid User"));

                    connection.query(sql, [email, password], (docError, docResult) => {
                        if (docError) {
                            console.log(docError)
                        }
                        else if (docResult) {
                            console.log("docResult")
                            console.log(docResult)

                            if (docResult.length == 0) {
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify("Invalid User"));
                            }
                            else {
                                var patientResult = docResult[0];
                                console.log(patientResult)
                                patientResult['type'] = 'patient';
                                console.log(patientResult)
                                res.setHeader('Content-Type', 'application/json');
                                res.send(JSON.stringify(patientResult));
                            }
                        }

                    })

                    // connection.release();
                } else {
                    var doctorResult = result[0];
                    doctorResult['type'] = 'doctor';
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(doctorResult));
                }
                //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
        // connection.release();
    })
})


app.post('/patientInfo/followup', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientid = request.patientid;

    //request
    var sql = 'SELECT b.did,d.name,s.start_time,s.end_time,b.visit_type,b.appointment_type,b.DOV  FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id WHERE b.id in (select `follow_up_id` from book where `pid`=' + patientid + ' )';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query(sql, [], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result) {
                console.log("Followup")
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));

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
                res.send(JSON.stringify(result[0]));
                //console.log(groupBy(result, "appointmentDate"));
                // console.log(utils.groupBy(result,"appointmentDate"));
            }
        })
    })
})



app.get('/doctor/clinicdetails/:doctorid', (req, res) => {
    var request = req.body;
    console.log(request);

    var did = req.params.doctorid;
    // var did = request.doctorid;

    //request
    var sql = "SELECT * FROM `clinic` WHERE cid in (SELECT cid FROM `doctor_availability` WHERE did =? )";
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


app.get('/patientInfo/getDoctor/:patientId', (req, res) => {
    var request = req.body;
    console.log(request);
    var patientId = req.params.patientId;
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

app.get('/patientInfo/getPatient/:doctorId', (req, res) => {
    var request = req.body;
    console.log(request);
    var doctorId = req.params.doctorId;
    var sql = 'SELECT id,name,gender,contact,email FROM `patient` WHERE id in (SELECT pid FROM book where did = ?)';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        connection.query(sql, [doctorId], (error, result) => {
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


app.get('/getPatient/pastAppointment/:doctorId', (req, res) => {
    // var requestBody = req.body;
    var doctorId = req.params.doctorId
    // var sql = 'SELECT * FROM patient where id in (SELECT pid from book where DOV<CURDATE() and DID=?)';
    var sql = 'SELECT b.did,b.dov,b.pid,b.Fname,b.visit_type,b.follow_up_id,s.start_time,s.end_time FROM book b inner join doctor d on b.did=d.did  inner join slot s on b.slot_id =s.id WHERE b.did=? and b.DOV<CURDATE()';
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }
        connection.query(sql, [doctorId], (error, result) => {
            if (error) {
                console.log(error)

            }
            else if (result) {
                console.log(result)
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            }
        })
    })

})



//Consultation

app.get('/consult_doctor/:doctorId',(req,res)=>{
var doctorId= req.params.doctorId
var patientId= req.query.patientId;

var sql=`SELECT * FROM consultation where patientId=? and doctorId=?`;
pool.getConnection((err,connection)=>{
    if(err){
        console.log(err)
    }
    connection.query(sql,[patientId,doctorId],(error,result)=>{
        if(error){
            console.log(error);
        }
        else if(result){
            console.log(result);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }
    })
})
})

app.get('/consult_patient/:patientId',(req,res)=>{
var doctorId= req.query.patientId
var patientId= req.params.patientId;

var sql=`SELECT * FROM consultation where patientId=? and doctorId=?`;
pool.getConnection((err,connection)=>{
    if(err){
        console.log(err)
    }
    connection.query(sql,[patientId,doctorId],(error,result)=>{
        if(error){
            console.log(error);
        }
        else if(result){
            console.log(result);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        }
    })
})
})


app.post('/patientQuery',(req,res)=>{
    var requestBody =request.body;

    var patientId = requestBody.patientId;
    var doctorId = requestBody.doctorId;
    var patientQuery = requestBody.patientQuery;

    var sql =`INSERT INTO consultation(patientId,doctorId,patientQuery) VALUES(?,?,?)`;

    pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }
        connection.query(sql,[patientId,doctorId,patientQuery],(error,result)=>{
            if(error){
                console.log(error);
            }
            else if(result){
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send({'message':'Successfully sent'});
                // res.send(JSON.stringify(result));
            }
        })
    })

})

app.put('/doctorSolution',(req,res)=>{
    var requestBody =request.body;

    var patientId = requestBody.patientId;
    var doctorId = requestBody.doctorId;
    var doctorResponse = requestBody.doctorResponse;

    // var sql =`INSERT INTO consultation(patientId,doctorId,doctorResponse) VALUES(?,?,?)`;
var sql=`UPDATE consultation SET doctorResponse=? where patientId=? and doctorId=?`;
    pool.getConnection((err,connection)=>{
        if(err){
            console.log(err)
        }
        connection.query(sql,[doctorResponse,patientId,doctorId],(error,result)=>{
            if(error){
                console.log(error);
            }
            else if(result){
                console.log(result);
                res.setHeader('Content-Type', 'application/json');
                res.send({'message':'Successfully sent'});
                // res.send(JSON.stringify(result));
            }
        })
    })

})

//multer
app.post('/upload',upload.any('video'),(req,res)=>{
    console.log('req')
    console.log(req.files)
//     const file = req.files.file;
//   console.log(file.data);
//   let fileUploadPath =`${__dirname}/uploads/${file.name}`;
//   var sql = "INSERT INTO video(videopath,video) VALUES(?,?)";
//   file.mv(fileUploadPath, err => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }
//     // console.log(fileUploadPath)
    
//     // console.log(`${__dirname}/uploads/${file.name}`);
//     res.json({ fileName: file.name, filePath: fileUploadPath });
//   });
    
})



// express file upload
app.post('/uploads', (req, res) => {
    console.log("Uploading");
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  console.log(file.data);
  let fileUploadPath =`${__dirname}/uploads/${file.name}`;
  var sql = "INSERT INTO video(videopath,video) VALUES(?,?)";
  file.mv(fileUploadPath, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    // console.log(fileUploadPath)
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
        }

        connection.query(sql, [fileUploadPath,file.data], (error, result) => {
            if (error) {
                console.log(error)

            }
            else if (result) {
                // console.log(result)
                res.setHeader('Content-Type', 'application/json');
                // res.send(JSON.stringify(result));
                 res.json({ fileName: file.name, filePath: fileUploadPath });
            }
        })
    })
    // console.log(`${__dirname}/uploads/${file.name}`);
    // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.post('/videoUpload', (req, res) => {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
    const fileUploadPath =`${__dirname}/uploads/${file.name}`;
    file.mv(fileUploadPath, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
      res.json({ fileName: file.name, filePath:fileUploadPath });
    });
  });


