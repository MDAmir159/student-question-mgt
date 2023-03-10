const express = require('express')
const cors = require('cors')
const app = express();
const apis = require('../routes/allRoutes');
const { PORT } = require('../config');
const upload = require('../config/multerConfig');

app.use(express.urlencoded({extended : true}));
app.use(cors())
app.use(express.json());

app.use(apis);

const port = PORT || 5000;

app.listen(port, () => {
    console.log("Server listening to port ", port);
})