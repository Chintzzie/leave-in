function noorganizers(){
    document.getElementById("noorganizersform").submit(); 
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
        $('#organizers').fadeOut();
        $('#addorganizers').fadeOut();
    }else if(value==5){
        $('#organizers').fadeIn();
        $('#addorganizers').fadeIn();
    }

}