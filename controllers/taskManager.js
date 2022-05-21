const path = require('path');
const sheet = require('../googleSheetsApi/index')
const { baseUrl } = require('../config')

exports.renderHomePage = async (req, res) => {
    try {
        return res.redirect(baseUrl + '/index.html'); //http://localhost:3000/index.html -> will fetch the index.html file (from public folder)
    } catch (err) {
        console.error(err)
    }
}

const findLastRowIndex = async () => {
    //write dummy content to find the last row
    const testWriteResult = await sheet.writeData('Sheet1', [['Finding Last Row']])
    const lastRowInfo = testWriteResult.data.updates.updatedRange;
    let lastRowIndex = lastRowInfo.split('!')[1].split(':')[0].split('')[1];
    return [testWriteResult, lastRowIndex];
}

const convertTo24HrsFormat = (time) => {
    if (time.includes('pm')) {
        //1:00pm, 12:00pm
        time = time.replace('pm', '')
        time = time.split(':')
        let hh = Number(time[0]), mm = Number(time[1])
        if (hh !== 12 && mm !== 0) return { hh: hh + 12, mm }
    } else if (time.includes('am')) {
        //8:00am
        time = time.replace('am', '')
        time = time.split(':')
        let hh = Number(time[0]), mm = Number(time[1])
        return { hh, mm }
    }
}

const getTotalHoursSpentForTheDay = (startTime, endTime) => {
    //10:15am to 7:00pm
    console.log({ startTime, endTime })
    startTime = convertTo24HrsFormat(startTime)
    endTime = convertTo24HrsFormat(endTime)
    console.log({ startTime, endTime })
    const diffInHours = (endTime.hh) - (startTime.hh) //9
    const diffInMinutes = Math.abs((endTime.mm) - (startTime.mm)) //30
    const totalHours = `${diffInHours} hrs ${diffInMinutes} min`
    console.log('totalHours', totalHours)
    return totalHours;
}

const makeAnEntryUpdate = async (RANGE, data) => {
    const TIME_TO_ENTER = getTotalHoursSpentForTheDay(data['START TIME'], data['END TIME'])
    const result = await sheet.updateData(RANGE, [[data['DATE'], data['PROJECT'], data['TASK'], data['START TIME'], data['END TIME'], data['NOTES'], TIME_TO_ENTER]])
    if (result.status !== 200) return [result, false]
    return [null, true]
}

const makeAnEntryAdd = async (RANGE, data) => {
    const TIME_TO_ENTER = getTotalHoursSpentForTheDay(data['START TIME'], data['END TIME'])
    const result = await sheet.writeData(RANGE, [[data['DATE'], data['PROJECT'], data['TASK'], data['START TIME'], data['END TIME'], data['NOTES'], TIME_TO_ENTER]])
    if (result.status !== 200) return [result, false]
    return [null, true]
}

const makeAnEntry = async (data) => {
    const INPUT_DATE = data['DATE'];
    const readResult = await sheet.readData('Sheet1')
    const readResultDataValues = readResult.data.values;
    const numberOfRows = readResultDataValues.length;
    const lastRowIndex = numberOfRows - 1;
    const lastRowData = readResultDataValues[lastRowIndex];
    const RANGE = `Sheet1!A${lastRowIndex + 1}:G${lastRowIndex + 1}`;
    console.log({ readResultDataValues, lastRowIndex })

    const DATE_IN_SHEET = lastRowData[0];
    console.log('date', { INPUT_DATE, DATE_IN_SHEET })
    if (INPUT_DATE == DATE_IN_SHEET) {
        //UPDATE
        console.log('make an entry : updating,,,')
        const [err, success] = await makeAnEntryUpdate(RANGE, data)
        if (err) return [err, false]
    } else {
        //ADD
        console.log('make an entry : adding,,,')
        const [err, success] = await makeAnEntryAdd(RANGE, data)
        if (err) return [err, false]
    }
    return [null, true];
}

exports.addTask = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const [err, success] = await makeAnEntry(data)
        if (err) return res.status(500).json({ msg: 'Something Went Wrong! Try Later!' })
        return res.status(200).json({
            msg: 'Task Added Successfully!'
        })
    } catch (err) {
        console.error(err)
    }
}