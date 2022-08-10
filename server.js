const fs = require('fs')
const qs = require('qs')
const http = require('http')
const formidable = require('formidable')

let users = []

let server = http.createServer((req,res) => {
    if (req.method === 'GET') {
        fs.readFile('./templates/index.html','utf-8', (err, data) => {
            res.writeHead(200, {'Content-type' : 'text/html'})
            res.write(data)
            return res.end()
        })
    } else {
        let form = new formidable.IncomingForm()
        form.uploadDir = 'upload/'
        form.parse(req, (err, fields, files) => {
            let userInfo = {
                name: fields.name,
                dob: fields.dob,
                password: fields.password
            }

            if (err) {
                console.log(err.message)
                return res.end(err.message)
            }

            let tmpPath = files.avatar.filepath
            let newPath = form.uploadDir + files.avatar.originalFilename

            userInfo.avatar = newPath
            fs.rename(tmpPath, newPath, (err) => {
                if (err) throw err
                let fileType = files.avatar.mimeType
                let mimeTypes = ["image/jpeg", "image/jpg", "image/png"]
                if (mimeTypes.indexOf(fileType) === -1) {
                    res.writeHead(200, {"Content-Type": "text/html"});
                    return res.end('The file is not in the correct format: png, jpeg, jpg');
                }
            })
            users.push(userInfo);
            console.log(users)
            return res.end('Register success!');
        })
    }
})

server.listen('8080', () => {
    console.log(`Server is running at localhost:8080`)
})
