var i=require('./users-database');

i.getUsers(function(result){
 // console.log(result);
});

                var mailer=require('./mail.js');
                mailer.sendmail('manuduggal9@gmail.com','again huh!');
                