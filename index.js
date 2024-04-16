const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
    fs.readFile('./home.html', 'utf-8', (err, html) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
               
        res.send(html);
        console.log('GET HOME PAGE')
    })
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running on port http://localhost:3000'));
