const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.send('Hello');
});

const port = process.env.PORT;
app.listen(port, () => console.log(`server started at ${port}...`));

