// Silva Juarez Alejandro

const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
app.use('/cifrar', require('./routes/cifrar'));
app.use('/descifrar', require('./routes/descifrar'));

app.set('view engines', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));
