const google = require('googleapis');

//CONCFIGURATION
const spreadsheetId = '1EzNMag3WtHybDpciFluX6WpPEy4ZocGABuxOTtImTiY'; //from sheets url

const auth = new google.Auth.GoogleAuth({
    keyFile: 'keys.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
})

//1. GET GOOGLE SHEET INSTANCE

const config = async () => {
    const authClientObject = await auth.getClient();
    googleSheetInstance = new google.sheets_v4.Sheets({ auth: authClientObject })
    return {
        auth,
        spreadsheetId,
        googleSheetInstance
    }
}

module.exports = {
    config
}