const express =  require('express');
const cors = require('cors')
const bcrypt = require('bcrypt')
const mysql = require('mysql2')
const bodyparser = require('body-parser')

const app = express()

//middle ware
app.use(cors())
app.use(express.json())
app.use(bodyparser.urlencoded({extended:true}))

require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});

app.get('/api/get',(req,res) => {

    const selectQuery = "SELECT * FROM students";
    connection.query(selectQuery,(err,result) => {
        if (err) {
            res.status(404).json({message:"not found"})
        }
        res.status(200).send(result)
    })
    })
    
    app.post('/api/post',async (req,res) => {
        const {student_name,email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const insertQuery = "INSERT INTO students(student_name,email,password) VALUES(?,?,?)";
        connection.query(insertQuery,[student_name,email,hashedPassword],(err,result) => {
            if (err) {
             res.status(500).json({message:"not insert"})
            }
            res.status(201).json({message:"Data is inserted"})
        })

    })
     app.post('/api/post/:id',async (req,res) => {
        const {id} = req.params;
        const {student_name,email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const insertQuery = "INSERT INTO students(student_name,email,password,student_no) VALUES(?,?,?,?)";
        connection.query(insertQuery,[student_name,email,hashedPassword,id],(err,result) => {
            if (err) {
             res.status(500).json({message:"not insert"})
            }
            res.status(201).json({message:"Data is inserted"})
        })

    })


app.get('/api/get/:id',(req,res) => {

   const {id} = req.params
    const selectQuery = "SELECT * FROM students WHERE student_id = ?";
    connection.query(selectQuery,[id],(err,result) => {
        if (err) {
            res.status(404).json({message:"not found"})
        }
        res.status(200).json({message:result})
    })
})

app.put('/api/update/:id', async (req,res) => {
    const {id} = req.params;
    const {student_name,email,password} =req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const updateQuery = "UPDATE students SET student_name=?,email=?,password=?";
    connection.query(updateQuery,[student_name,email,hashedPassword,id],(err,result) => {
        if (err) {
            res.status(500).json({message:"No Data To Update"})
        }
        res.status(201).json({message:result})
    })
})

app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;

    const DeleteEnrolledQuery = "DELETE FROM enrollement WHERE student_id = ?";
    const DeleteStudentQuery = "DELETE FROM students WHERE student_id = ?";
    connection.query(DeleteEnrolledQuery, [id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
        }
        connection.query(DeleteStudentQuery, [id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({
                message: "Student and enrolments deleted successfully",
                data: result
            });
        });
    });
});
app.listen(4000,() => {
    console.log('server is running on port 4000');
    
})
 