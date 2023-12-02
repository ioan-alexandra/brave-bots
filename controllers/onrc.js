const path = require("path");
let moment = require('moment');
const puppeteer = require("puppeteer-extra");
let fs = require("fs");

const onrc = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/formONRC.html"));

};

const robot = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/formONRC.html"));

    const user = {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
    };

    const data = {
        start: moment(req.body.start).format('DD.MM.YYYY'),
        end: moment(req.body.end).format('DD.MM.YYYY'),
    }

    run();

    async function run() {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        });
        page = await browser.newPage();
        page.setDefaultTimeout(3000 * 60 * 5);

        await page.goto('https://portal.onrc.ro/ONRCPortalWeb/appmanager/myONRC/public?_nfpb=true&_pageLabel=login#wlp_login');
        await page.evaluate((user) => {
            document.getElementById('u').value = user.email;
            document.getElementById('p').value = user.password;
            document.getElementById('loginForm').submit()
        }, user);
        await page.waitForNavigation();
        await page.waitForFunction(function () {
            return document.getElementsByClassName('logout_button').length;
        });
        await page.goto('https://portal.onrc.ro/ONRCPortalWeb/appmanager/myONRC/wicket?p=rc.certificateConstatatoare');
        await page.evaluate(() => {
            jQuery('form a')[1].click();
        });
        await page.waitForNavigation();
        await page.evaluate((data) => {
            document.getElementById('idTestWicket03__1__4').value = data.start;
            document.getElementById('idTestWicket03__1__5').value = data.end;
            document.getElementById('idTestWicket03__1__b').click()
        }, data);

        await page.waitFor(15000)

        if (!fs.existsSync("facturi")) {
            fs.mkdirSync("facturi")
        }

        while (true) {
            try {
                let hrefs = await page.$$eval('a.details-big.btn', as => as.map(a => a.href));

                for (let el of hrefs) {
                    pageDownload = await browser.newPage();
                    await pageDownload.bringToFront();
                    await pageDownload.goto(el);
                    await pageDownload._client.send("Page.setDownloadBehavior", {
                        behavior: "allow",
                        downloadPath: path.resolve(__dirname, './facturi')
                    });
                    try {
                        let date = await pageDownload.evaluate(function () {
                            return $(`td:contains("Nr/data verificare")`).next().find('span').next().text();
                        });

                        await pageDownload.evaluate(function () {
                            jQuery('td:contains("Descarca (pdf)")').first().find('a')[0].click();
                        }, {timeout: 300000});

                        await pageDownload.waitFor(3000);
                        pageDownload.close();
                    } catch (e) {
                        console.log('test');
                        pageDownload.close();
                    }
                }
                let buttonSelector = await page.$$eval('[title="Urmatoarea"]', as => as.map(a => a.href));
                await page.goto(buttonSelector[0])

            } catch (err) {
                // Ignore the timeout error.
                console.log('Could not find the "Show more button", '
                    + 'we\'ve reached the end.');
                break;
            }
        }
    }
};

module.exports = {
    getONRC: onrc,
    sendONRC: robot
};