const express = require('express')
const ejs = require('ejs')
const path = require('path')
const puppeteer = require('puppeteer')
const app = express()

const passengers = [
    {
        name: "Joyce",
        flightNumber: 7859,
        time: "18h00",
    },
    {
        name: "Brock",
        flightNumber: 7859,
        time: "18h00",
    },
    {
        name: "Eve",
        flightNumber: 7859,
        time: "18h00",
    },
];

app.get('/v1/pdf', async (request, response) => {
    const browser = await puppeteer.launch({ headless: true } )
    const page = await browser.newPage()

    await page.goto('http://localhost:3000/', {
        waitUntil: 'networkidle0'
    })

    const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter',
        margin: {
            top: "20px",
            bottom: "20px",
            left: "20px",
            right: "20px"
        }
    })

    response.contentType("application/pdf")

    await browser.close()

    return response.send(pdf)
})

app.get('/', (request, response) => {

    ejs.renderFile( path.join(__dirname, "print.ejs"), {passengers}, (err, data) => {
        if(err){
            return response.send("Erro na leitura do arquivo")
        }

        return response.send(data)
    })
})

app.listen(3000)