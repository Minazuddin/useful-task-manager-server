const { config } = require('./config')

//3. READ DATA FROM SHEET
const readData = async (range) => {
    const { spreadsheetId, auth, googleSheetInstance } = await config();
    const result = await googleSheetInstance.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range
    })
    return result;
}

//4. WRITE DATA INTO SHEET
const writeData = async (range, values) => {
    const { spreadsheetId, auth, googleSheetInstance } = await config();
    console.log('values', values)
    const result = await googleSheetInstance.spreadsheets.values.append({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range, //sheet name and range of cells
        // insertDataOption: "Sheet1!B10",
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
            values
        },
    });
    console.log(result)
    return result;
}

const updateData = async (range, values) => {
    const { spreadsheetId, auth, googleSheetInstance } = await config();
    console.log('values', values)
    const result = await googleSheetInstance.spreadsheets.values.update({
        auth, //auth object
        spreadsheetId, //spreadsheet id
        range, //sheet name and range of cells
        // insertDataOption: "Sheet1!B10",
        valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
        resource: {
            values
        },
    });
    console.log(result)
    return result;
}

//5. REMOVE DATA FROM SHEET
const clearData = async (range) => {
    const { spreadsheetId, auth, googleSheetInstance } = await config();
    const result = await googleSheetInstance.spreadsheets.values.clear({
        auth,
        spreadsheetId,
        range
    })
    console.log(result)
    return result;
}

module.exports = {
    readData,
    writeData,
    updateData,
    clearData
}