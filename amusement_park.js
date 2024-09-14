const express = require('express');
const app = express();
const port = 3000;

let purhased_ticket_no = -1;
let remaining_money = -1;
let ride_money = -1;
let go_ahead = false;

function ticket_seller_middleware(req, res, next){
    const money = req.headers.money || -2;
    const ride_no = req.headers.ride_no || -2;
    const height = req.headers.height || -2;
    if(money == -2 || ride_no == -2 || height == -2){
        res.status(404).json({
            msg : "First give money and go through security checks"
        });
    } else {
        if(height < 4){
            res.status(404).json({
                msg : "Height less than 4ft"
            })
        } else {
            if(ride_no < 1 || ride_no > 3){
                res.status.json({
                    msg : "No such ride exists",
                    rides : "from 1 to 3"
                })
            } else {
                if(ride_no == 1 && money < 100){
                    res.status(404).json({
                        msg : "Not enoght money for ride no. 1",
                        required_money : 100
                    })
                } else if (ride_no == 2 && money < 200){
                    res.status(404).json({
                        msg : "Not enoght money for ride no. 2",
                        required_money : 200
                    })
                } else if (ride_no == 3 && money < 500){
                    res.status(404).json({
                        msg : "Not enought money for rifde no. 3",
                        required_money : 500
                    })
                } else {
                    purhased_ticket_no = ride_no;
                    ride_money = ride_no == 1 ? 100 : (ride_no == 2 ? 200 : (ride_no == 3 ? 500 : 0));
                    remaining_money = money - ride_money; 
                    console.log(`purhased_ticket_no = ${purhased_ticket_no}`);
                    next();
                }
            }
        }
    }
}

function ticket_checker_middleware(req, res, next){
    if(purhased_ticket_no == -1){
        res.status(404).json({
            msg : "First purchase ticket"
        });
    } else {
        if(purhased_ticket_no < 1 || purhased_ticket_no > 3){
            res.status(404).json({
                msg : "Invalid ticket no.",
                valid_ticket_nums : "1,2,3"
            })
        } else {
            go_ahead = true;
            console.log("go ahead");
            next();
        }
    }
}

function rides_middleware(req, res, next){
    mentioned_ride_no = req.query.ride_no || -1;
    if(!go_ahead){
        res.status(404).json({
            msg : "You can't go ahead"
        });
    } else {
        if(mentioned_ride_no == -1){
            res.status(404).json({
                msg : "mention ride no. in query"
            });
        } else if (mentioned_ride_no < 1 || mentioned_ride_no > 3){
            res.status(404).json({
                msg : `ride no. ${mentioned_ride_no} doesn't exist`
            });
        } else if(mentioned_ride_no != purhased_ticket_no){
            res.status(404).json({
                msg : `you haven't purchased ticket for ${mentioned_ride_no}`
            });
        } else {
            next();
        }
    }
}

app.get('/', (req, res) => {
    res.json({
        buy : "to buy ticket visit /ticket-seller",
        ride : "to ride got /rides and give ride no. "
    });
});

app.post('/ticket-seller', ticket_seller_middleware, (req, res) => {
    res.status(200).json({
        msg : `You have successfully purchased ticket no. ${purhased_ticket_no}`,
        remaining_money : `${remaining_money}`,
        next : "go to /ticket-checker"
    });
});

app.post('/ticket-checker', ticket_checker_middleware, (req, res) => {
    res.status(200).json({
        msg : "You're ticket is valid",
        next : "go to /rides and mention ride no."
    });
});

app.get('/rides', rides_middleware, (req, res) => {
    res.status(200).json({
        msg : `Woohooooo... ride no. ${purhased_ticket_no} is so much fun`
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});