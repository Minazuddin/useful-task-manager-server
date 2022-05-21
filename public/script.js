const baseUrl = 'http://localhost:3000';
const apiUrl = baseUrl + '/users/taskManager/addTask';

const getDateCreated = () => {
    const date = new Date();
    return `${date.getDate()}-${date.getMonth() - 1}-${date.getFullYear()}`
}

const submitTask = async (e) => {
    e.preventDefault();
    const formEl = document.querySelector('#task-form')
    const form = new FormData(formEl)
    
    const taskData = {
        ['DATE']: getDateCreated(),
        ['PROJECT']: form.get('project'),
        ['TASK']: form.get('task'),
        ['START TIME']: form.get('start-time'),
        ['END TIME']: form.get('end-time'),
        ['NOTES']: form.get('notes')
    }
    let errorMsg = '', error = false;
    if(!taskData['PROJECT']) { errorMsg += 'Field "PROJECT" Is Required!\n'; error = true; }
    if(!taskData['TASK']) { errorMsg += 'Field "TASK" Is Required!\n'; error = true; }
    if(!taskData['START TIME']) { errorMsg += 'Field "START TIME" Is Required!\n'; error = true; }
    if(!taskData['END TIME']) { errorMsg += 'Field "END TIME" Worked Is Required!\n'; error = true; }
    if(!taskData['NOTES']) { errorMsg += 'Field "NOTES" Is Required!\n'; error = true; }
    if(error) return alert(errorMsg)

    console.log(taskData)

    const method = 'POST';
    const body = JSON.stringify(taskData);
    const headers = {
        ['Content-Type']: 'application/json'
    }
    fetch(apiUrl, {
        method,
        headers,
        body
    })
    .then(res => res.json())
    .then(data => {
        alert(data.msg)
        console.log(data)
    })
    .catch(err => console.log(err))
}