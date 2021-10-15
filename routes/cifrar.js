const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const bycrypt = require('bcryptjs');
const aesjs = require('aes-js');
const fs = require('fs');

console.log(crypto.getCiphers());

router.get('/', (req, res) => {
  res.render('cifrar.ejs');
});

router.post(
  '/',
  [
    body('nya', 'Se requiere un nombre').not().isEmpty(),
    body(
      'text',
      'Ingrese una contraseña de 16, 24 o 32 (Tambien solo se aceptan[a-zA-Z0-9]'
    )
      .exists()
      .isLength({
        min: 16,
        max: 32,
      })
      .matches(/^[a-zA-Z0-9]+(\s*[a-zA-Z0-9]*)*[a-zA-Z0-9]+$/),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    var valores = req.body;
    if (!errors.isEmpty()) {
      console.log(req.body);

      const validaciones = errors.array();
      return res.render('cifrar.ejs', {
        validaciones: validaciones,
        valores: valores,
      });
    }

    try {
      if (valores.type === '192') {
        // console.log('AES 192');

        let secret_message = valores.nya;

        var key = Buffer.from(valores.text);
        if (key.length === 16 || key.length === 32) {
          var error = 'Este no es un aes de 192,';

          console.log(error);
        } else {
          if (key.length !== 24) {
            key = Buffer.from('123456781234567812345678');
            console.log(key.length);
            console.log('llave cambiada');
            var error = 'Su contraseña no cumple con los requisitos,';
          }
        }

        var textBytes = aesjs.utils.utf8.toBytes(secret_message);

        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

        var encryptedBytes = aesCtr.encrypt(textBytes);

        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

        fs.writeFile(
          `./files/encrypted/${encryptedHex}-${encryptedBytes}.txt`,
          encryptedHex,
          (err) => {
            if (err) {
              return console.error(err);
            } else {
              console.log('Archivo Guardado');

              console.log(filename);
            }
          }
        );
        var filename = `${encryptedHex}-${encryptedBytes}.txt`;

        console.log(encryptedHex);
        const newValores = {
          ...valores,
          encrypted: encryptedHex,
          err: error,
          key: key,
          filename: filename,
        };

        res.render('cifrar.ejs', { newValores: newValores });
      }
      if (valores.type === '256') {
        let secret_message = valores.nya;

        var key = Buffer.from(valores.text);

        if (key.length === 16 || key.length === 24) {
          var error = 'Este no es un aes de 256,';

          console.log(error);
        } else {
          if (key.length !== 32) {
            key = Buffer.from('12345678123456781234567812345678');
            console.log(key.length);
            console.log('llave cambiada');
            var error = 'Su contraseña no cumple con los requisitos,';
          }
        }
        var textBytes = aesjs.utils.utf8.toBytes(secret_message);

        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

        var encryptedBytes = aesCtr.encrypt(textBytes);

        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

        fs.writeFile(
          `./files/encrypted/${encryptedHex}-${encryptedBytes}.txt`,
          encryptedHex,
          (err) => {
            if (err) {
              return console.error(err);
            } else {
              console.log('Archivo Guardado');

              console.log(filename);
            }
          }
        );
        var filename = `${encryptedHex}-${encryptedBytes}.txt`;

        console.log(encryptedHex);
        const newValores = {
          ...valores,
          encrypted: encryptedHex,
          err: error,
          key: key,
          filename: filename,
        };

        res.render('cifrar.ejs', { newValores: newValores });
      }
      if (valores.type === 'bcrypt') {
        const salt = await bycrypt.genSalt(10);

        encrypted = await bycrypt.hash(valores.nya, salt);

        fs.writeFile(
          `./files/encrypted/BCRYPT-${Date.now()}1.txt`,
          encrypted,
          (err) => {
            if (err) {
              return console.error(err);
            } else {
              console.log('Archivo Guardado');

              console.log(filename);
            }
          }
        );
        var filename = `BCRYPT-${Date.now()}1.txt`;

        const newValores = {
          ...valores,
          encrypted: encrypted,
          filename: filename,
        };

        res.render('cifrar.ejs', { newValores: newValores });
      }
      if (valores.type === '128') {
        let secret_message = valores.nya;

        var key = Buffer.from(valores.text);

        if (key.length === 24 || key.length === 32) {
          var error = 'Este no es un aes de 128,';

          console.log(error);
        } else {
          if (key.length !== 16) {
            key = Buffer.from('1234567812345678');
            console.log(key.length);
            console.log('llave cambiada');
            var error = 'Su contraseña no cumple con los requisitos,';
          }
        }
        var textBytes = aesjs.utils.utf8.toBytes(secret_message);

        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

        var encryptedBytes = aesCtr.encrypt(textBytes);

        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

        console.log(encryptedHex);

        fs.writeFile(
          `./files/encrypted/${encryptedHex}-${encryptedBytes}.txt`,
          encryptedHex,
          (err) => {
            if (err) {
              return console.error(err);
            } else {
              console.log('Archivo Guardado');

              console.log(filename);
            }
          }
        );
        var filename = `${encryptedHex}-${encryptedBytes}.txt`;

        const newValores = {
          ...valores,
          encrypted: encryptedHex,
          err: error,
          key: key,
          filename: filename,
        };

        res.render('cifrar.ejs', { newValores: newValores });
      }
    } catch (err) {
      console.error(err.message);
      res.render('index.ejs');
    }
  }
);

router.get('/descargar/:id', (req, res) => {
  res.download(
    './files/encrypted/' + req.params.id,
    req.params.id,
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Listo');
      }
    }
  );
});

module.exports = router;
