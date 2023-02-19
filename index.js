var baseUrl = 'http://api.login2explore.com:5577'
var irl = '/api/irl'
var iml = '/api/iml'
var clgDB = 'COLLEGE-DB'
var proRln = 'PROJECT-TABLE'
var connTkn = '90932566|-31949277773185621|90949355'

$('#proId').focus()

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data)
    localStorage.setItem('recno', lvData.rec_no)
}

function getProIdAsJsonObj() {
    var proId = $('#proId').val()
    var jsonStr = {
        id: proId
    }
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj)
    var data = JSON.parse(jsonObj.data).record
    $('#proName').val(data.name)
    $('#proAssTo').val(data.assignedTo)
    $('#proAssD').val(data.assignedDate)
    $('#ddln').val(data.deadline)
}

function getPro() {
    var proIdJsonObj = getProIdAsJsonObj()
    var getReq = createGET_BY_KEYRequest(connTkn, clgDB, proRln, proIdJsonObj)
    jQuery.ajaxSetup({ async: false })
    var resJsonObj = executeCommandAtGivenBaseUrl(getReq, baseUrl, irl)
    jQuery.ajaxSetup({ async: true })
    if (resJsonObj.status === 400) {
        $('#save').prop('disabled', false)
        $('#reset').prop('disabled', false)
        $('#proId').focus()
    } else if (resJsonObj.status === 200) {
        $('#proId').prop('disabled', true)
        fillData(resJsonObj)
        $('#update').prop('disabled', false)
        $('#reset').prop('disabled', false)
        $('#proId').focus()
    }
}

function validateData() {
    var proId, proName, proAssTo, proAssD, ddln
    proId = $('#proId').val()
    proName = $('#proName').val()
    proAssTo = $('#proAssTo').val()
    proAssD = $('#proAssD').val()
    ddln = $('#ddln').val()
    if (proId === '') {
        alert("Project ID is missing")
        $('#proId').focus()
        return ''
    }
    if (proName === '') {
        alert("Project Name is missing")
        $('#proName').focus()
        return ''
    }
    if (proAssTo === '') {
        alert("Project Assigned To is missing")
        $('#proAssTo').focus()
        return ''
    }
    if (proAssD === '') {
        alert("Project Assigned Date is missing")
        $('#proAssD').focus()
        return ''
    }
    if (ddln === '') {
        alert("Deadline is missing")
        $('#ddln').focus()
        return ''
    }
    var jsonStrObj = {
        id: proId,
        name: proName,
        assignedTo: proAssTo,
        assignedDate: proAssD,
        deadline: ddln
    }
    return JSON.stringify(jsonStrObj)
}

function resetData() {
    $('#proId').val("")
    $('#proName').val("")
    $('#proAssTo').val("")
    $('#proAssD').val("")
    $('#ddln').val("")
    $('#proId').prop('disabled', false)
    $('#save').prop('disabled', true)
    $('#change').prop('disabled', true)
    $('#reset').prop('disabled', true)
    $('#proId').focus()
}

function saveData() {
    var jsonStrObj = validateData()
    if (jsonStrObj === '')
        return ''
    var putReq = createPUTRequest(connTkn, jsonStrObj, clgDB, proRln)
    jQuery.ajaxSetup({ async: false })
    var resJsonObj = executeCommandAtGivenBaseUrl(putReq, baseUrl, iml)
    jQuery.ajaxSetup({ async: true })
    resetData()
    $('#proId').focus()
}

function updateData() {
    $('#update').prop('disabled', true)
    jsonUpdate = validateData()
    var updateReq = createUPDATERecordRequest(connTkn, jsonUpdate, clgDB, proRln, localStorage.getItem('recno'))
    jQuery.ajaxSetup({ async: false })
    var resJsonObj = executeCommandAtGivenBaseUrl(updateReq, baseUrl, iml)
    jQuery.ajaxSetup({ async: true })
}