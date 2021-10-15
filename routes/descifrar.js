const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bycrypt = require('bcryptjs');
const aesjs = require('aes-js');
const fs = require('fs');
router.get('/', (req, res) => {
  res.render('descifrar.ejs');
});

router.post(
  '/',
  [
    body('file', 'Se requiere un archivo').not().isEmpty(),
    body('text', 'Ingrese una contraseña de 16, 24 o 32')
      .exists()
      .isLength(16 || 32),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(req.body);
      const valores = req.body;
      const validaciones = errors.array();

      return res.render('descifrar.ejs', {
        validaciones: validaciones,
        valores: valores,
      });
    }
    try {
      const valores = req.body;

      console.log(valores.file);
      if (valores.type === 'AES') {
        fs.readFile(
          `./files/encrypted/${valores.file}`,
          'utf-8',
          function (err, data) {
            // Display the file content
            if (err) console.log(err);

            let encryptedHex = data;

            var key = Buffer.from(valores.text);

            var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

            var aesCtr = new aesjs.ModeOfOperation.ctr(
              key,
              new aesjs.Counter(5)
            );
            var decryptedBytes = aesCtr.decrypt(encryptedBytes);

            var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

            fs.writeFile(
              `./files/decrypted/${decryptedText}-${encryptedHex}.txt`,
              decryptedText,
              (err) => {
                if (err) {
                  return console.error(err);
                } else {
                  console.log('Archivo Guardado');

                  console.log(filename);
                }
              }
            );

            var filename = `${decryptedText}-${encryptedHex}.txt`;
            console.log(filename);

            console.log(decryptedText);
            const newValores = {
              ...valores,
              decrypted: decryptedText,
              filename: filename,
            };
            res.render('descifrar.ejs', {
              newValores: newValores,
            });
          }
        );

        // var key = Buffer.from(valores.text);

        // var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

        // var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        // var decryptedBytes = aesCtr.decrypt(encryptedBytes);

        // var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        // console.log(decryptedText);
      }
      if (valores.type === 'bcrypt') {
        fs.readFile(
          `./files/encrypted/${valores.file}`,
          'utf-8',
          async function (err, data) {
            // Display the file content
            if (err) console.log(err);

            const isMatch = await bycrypt.compare(valores.nya, data);

            console.log(isMatch);
            console.log(data);

            if (isMatch) {
              let decrypted = `Correcto! su contraseña es ${valores.nya}`;

              fs.writeFile(
                `./files/decrypted/BCRYPT-${decrypted}${Date.now()}1.txt`,
                decrypted,
                (err) => {
                  if (err) {
                    return console.error(err);
                  } else {
                    console.log('Archivo Guardado');

                    console.log(filename);
                  }
                }
              );
              var filename = `BCRYPT-${decrypted}${Date.now()}1.txt`;

              const newValores = {
                ...valores,
                decrypted: decrypted,
                filename: filename,
              };

              res.render('descifrar.ejs', { newValores: newValores });
            } else {
              const decrypted = 'Incorrecto! Intente denuevo';
              const newValores = {
                ...valores,
                decrypted: decrypted,
                isMatch: isMatch,
              };

              res.render('descifrar.ejs', {
                newValores: newValores,
              });
            }
          }
        );
      }
    } catch (err) {
      console.error(err.message);
      res.render('index.ejs');
    }
  }
);

router.get('/descargar/:id', (req, res) => {
  res.download(
    './files/decrypted/' + req.params.id,
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
