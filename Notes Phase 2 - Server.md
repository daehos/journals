## Server Initiation

### Install package

        npm init -y

        npm i express sequelize pg jsonwebtoken bcryptjs dotenv cors

        npm i -D sequelize-cli nodemon

        touch .gitignore
        write inside file -> node_modules

---

### Setup database with sequelize (ORM)

        npx sequelize-cli init

1.  Settings config -> development and test
2.  Create Database

        npx sequelize-cli db:create

3.  Set-up model

    > buat sesuai kebutuhan

        command-line :
        npx sequelize-cli model:create --name <name> --attributes title:string, _... etc_

4.  Set-up migration file

    > ***
    >
    > setting constraint sesuai dengan soal
    >
    > ***
    >
    > example :
    >
    > - unique
    > - allowNull
    > - references key
    >   > <model, key>
    > - onUpdate <_cascade_>
    > - onDelete <_cascade_>
    >
    > ***

5.  Migrate db

        command-line :
        npx sequelize-cli db:migrate

6.  Set-up seeding

    > buat sesuai kebutuhan

        command-line :
        npx sequelize-cli seed:create --name <name>

    | Cara Seeding |

    - bulk json data yang di sediakan dan juga buat sendiri yang belum ada
    - pakai mapping untuk delete data json apabila ada id dan tambahakan createdAt dan updatedAt dengan new date
    - jangan lupa juga untuk tambahkan hashPassword di seed users jika diperlukan

    > ***
    >
    > Optional for testing :
    >
    > - tambah option restartIdentity, cascade, truncate
    > - dibuat true _(Ini biasa di pakai untuk testing seed env)_
    >
    > ***

7.  Seed db

        command-line :
        npx sequelize-cli db:seed:all

---

### Set-up kebutuhan helpers bcyrpt dan jwt \*_if needed_

        mkdir helpers
        touch helpers/bcrypt.js helpers/jwt.js

1.  helpers bcrypt.js | _Bcryptjs_

    > ***
    >
    > - buat function hashing password dan compare password
    > - [Check Documentation Here](https://www.npmjs.com/package/bcryptjs#usage---sync)
    > - _Important Notes_ >> jangan lupa untuk hashPassword juga harus di buat di seeding user dan hooks model user
    >
    > ***

2.  helpers jwt.js | _Jason Web Token_
    > ***
    >
    > - buat function signToken dan verifyToken >> _nama fungsi sesuaikan dengan soal_
    > - jangna lupa di module export
    > - [Check Documentation Here](https://www.npmjs.com/package/jsonwebtoken)
    >
    > ***

### Set-up express

        touch app.js

[Check documentation here](https://expressjs.com/en/starter/hello-world.html)

set-up <app.use> needed for express:

- urlencoded
- json pake invoke
- [cors](https://www.npmjs.com/package/cors) -> _to connect with client_

- using bin/www

        mkdir bin
        touch bin/www

  > ***
  >
  > 1. import app from app.js
  > 2. set-up port
  > 3. listen to port
  >
  > ***

- Set-up package.json
    - buat dev isinya untuk npx nodemon <sesuai_dengan_listen_dimana>
---

### IF Use ENV

How to use ENV :

        input nama variable dalam file .env [<nama_variable>="<value>"]

        gunakan variable dengan cara [process.env.<nama_variable>]

        di apps harus di install => agar global use

        jika process.env.NODE_ENV bukan "production"
        maka gunakan => require('dotenv').config()

            di bin/www juga install (jika pakai)
            tampung PORT = process.env.PORT || 3000 (untuk local host)

___
### Set-up router

        mkdir routers

        touch routers/index.js

- _add more js file based on requirements_

> index js
>
> - import express from express
> - buat variable router dari <_express.Router()_>
> - sesuaikan router path dengan requirements
> - module export router
>
> ---

___
### Set-up middleware

        mkdir middleware

Starter middleware file :

        middleware/authentication.js middleware/errorHandling.js

_yang menyesuaikan biasanya touch middleware/authorization.js_

___
### Middleware | _authentication_ |

1. buat asycn functionnya terima parameter req,res,next
2. ambil variabel authorization dari req.headers
3. jika authorization falsy maka throw error kasih nama terserah
4. tampung token dari authorization => di split dengan spasi ambil index 1 nya
5. buat variable payload dengan helper jwt => verify token
6. cari user dengan find by pk menggunakan payload.id
7. jika user falsy maka throw error yang sama dengan falsy authorization / sesuaikan dengan soal
8. terakhir manipulasi request bisa membuat req.user => isi dengan id: <id user>
9. jangan lupa di next
10. di catch tinggal next err nya
11. jangan lupa di module exports

```js
const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/");

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw { name: "error_name_1" };

    const token = authorization.split(" ")[1];

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.id);

    if (!user) throw { name: "error_name_1" };

    req.user = { id: user.id };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { authentication };
```
___
### Middleware | _errorHandler_ |

1. buat functionnya terima parameter err,req,res,next
2. buat variable penampung untuk status dan message
3. buat kondisi bisa pakai if else atau switch case
4. parameter kondisi itu nama errornya
5. khusus untuk Sequelize Validation Error dan Unique Constraint Error
   => pakai error.errors[0].message untuk message nya
6. buat sesuai dengan permintaaan soal
7. di akhir di res.status dan json => object isinya message { <message> }
8. jangan lupa handle juga untuk JsonWebTokenError, InvalidToken, TokenExpiredError (biasanya suka ke lewat)
9. jangan lupa di module exports

```js
// Regular starter for error handler
function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Internal server error";

// use switch case for each of error name
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      status = 400;
      message = err.errors[0].message;
      break;
  }

  res.status(status).json({ message });
}

module.exports = { errorHandler };
```
___
### Set-up controller sesuai dengan soal

jangan lupa controller sekarang sudah harus pakai req, res, dan next karena ada middleware
next cuma di pakai di catch saja

        mkdir controllers
        touch controllers/controller.js

___
### Starter Controller | _Login_ | use for signToken

1. ambil email dan pass dari req body
2. jika email falsy => throw kasih nama terserah
3. jika password falsy => throw kasih nama terserah
4. buat variable user cari dengan findOne dari email req body
5. jika user falsy => throw kasih nama biasanya "Unautenticated"
6. buat variable penampung untuk check comparePassword dengan helper dari bcryptjs
7. jika compare falsy => throw kasih nama biasanya "Unautenticated"
8. buat access_token dengan fungsi signToken dari helper jwt, payloadnya object => id isinya user.id
9. res status sesuai perintah soal (biasanya di kirim access tokennya sebagai json)

```js
const { User } = require('../models/')
const { signToken } = require('../helpers/jwt')
const { comparePass } = require('../helpers/bcrypt')

class UserController {

    static asycn function (req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email) throw {name: "error_name_1"}
            if (!password) throw {name: "error_name_2"}

            const user = await User.findOne({where: {email}})

            if (!user) throw {name: "error_name_3"}

            const checkPass = comparePass(password, user.password)

            if (!checkPass) throw {name: "error_name_3"}

            const access_token = signToken({id: user.id})

            res.status(200).json({access_token})

        } catch (err) {
            next(err)
        }
    }
}

module.exports = UserController
```
___

### Set-up Testing

1. npm i -D supertest jest
2. Setting scripts di _package.json_
    - jika ada testing dan sudah install jest
    - => test di ganti dengan "jest --runInBand"
3. Create database untuk testing nya
        
        npx sequelize-cli db:create --env test
        npx sequelize-cli db:migrate --env test



