function nostudents(){
    document.getElementById("nostudentsform").submit(); 
}
$('#startperiod').fadeOut();
$('#endperiod').fadeOut();
$('#enddate').fadeIn();
$('startdate').fadeIn();
function showessential(value){
    if(value==1){
        $('#startperiod').fadeOut();
        $('#endperiod').fadeOut();
        $('#enddate').fadeOut();
        $('startdate').fadeIn();
    }else if(value==2){
        $('#startperiod').fadeOut();
        $('#endperiod').fadeOut();
        $('#enddate').fadeIn();
        $('startdate').fadeIn();
    }else if(value==3){
        $('#startperiod').fadeIn();
        $('#endperiod').fadeIn();
        $('#enddate').fadeOut();
        $('startdate').fadeIn();
    }else if(value==4){
        $('#students').fadeOut();
        $('#addstudents').fadeOut();
    }else if(value==5){
        $('#students').fadeIn();
        $('#addstudents').fadeIn();
    }

}