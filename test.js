const bcrypt = require("bcrypt");

async function hash(pass){
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(pass,saltRounds);
    return hashPass
}

async function verify(pass,passDB){
    const check = await bcrypt.compare(pass,passDB);
    return check;
}

const password = "qwerty123$"




async function check() {
    const hashpass = await hash(password);
    console.log(hashpass);
    let is = await verify(password,hashpass);
    console.log(is);

}

check();


const Nestedarr = [2,3,4,[11,24],7];

const arr = Nestedarr.flat(1)

console.log(arr)
